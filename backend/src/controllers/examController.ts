import { prisma } from '../lib/prisma.js';
import type { Request, Response } from 'express';

export const createScheduledExam = async (req: any, res: Response) => {
  try {
    const {
      title, syllabus, examDate, startTime, endTime,
      termId, subjectId, classId, totalMarks, instruction
    } = req.body;

    const exam = await prisma.scheduledExam.create({
      data: {
        title, syllabus, examDate, startTime, endTime,
        termId, subjectId, classId,
        totalMarks,
        instruction: instruction ?? null,
        createdById: req.user.id
      }
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentUpcomingExams = async (req: any, res: Response) => {
  try {
    const student = await prisma.student.findFirst({
      where: { userId: req.user.id },
      include: { section: true }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const exams = await prisma.scheduledExam.findMany({
      where: { classId: student.section.classId },
      include: { subject: true, term: true },
      orderBy: { examDate: 'asc' }
    });

    const today = new Date();

    const formatted = exams.map(exam => {
      let status = "UPCOMING";
      const examDate = new Date(exam.examDate);
      if (today.toDateString() === examDate.toDateString()) status = "ONGOING";
      if (today > examDate) status = "COMPLETED";

      return {
        id: exam.id,
        title: exam.title,
        syllabus: exam.syllabus,
        examDate: exam.examDate,
        startTime: exam.startTime,
        endTime: exam.endTime,
        totalMarks: exam.totalMarks,
        status,
        subject: exam.subject.name,
        icon: exam.subject.icon,
        termName: exam.term.name,
        instruction: exam.instruction ?? null,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/exams/datesheet?classId=xxx&subjectOnly=true  (Teacher/Admin) ──
export const getDatesheet = async (req: any, res: Response) => {
  const { classId, subjectOnly } = req.query as {
    classId?: string;
    subjectOnly?: string;
  };

  if (!classId) {
    return res.status(400).json({ success: false, message: "classId is required" });
  }

  try {
    // If subjectOnly=true, find the teacher's subject for this class via
    // TeacherSectionSubject — a teacher teaches exactly one subject per class,
    // so we just need the first assignment whose section belongs to this class.
    let subjectFilter: { subjectId: string } | {} = {};

    if (subjectOnly === "true") {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user.id },
        include: {
          teachingAssignments: {
            where: {
              section: { classId },
            },
            select: {
              subjectId: true,
            },
            take: 1,
          },
        },
      });

      const subjectId = teacher?.teachingAssignments?.[0]?.subjectId;

      if (!subjectId) {
        // Teacher doesn't teach any subject in this class — return empty gracefully
        return res.status(200).json({ success: true, data: [] });
      }

      subjectFilter = { subjectId };
    }

    const exams = await prisma.scheduledExam.findMany({
      where: { classId, ...subjectFilter },
      include: { subject: true, term: true },
      orderBy: { examDate: 'asc' }
    });

    const today = new Date();

    const data = exams.map(exam => {
      const examDate = new Date(exam.examDate);
      let status = "UPCOMING";
      if (today.toDateString() === examDate.toDateString()) status = "ONGOING";
      else if (today > examDate) status = "COMPLETED";

      return {
        id:          exam.id,
        title:       exam.title,
        syllabus:    exam.syllabus ?? "",
        examDate:    exam.examDate,
        startTime:   exam.startTime ?? null,
        endTime:     exam.endTime ?? null,
        totalMarks:  exam.totalMarks ?? null,
        status,
        subject:     exam.subject.name,
        icon:        exam.subject.icon ?? null,
        termName:    exam.term.name,
        instruction: (exam as any).instruction ?? null,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("[getDatesheet] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};