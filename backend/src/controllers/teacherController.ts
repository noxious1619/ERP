// src/controllers/teacherController.ts
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const registerTeacher = async (req: Request, res: Response) => {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    employeeId, 
    qualification, 
    specialization, 
    experience, 
    joiningDate, 
    designation 
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Email already registered");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          passwordHash: hashedPassword,
          role: "TEACHER", 
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          firstName,         
          lastName,           
          employeeId,
          qualification,
          specialization,
          experience: Number(experience),
          joiningDate: new Date(joiningDate),
          designation,
          userId: user.id,    
          email               
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