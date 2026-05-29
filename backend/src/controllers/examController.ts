import { prisma } from '../lib/prisma.js';
import type { Request, Response } from 'express';
export const createScheduledExam = async (
  req: any,
  res: Response
) => {
  try {
    const {
      title,
      syllabus,
      examDate,
      startTime,
      endTime,
      termId,
      subjectId,
      classId,
      totalMarks
    } = req.body;

    const exam = await prisma.scheduledExam.create({
      data: {
        title,
        syllabus,
        examDate,
        startTime,
        endTime,
        termId,
        subjectId,
        classId,
        totalMarks,
        createdById: req.user.id
      }
    });

    res.status(201).json({
      success: true,
      data: exam
    });

  } catch (error: any)  {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getStudentUpcomingExams = async (req: any, res: Response) => {
  try {
    const student = await prisma.student.findFirst({
      where: {
        userId: req.user.id
      },
      include: {
        section: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    const exams = await prisma.scheduledExam.findMany({
      where: {
        classId: student.section.classId
      },
      include: {
        subject: true,
        term: true
      },
      orderBy: {
        examDate: 'asc'
      }
    });

    const today = new Date();

    const formatted = exams.map(exam => {

      let status = "UPCOMING";
      const examDate = new Date(exam.examDate);
      if (today.toDateString() === examDate.toDateString()) {
        status = "ONGOING";
      }
      if (today > examDate) {
        status = "COMPLETED";
      }
      return {
        id: exam.id,
        title: exam.title,
        syllabus: exam.syllabus,
        examDate: exam.examDate,
        startTime: exam.startTime,
        endTime: exam.endTime,
        status,
        subject: exam.subject.name,
        icon: exam.subject.icon
      };
    });

    res.json({
      success: true,
      data: formatted
    });

  } catch (error: any)  {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

