import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { logActivity } from '../lib/auditService.js';

export const createAcademicYear = async (req: any, res: Response) => {
  try {
    const { name, isCurrent } = req.body;

    // 1. If this is set to current, unset any other current year
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    // 2. Create the new year
    const newYear = await prisma.academicYear.create({
      data: { name, isCurrent: isCurrent || false },
    });

    // 3. Log the action (Module 2 integration!)
    logActivity(req.user.id, 'CREATE', 'AcademicYear', newYear.id, null, newYear);

    res.status(201).json({
      success: true,
      data: newYear
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating academic year", error });
  }
};

export const getAcademicYears = async (req: Request, res: Response) => {
  const years = await prisma.academicYear.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(years);
};

// Create a Class
export const createClass = async (req: any, res: Response) => {
  try {
    const { name, academicYearId } = req.body;

    const newClass = await prisma.class.create({
      data: { name, academicYearId },
    });

    logActivity(req.user.id, 'CREATE', 'Class', newClass.id, null, newClass);

    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    res.status(500).json({ message: "Error creating class", error });
  }
};

// Create a Section linked to a Class
export const createSection = async (req: any, res: Response) => {
  try {
    const { name, classId } = req.body;

    const newSection = await prisma.section.create({
      data: { name, classId },
    });

    logActivity(req.user.id, 'CREATE', 'Section', newSection.id, null, newSection);

    res.status(201).json({ success: true, data: newSection });
  } catch (error) {
    res.status(500).json({ message: "Error creating section", error });
  }
};

export const createSubject = async (req: any, res: Response) => {
  try {
    const { name, code, classId } = req.body;

    // 1. Check if the class exists first
    const parentClass = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!parentClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    // 2. Create the Subject
    const newSubject = await prisma.subject.create({
      data: { 
        name, 
        code: code.toUpperCase(), // Standardize codes like 'MATH101'
        classId 
      },
    });

    // 3. Log the action
    logActivity(req.user.id, 'CREATE', 'Subject', newSubject.id, null, newSubject);

    res.status(201).json({
      success: true,
      data: newSubject
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating subject", error });
  }
};

export const createTimetableEntry = async (req: any, res: Response) => {
  try {
    const { day, period, startTime, endTime, sectionId, subjectId, teacherId } = req.body;

    const teacherConflict = await prisma.timetable.findFirst({
      where: { day, period, teacherId }
    });
    if (teacherConflict) return res.status(400).json({ message: "Teacher is already assigned to another section at this time." });

    // 2. Check if Section already has a class at this time
    const sectionConflict = await prisma.timetable.findFirst({
      where: { day, period, sectionId }
    });
    if (sectionConflict) return res.status(400).json({ message: "This section already has a subject scheduled for this period." });

    // 3. If no conflicts, create the entry
    const entry = await prisma.timetable.create({
      data: { day, period, startTime, endTime, sectionId, subjectId, teacherId }
    });

    logActivity(req.user.id, 'CREATE', 'Timetable', entry.id, null, entry);

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ message: "Error creating timetable entry", error });
  }
};