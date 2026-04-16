import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { logActivity } from '../lib/auditService.js';

/**
 * PHASE 1: Define/Update Fee Structure (Admin)
 * This sets the "Price List" for a specific class and year.
 */
export const updateFeeStructure = async (req: any, res: Response) => {
  try {
    const { classId, academicYearId, feeName, amount, applicableMonth } = req.body;

    // 1. Validation: Ensure all foreign keys and data are present
    if (!classId || !academicYearId || !feeName || amount === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing fields: classId, academicYearId, feeName, and amount are required." 
      });
    }

    // 2. Upsert: Create a new rule or update the amount if it already exists
    const structure = await prisma.feeComponent.upsert({
      where: {
        // Matches the @@unique index in your schema exactly
        classId_academicYearId_feeName_applicableMonth: {
          classId,
          academicYearId,
          feeName,
          applicableMonth: applicableMonth || 0 // 0 = Recurring monthly, 1-12 = One-time month
        }
      },
      update: { amount },
      create: {
        classId,
        academicYearId,
        feeName,
        amount,
        applicableMonth: applicableMonth || 0
      }
    });

    res.status(200).json({
      success: true,
      message: `Fee '${feeName}' successfully set to ₹${amount}`,
      data: structure
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PHASE 1: Fetch Fee Structure
 * Used to display the "Price List" to Admins or Students.
 */
export const getFeeStructure = async (req: any, res: Response) => {
  try {
    const { classId, academicYearId } = req.query;

    if (!classId || !academicYearId) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide classId and academicYearId in query params." 
      });
    }

    const structure = await prisma.feeComponent.findMany({
      where: {
        classId: classId as string,
        academicYearId: academicYearId as string
      },
      orderBy: {
        applicableMonth: 'asc'
      }
    });

    res.json({ success: true, data: structure });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PHASE 2: Bulk Monthly Fee Generator (Admin)
 * URL: POST /api/finance/generate-month
 */
export const generateMonthlyFees = async (req: any, res: Response) => {
  try {
    const { classId, academicYearId, month, year } = req.body;

    // 1. Fetch applicable fee rules for the class
    const rules = await prisma.feeComponent.findMany({
      where: {
        classId,
        academicYearId,
        applicableMonth: { in: [0, parseInt(month)] }
      }
    });

    if (rules.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No fee structure found. Please set Phase 1 rules first!" 
      });
    }

    const totalAmountDue = rules.reduce((sum, rule) => sum + rule.amount, 0);

    // 2. Find all students in this class by looking through the Sections
    // This solves the 'classId does not exist in Student' error
    const students = await prisma.student.findMany({
      where: {
        section: {
          classId: classId // Filter students who belong to sections of THIS class
        },
        isActive: true // Only bill active students
      }
    });

    if (students.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No active students found in this class." 
      });
    }

    // 3. Create the records for every student found
    const result = await prisma.monthlyFeeRecord.createMany({
      data: students.map((student) => ({
        studentId: student.id,
        month: parseInt(month),
        year: parseInt(year),
        amountDue: totalAmountDue,
        status: 'PENDING',
      })),
      skipDuplicates: true, // Safety: Won't crash if you run this twice
    });

    res.status(201).json({
      success: true,
      message: `Generated ${result.count} bills of ₹${totalAmountDue} each.`,
      billedComponents: rules.map(r => r.feeName)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PHASE 3: Update Payment Status (Finance Person)
 * URL: PATCH /api/finance/update-status/:recordId
 */
export const updatePaymentStatus = async (req: any, res: Response) => {
  try {
    const { recordId } = req.params;
    const { status, paymentMode, referenceNo, remarks } = req.body;

    // 1. Find the record
    const existingRecord = await prisma.monthlyFeeRecord.findUnique({
      where: { id: recordId }
    });

    if (!existingRecord) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    // 2. Lock Mechanism: Only Admin can edit a 'VERIFIED' payment
    if (existingRecord.status === 'VERIFIED' && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: "This payment is already VERIFIED and locked. Contact Admin to change it." 
      });
    }

    // 3. Update the record
    const updated = await prisma.monthlyFeeRecord.update({
      where: { id: recordId },
      data: {
        status, // e.g., 'SUBMITTED', 'VERIFIED', 'BOUNCED'
        paymentMode, // 'CASH', 'UPI', 'CHECK'
        referenceNo,
        remarks,
        verifiedBy: req.user.id // Track which Finance person handled this
      }
    });

    res.json({ success: true, message: `Status updated to ${status}`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PHASE 4: The Defaulter Engine
 * Goal: Find all students with unpaid bills for a specific Class/Section.
 */
export const getDefaulters = async (req: any, res: Response) => {
  try {
    const { classId, sectionId } = req.query;

    const defaulters = await prisma.student.findMany({
      where: {
        isActive: true,
        // Filter by Class or specific Section
        section: sectionId ? { id: sectionId as string } : { classId: classId as string },
        // ONLY find students who have unpaid records
        feeRecords: {
          some: {
            status: { in: ['PENDING', 'BOUNCED'] }
          }
        }
      },
      include: {
        section: { include: { class: true } },
        feeRecords: {
          where: {
            status: { in: ['PENDING', 'BOUNCED'] }
          }
        }
      }
    });

    // Format the data for a clean UI table
    const report = defaulters.map(student => {
      const totalOwed = student.feeRecords.reduce((sum, rec) => sum + rec.amountDue, 0);
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        className: student.section.class.name,
        sectionName: student.section.name,
        monthsPending: student.feeRecords.length,
        totalAmountOwed: totalOwed,
        details: student.feeRecords.map(r => ({ month: r.month, year: r.year, amount: r.amountDue }))
      };
    });

    res.status(200).json({
      success: true,
      count: report.length,
      data: report
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PHASE 6: Personal Fee History (Student/Parent)
 * URL: GET /api/finance/my-fees
 */
export const getMyFeeHistory = async (req: any, res: Response) => {
  try {

    const { studentId } = req.params;
    // 1. Find the student record associated with the logged-in User ID
    const student = await prisma.student.findUnique({
      // where: { userId: req.user.id }
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found." });
    }

    // 2. Fetch all their fee records, newest first
    const records = await prisma.monthlyFeeRecord.findMany({
      where: { studentId: student.id },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};