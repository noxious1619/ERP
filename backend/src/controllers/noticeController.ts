import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, content, targetType, targetId, priority, expiresAt } = req.body;
    const authorId = (req as any).user.id;

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        targetType, 
        targetId: targetId || null,
        priority: priority || 'STANDARD',
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
    const userId = (req as any).user.id; // From your 'protect' middleware

    // 1. Get the student's enrollment context (Class & Section)
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

    // 2. Fetch notices that match the student's target scope
    const notices = await prisma.notice.findMany({
      where: {
        AND: [
          {
            OR: [
              { targetType: 'GLOBAL' },
              { targetType: 'ROLE', targetId: 'STUDENT' },
              { targetType: 'CLASS', targetId: student.section.classId },
              { targetType: 'SECTION', targetId: student.sectionId }
            ]
          },
          {
            // Only show notices that haven't expired yet
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' }, // Newest first
      include: {
        author: {
          select: { name: true, role: true } // Show who posted it
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