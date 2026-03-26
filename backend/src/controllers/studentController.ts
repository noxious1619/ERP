import type { Request, Response } from "express";
// import { PrismaClient, Role } from "../../generated/prisma/index.js";
import { prisma } from '../lib/prisma.js';
import { Role } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import fs from "fs";
import csv from "csv-parser";


// 1. ADMIT STUDENT (The "Atomic" Transaction)
export const admitStudent = async (req: Request, res: Response) => {
  const { 
    email, password, firstName, lastName, dateOfBirth, gender, 
    address, phoneNumber, sectionId, admissionNumber, 
    fatherName, fatherPhone, motherName, motherPhone, 
    emergencyPhone, parentEmail, occupation 
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Login Identity
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: Role.STUDENT,
          name: `${firstName} ${lastName}`,
        },
      });

      // 2. Create Student with Parent details
      const student = await tx.student.create({
        data: {
          admissionNumber,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          address,        
          phoneNumber,    
          sectionId,
          userId: user.id,
          parents: {
            create: {
              fatherName,
              fatherPhone,
              motherName,
              motherPhone,
              email: parentEmail,      
              occupation,              
              emergencyPhone: emergencyPhone || fatherPhone || motherPhone,
              address: address,        
            }
          }
        },
        include: { parents: true }
      });
      return student;
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Admission failed", error: error.message });
  }
};

// 2. SEARCH & FILTER STUDENTS (For Admins)
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { search, sectionId } = req.query;

    const students = await prisma.student.findMany({
      where: {
        AND: [
          sectionId ? { sectionId: String(sectionId) } : {},
          search ? {
            OR: [
              { firstName: { contains: String(search), mode: 'insensitive' } },
              { admissionNumber: { contains: String(search), mode: 'insensitive' } }
            ]
          } : {}
        ]
      },
      include: {
        section: { include: { class: true } },
        user: { select: { email: true } }
      }
    });

    res.status(200).json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//--bulk admission---
export const bulkAdmitStudents = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Please upload a CSV file" });

  const results: any[] = [];
  const filePath = req.file.path;

  // Read the CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const admittedStudents = [];

        for (const row of results) {
          // Use the same Transaction logic as single admission
          const student = await prisma.$transaction(async (tx) => {
            const hashedPassword = await bcrypt.hash(row.password || "Student@123", 10);
            
            const user = await tx.user.create({
              data: {
                email: row.email,
                passwordHash: hashedPassword,
                role: Role.STUDENT,
                name: `${row.firstName} ${row.lastName}`,
              },
            });

            return await tx.student.create({
              data: {
                admissionNumber: row.admissionNumber,
                firstName: row.firstName,
                lastName: row.lastName,
                dateOfBirth: new Date(row.dateOfBirth),
                gender: row.gender,
                sectionId: row.sectionId,
                userId: user.id,
                parents: {
                  create: {
                    fatherName: row.fatherName,
                    emergencyPhone: row.fatherPhone || row.motherPhone,
                  }
                }
              }
            });
          });
          admittedStudents.push(student);
        }

        fs.unlinkSync(filePath); // Delete file after processing
        res.status(201).json({ success: true, count: admittedStudents.length });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
};

export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    // 1. Get the userId from the 'protect' middleware (req.user.id)
    const userId = (req as any).user.id;

    // 2. Fetch student details with all relations
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        section: {
          include: { class: true } // See their Class (e.g., 10th) and Section (A)
        },
        parents: true,
        user: {
          select: { email: true, name: true, role: true }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


