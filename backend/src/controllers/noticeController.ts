import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, content, targetType, targetId, priority, expiresAt, category } = req.body;
    const authorId = (req as any).user.id;

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        targetType,
        targetId: targetId || null,
        priority: priority || 'STANDARD',
        category: category || 'ANNOUNCEMENT',
        authorId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Notice published successfully!",
      data: notice
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyNotices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { category } = req.query; // e.g. ?category=ACADEMIC

    const student = await prisma.student.findUnique({
      where: { userId },
      select: {
        sectionId: true,
        section: { select: { classId: true } }
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    const notices = await prisma.notice.findMany({
      where: {
        AND: [
          {
            OR: [
              { targetType: 'GLOBAL' },
              { targetType: 'ROLE', targetId: 'STUDENT' },
              { targetType: 'CLASS', targetId: student.section.classId },
              { targetType: 'SECTION', targetId: student.sectionId },
              { category: { not: 'STAFF_CIRCULAR' } }
            ]
          },
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          },
          { category: { not: 'STAFF_CIRCULAR' } },
          // Only apply category filter if it's not "ALL"
          ...(category && category !== 'ALL'
            ? [{ category: category as any }]
            : []
          )
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherNotices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { category } = req.query;

    // 1. Get teacher's assigned sections → derive classIds
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        sections: {
          select: { id: true, classId: true }
        }
      }
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }

    const sectionIds = teacher.sections.map((s) => s.id);
    const classIds = [...new Set(teacher.sections.map((s) => s.classId))];

    // 2. Build scope conditions
    const scopeConditions: any[] = [
      { targetType: "GLOBAL" },
      { targetType: "ROLE", targetId: "TEACHER" },
    ];

    if (classIds.length > 0) {
      classIds.forEach((classId) => {
        scopeConditions.push({ targetType: "CLASS", targetId: classId });
      });
    }

    if (sectionIds.length > 0) {
      sectionIds.forEach((sectionId) => {
        scopeConditions.push({ targetType: "SECTION", targetId: sectionId });
      });
    }

    // 3. Fetch notices
    const notices = await prisma.notice.findMany({
      where: {
        AND: [
          { OR: scopeConditions },
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          },
          ...(category && category !== "ALL"
            ? [{ category: category as any }]
            : []
          )
        ]
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};