// src/controllers/teacherController.ts
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const registerTeacher = async (req: Request, res: Response) => {
  const { 
    name, email, password, 
    employeeId, qualification, specialization, 
    experience, joiningDate, designation 
  } = req.body;

  try {
    // 1. Transaction: Ensure both User and Teacher profile are created together
    const result = await prisma.$transaction(async (tx) => {
      
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Email already registered");

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "TEACHER", 
        },
      });

      // Create the Teacher Profile linked to the User
      const teacher = await tx.teacher.create({
        data: {
          employeeId,
          qualification,
          specialization,
          experience: Number(experience),
          joiningDate: new Date(joiningDate),
          designation,
          userId: user.id, // The 1:1 Handshake
        },
      });

      return { user, teacher };
    });

    res.status(201).json({
      success: true,
      message: "Teacher onboarded successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};