import { prisma } from '../lib/prisma.js';
import type { Request, Response } from 'express';

// ─── POST /api/exam-terms ─────────────────────────────────────────────────────
export const createExamTerm = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Term name is required" });
  }

  try {
    const term = await prisma.examTerm.create({
      data: { name: name.trim() },
    });

    return res.status(201).json({ success: true, data: term });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/exam-terms ──────────────────────────────────────────────────────
export const getExamTerms = async (_req: Request, res: Response) => {
  try {
    const terms = await prisma.examTerm.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, createdAt: true },
    });

    return res.status(200).json({ success: true, data: terms });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PATCH /api/exam-terms/:id ────────────────────────────────────────────────
export const updateExamTerm = async (req: Request, res: Response) => {
 const id = req.params.id as string;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Term name is required" });
  }

  try {
    const term = await prisma.examTerm.update({
      where: { id },
      data: { name: name.trim() },
    });

    return res.status(200).json({ success: true, data: term });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};