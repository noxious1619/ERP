import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// ─── GET ALL NOTICES (Admin sees everything) ──────────────────────────────────
export const getAdminNotices = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const notices = await prisma.notice.findMany({
      where: {
        AND: [
          // Optional category filter
          ...(category && category !== 'ALL'
            ? [{ category: category as any }]
            : []
          ),
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, role: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE A NOTICE ──────────────────────────────────────────────────────────
export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    await prisma.notice.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Notice deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE A NOTICE ──────────────────────────────────────────────────────────
export const updateNotice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, targetType, targetId, priority, category, expiresAt } = req.body;

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    const updated = await prisma.notice.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(targetType !== undefined && { targetType }),
        ...(targetId !== undefined && { targetId: targetId || null }),
        ...(priority !== undefined && { priority }),
        ...(category !== undefined && { category }),
        ...(expiresAt !== undefined && {
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        }),
      },
      include: {
        author: { select: { name: true, role: true } },
      },
    });

    res.status(200).json({ success: true, message: 'Notice updated successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET CLASSES WITH SECTIONS (for Create/Edit modal dropdowns) ──────────────
export const getClassesWithSections = async (_req: Request, res: Response) => {
  try {
    // Fetch all classes that belong to the current academic year
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
      select: { id: true },
    });

    const classes = await prisma.class.findMany({
      where: currentYear ? { academicYearId: currentYear.id } : {},
      select: {
        id: true,
        name: true,
        sections: {
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ success: true, data: classes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
