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

// ─── GET /api/exams/datesheet  (Teacher / Admin) ─────────────────────────────
// Query params:
//   classId     — required when subjectOnly is false/absent
//   subjectOnly — when "true", ignores classId and returns all exams for the
//                 teacher's subject across ALL their assigned classes
export const getDatesheet = async (req: any, res: Response) => {
  const { classId, subjectOnly } = req.query as {
    classId?: string;
    subjectOnly?: string;
  };

  try {
    // ── My Subject mode ───────────────────────────────────────────────────────
    if (subjectOnly === "true") {
      // 1. Find teacher's subjectId from their teaching assignments
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user.id },
        include: {
          teachingAssignments: {
            select: { subjectId: true },
            take: 1, // teacher teaches one subject — any assignment gives us the subjectId
          },
        },
      });

      const subjectId = teacher?.teachingAssignments?.[0]?.subjectId;

      if (!subjectId) {
        return res.status(200).json({ success: true, data: [] });
      }

      // 2. Find all ScheduledExams for that subjectId across all classes
      const exams = await prisma.scheduledExam.findMany({
        where: { subjectId },
        include: { subject: true, term: true, class: { select: { name: true } } },
        orderBy: { examDate: 'asc' },
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
          endTime:     exam.endTime   ?? null,
          totalMarks:  exam.totalMarks ?? null,
          status,
          subject:     exam.subject.name,
          icon:        exam.subject.icon ?? null,
          termName:    exam.term.name,
          instruction: exam.instruction ?? null,
          className:   exam.class.name,  // useful for display when spanning multiple classes
        };
      });

      return res.status(200).json({ success: true, data });
    }

    // ── Class filter mode ─────────────────────────────────────────────────────
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "classId is required when subjectOnly is not set",
      });
    }

    const exams = await prisma.scheduledExam.findMany({
      where: { classId },
      include: { subject: true, term: true },
      orderBy: { examDate: 'asc' },
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
        endTime:     exam.endTime   ?? null,
        totalMarks:  exam.totalMarks ?? null,
        status,
        subject:     exam.subject.name,
        icon:        exam.subject.icon ?? null,
        termName:    exam.term.name,
        instruction: exam.instruction ?? null,
      };
    });

    return res.status(200).json({ success: true, data });

  } catch (error: any) {
    console.error("[getDatesheet] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/exams/publish  (Admin — bulk create from datesheet generator) ──
// Body shape:
// {
//   termId:      string,
//   classId:     string,
//   instruction: string | null,
//   exams: [
//     {
//       subjectId:  string,
//       title:      string,
//       syllabus:   string | null,
//       examDate:   string,   // ISO date string
//       startTime:  string | null,
//       endTime:    string | null,
//       totalMarks: number | null,
//     },
//     ...
//   ]
// }
export const publishDatesheet = async (req: any, res: Response) => {
  const { termId, classId, instruction, exams } = req.body;
 
  // ── Validation ──────────────────────────────────────────────────────────────
  if (!termId) {
    return res.status(400).json({ success: false, message: "termId is required" });
  }
  if (!classId) {
    return res.status(400).json({ success: false, message: "classId is required" });
  }
  if (!Array.isArray(exams) || exams.length === 0) {
    return res.status(400).json({ success: false, message: "At least one exam is required" });
  }
 
  // Validate each exam row has required fields
  for (let i = 0; i < exams.length; i++) {
    const e = exams[i];
    if (!e.subjectId) {
      return res.status(400).json({ success: false, message: `Exam row ${i + 1}: subjectId is required` });
    }
    if (!e.title) {
      return res.status(400).json({ success: false, message: `Exam row ${i + 1}: title is required` });
    }
    if (!e.examDate) {
      return res.status(400).json({ success: false, message: `Exam row ${i + 1}: examDate is required` });
    }
  }
 
  try {
    // ── Run in a transaction ────────────────────────────────────────────────
    const created = await prisma.$transaction(async (tx) => {
      // 1. Verify term exists
      const term = await tx.examTerm.findUnique({ where: { id: termId } });
      if (!term) throw new Error("Exam term not found");
 
      // 2. Verify class exists
      const cls = await tx.class.findUnique({ where: { id: classId } });
      if (!cls) throw new Error("Class not found");
 
      // 3. Bulk create all ScheduledExam rows
      const createdExams = await Promise.all(
        exams.map((e: any) =>
          tx.scheduledExam.create({
            data: {
              title:       e.title,
              syllabus:    e.syllabus    ?? null,
              examDate:    new Date(e.examDate),
              startTime:   e.startTime   ?? null,
              endTime:     e.endTime     ?? null,
              totalMarks:  e.totalMarks  ?? 100,
              instruction: instruction   ?? null,
              termId,
              subjectId:   e.subjectId,
              classId,
              createdById: req.user.id,
            },
            include: { subject: true },
          })
        )
      );
 
      return createdExams;
    });
 
    return res.status(201).json({
      success: true,
      message: `${created.length} exam(s) published successfully`,
      data: created,
    });
  } catch (error: any) {
    console.error("[publishDatesheet] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};