import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
// ─── Shared select ────────────────────────────────────────────────────────────
const teacherSelect = {
  id:             true,
  firstName:      true,
  lastName:       true,
  employeeId:     true,
  designation:    true,
  gender:         true,
  dateOfBirth:    true,
  phone:          true,
  address:        true,
  city:           true,
  state:          true,
  bloodGroup:     true,
  qualification:  true,
  specialization: true,
  experience:     true,
  bio:            true,
  joiningDate:    true,
  status:         true,
  email:          true,
  user: {
    select: { id: true, email: true },
  },
  // The one subject this teacher owns
  subjects: {
    select: {
      id:   true,
      name: true,
      code: true,
      class: { select: { id: true, name: true } },
    },
  },
  // Sections where they are subject teacher → drives CLASSES ASSIGNED
  sections: {
    select: {
      id:   true,
      name: true,
      academicClass: { select: { id: true, name: true } },
    },
  },
  // Section where they are homeroom teacher
  classTeacherOf: {
    select: {
      id:   true,
      name: true,
      academicClass: { select: { name: true } },
    },
  },
} as const;

// ─── POST /api/teachers/onboard (Admin only) ──────────────────────────────────
export const registerTeacher = async (req: Request, res: Response) => {
  const {
    name, email, password,
    firstName, lastName, employeeId,
    qualification, specialization, experience,
    joiningDate, designation, gender, dateOfBirth,
    phone, address, city, state, bloodGroup, bio,
    subjectId,        // optional — single subject UUID
    sectionIds,       // optional — string[] of section UUIDs
    classTeacherOfId, // optional — single section UUID (homeroom)
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Email already registered");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await tx.user.create({
        data: {
          name: name ?? `${firstName ?? ""} ${lastName ?? ""}`.trim(),
          email,
          passwordHash: hashedPassword,
          role: "TEACHER", 
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          firstName:      firstName ?? "",
          lastName:       lastName ?? "",
          employeeId,
          qualification:  qualification  ?? null,
          specialization: specialization ?? null,
          experience:     experience != null ? Number(experience) : null,
          joiningDate:    new Date(joiningDate),
          designation:    designation ?? "Teacher",
          gender:         gender      ?? null,
          dateOfBirth:    dateOfBirth ? new Date(dateOfBirth) : null,
          phone:          phone       ?? null,
          address:        address     ?? null,
          city:           city        ?? null,
          state:          state       ?? null,
          bloodGroup:     bloodGroup  ?? null,
          bio:            bio         ?? null,
          email:          email       ?? null,
          userId:         user.id,
        },
      });

      // Link subject (set Subject.teacherId)
      if (subjectId) {
        await tx.subject.update({
          where: { id: subjectId },
          data:  { teacherId: teacher.id },
        });
      }

      // Link sections (set Section.teacherId for each)
      if (Array.isArray(sectionIds) && sectionIds.length > 0) {
        await tx.section.updateMany({
          where: { id: { in: sectionIds } },
          data:  { teacherId: teacher.id },
        });
      }

      // Set homeroom section (set Section.classTeacherId)
      if (classTeacherOfId) {
        await tx.section.update({
          where: { id: classTeacherOfId },
          data:  { classTeacherId: teacher.id },
        });
      }

      return tx.teacher.findUnique({
        where:  { id: teacher.id },
        select: teacherSelect,
      });
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

// ─── PATCH /api/teachers/:id (Admin only) ────────────────────────────────────
export const updateTeacher = async (req: Request, res: Response) => {
 const id = req.params.id as string;
  const {
    firstName, lastName, designation, qualification,
    specialization, experience, joiningDate, gender,
    dateOfBirth, phone, address, city, state,
    bloodGroup, bio, email, status,
    subjectId,        // replaces old subject assignment
    sectionIds,       // replaces old section assignments
    classTeacherOfId, // replaces old homeroom (pass null to remove)
  } = req.body;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Verify teacher exists
      const existing = await tx.teacher.findUnique({ where: { id } });
      if (!existing) throw new Error("Teacher not found");

      // 2. Update scalar fields
      await tx.teacher.update({
        where: { id },
        data: {
          ...(firstName      !== undefined && { firstName }),
          ...(lastName       !== undefined && { lastName }),
          ...(designation    !== undefined && { designation }),
          ...(qualification  !== undefined && { qualification }),
          ...(specialization !== undefined && { specialization }),
          ...(experience     !== undefined && { experience: Number(experience) }),
          ...(joiningDate    !== undefined && { joiningDate: new Date(joiningDate) }),
          ...(gender         !== undefined && { gender }),
          ...(dateOfBirth    !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
          ...(phone          !== undefined && { phone }),
          ...(address        !== undefined && { address }),
          ...(city           !== undefined && { city }),
          ...(state          !== undefined && { state }),
          ...(bloodGroup     !== undefined && { bloodGroup }),
          ...(bio            !== undefined && { bio }),
          ...(email          !== undefined && { email }),
          ...(status         !== undefined && { status }),
        },
      });

      // 3. Re-assign subject: remove old, link new
      if (subjectId !== undefined) {
        await tx.subject.updateMany({
          where: { teacherId: id },
          data:  { teacherId: null },
        });
        if (subjectId) {
          await tx.subject.update({
            where: { id: subjectId },
            data:  { teacherId: id },
          });
        }
      }

      // 4. Re-assign sections: remove old, link new
      if (Array.isArray(sectionIds)) {
        await tx.section.updateMany({
          where: { teacherId: id },
          data:  { teacherId: null },
        });
        if (sectionIds.length > 0) {
          await tx.section.updateMany({
            where: { id: { in: sectionIds } },
            data:  { teacherId: id },
          });
        }
      }

      // 5. Re-assign homeroom: remove old, set new
      if (classTeacherOfId !== undefined) {
        await tx.section.updateMany({
          where: { classTeacherId: id },
          data:  { classTeacherId: null },
        });
        if (classTeacherOfId) {
          await tx.section.update({
            where: { id: classTeacherOfId },
            data:  { classTeacherId: id },
          });
        }
      }

      return tx.teacher.findUnique({
        where:  { id },
        select: teacherSelect,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("[updateTeacher] Error:", error);
    const status = error.message === "Teacher not found" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// ─── GET /api/teachers/me (Teacher only) ─────────────────────────────────────
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorised" });
    }

    const teacher = await prisma.teacher.findUnique({
      where:  { userId },
      select: teacherSelect,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    return res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    console.error("[getMyProfile] Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};