import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create the "Digital Passport" (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super-secret-key',
      // { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// authController.ts - add this function

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'STUDENT',
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super-secret-key',
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};