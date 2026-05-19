import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const createParentAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const parentProfile = await tx.parent.findFirst({
        where: { email }, 
      });
      if (!parentProfile) {
        throw new Error("No parent record found with this email. Please contact the administrator.");
      }
      // 2. Ensure this parent doesn't already have a login account
      if (parentProfile.userId) {
        throw new Error("This parent already has a login account.");
      }
      // 3. Create the User Identity
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          name: parentProfile.fatherName || parentProfile.motherName || "Parent",
          email,
          passwordHash,
          role: "PARENT", // Explicit role assignment
        },
      });

      // 4. Update the Parent profile to link the new User ID
      const updatedParent = await tx.parent.update({
        where: { id: parentProfile.id },
        data: { userId: user.id }
      });

      return { user, updatedParent };
    });

    res.status(201).json({
      success: true,
      message: "Parent login account created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};