import type { Request, Response } from "express";
import { prisma } from '../lib/prisma.js';
import { Role } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import fs from "fs";
import csv from "csv-parser";


// 1. ADMIT STUDENT (The "Atomic" Transaction)
export const admitStudent = async (req: Request, res: Response) => {
  const { 
    email, 
    password, 
    firstName, 
    lastName, 
    dateOfBirth, 
    gender, 
    address, 
    city,
    state,
    bloodGroup,
    profileImage,
    phoneNumber, 
    sectionId, 
    admissionNumber,
    rollNumber
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          passwordHash: hashedPassword,
          role: "STUDENT",
        },
      });

      const student = await tx.student.create({
        data: {
          admissionNumber,
          rollNumber: rollNumber || null,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          address: address || null,    
          city: city || null,
state: state || null,    
          phoneNumber: phoneNumber || null,
          bloodGroup: bloodGroup || null,
profileImage: profileImage || null,    
          sectionId,
          userId: user.id
        }
      });

      return student;
    });

    return res.status(201).json({ success: true, data: result });

  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      message: "Admission system execution failed", 
      error: error.message 
    });
  }
};

// 2. SEARCH & FILTER STUDENTS (For Admins)

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const {
      search,
      sectionId,
      classId,
      gender,
      status,
      year,
      page = "1",
      limit = "6",
    } = req.query;

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    let resolvedSectionId: string | undefined = undefined;

    // 🔥 FIX: if sectionId is not UUID, treat it as section name
    if (sectionId) {
      const isUUID =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
          String(sectionId)
        );

      if (isUUID) {
        resolvedSectionId = String(sectionId);
      } else {
        const section = await prisma.section.findFirst({
          where: {
            name: {
              equals: String(sectionId),
              mode: "insensitive",
            },
          },
          select: { id: true },
        });

        resolvedSectionId = section?.id; // if not found → undefined (no filter)
      }
    }

    const whereClause: any = {
      AND: [
        resolvedSectionId
          ? {
              sectionId: resolvedSectionId,
            }
          : {},

        classId
          ? {
              section: {
                classId: String(classId),
              },
            }
          : {},

        gender
          ? {
              gender: {
                equals: String(gender),
                mode: "insensitive",
              },
            }
          : {},

        status
          ? {
              isActive: String(status).toUpperCase() === "ACTIVE",
            }
          : {},

        year
          ? {
              createdAt: {
                gte: new Date(`${year}-01-01T00:00:00.000Z`),
                lte: new Date(`${year}-12-31T23:59:59.999Z`),
              },
            }
          : {},

        search
          ? {
              OR: [
                {
                  firstName: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  admissionNumber: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  rollNumber: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  phoneNumber: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
      ],
    };

    const totalStudents = await prisma.student.count({
      where: whereClause,
    });

    const students = await prisma.student.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      include: {
        section: {
          include: {
            academicClass: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Global Stats Counts
    const [total, active, inactive, newThisMonth] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { isActive: true } }),
      prisma.student.count({ where: { isActive: false } }),
      prisma.student.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: students,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total: totalStudents,
        totalPages: Math.ceil(totalStudents / pageSize),
      },
      stats: {
        total,
        active,
        inactive,
        newThisMonth,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//--bulk admission---
export const bulkAdmitStudents = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Please upload a CSV file" });

  const results: any[] = [];
  const filePath = req.file.path;

  // Read the CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const admittedStudents = [];

        for (const row of results) {
          // Use the same Transaction logic as single admission
          const student = await prisma.$transaction(async (tx) => {
            const hashedPassword = await bcrypt.hash(row.password || "Student@123", 10);
            
            const user = await tx.user.create({
              data: {
                email: row.email,
                passwordHash: hashedPassword,
                role: Role.STUDENT,
                name: `${row.firstName} ${row.lastName}`,
              },
            });

            return await tx.student.create({
             data: {
  admissionNumber: row.admissionNumber,
  firstName: row.firstName,
  lastName: row.lastName,
  dateOfBirth: new Date(row.dateOfBirth),
  gender: row.gender,

  section: {
    connect: {
      id: row.sectionId
    }
  },

  user: {
    connect: {
      id: user.id
    }
  },

  parent: {
    create: {
      fatherName: row.fatherName,
      fatherPhone: row.fatherPhone,
      motherName: row.motherName,
      motherPhone: row.motherPhone,
       email: row.parentEmail || null,
    }
  }
}
            });
          });
          admittedStudents.push(student);
        }

        fs.unlinkSync(filePath); // Delete file after processing
        res.status(201).json({ success: true, count: admittedStudents.length });
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
};

export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    // 1. Get the userId from the 'protect' middleware (req.user.id)
    const userId = (req as any).user.id;

    // 2. Fetch student details with all relations
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        section: {
          include: {  academicClass: true} // See their Class (e.g., 10th) and Section (A)
        },
        parent: true,
        user: {
          select: { email: true, name: true, role: true }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. UPDATE STUDENT
export const updateStudent = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    city,
    state,
    bloodGroup,
    profileImage,
    phoneNumber,
    sectionId,
    admissionNumber,
    rollNumber,
    isActive
  } = req.body;

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update User table if email or name changes
      if (email || firstName || lastName || password) {
        const userUpdateData: any = {};
        if (email) userUpdateData.email = email;
        if (firstName || lastName) {
          const fName = firstName ?? existingStudent.firstName;
          const lName = lastName ?? existingStudent.lastName;
          userUpdateData.name = `${fName} ${lName}`.trim();
        }
        if (password) {
          userUpdateData.passwordHash = await bcrypt.hash(password, 10);
        }

        if (existingStudent.userId) {
          await tx.user.update({
            where: { id: existingStudent.userId },
            data: userUpdateData
          });
        }
      }

      // Update Student profile
      const updatedStudent = await tx.student.update({
        where: { id },
        data: {
          ...(admissionNumber !== undefined && { admissionNumber }),
          ...(rollNumber !== undefined && { rollNumber: rollNumber || null }),
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
          ...(gender !== undefined && { gender }),
          ...(address !== undefined && { address: address || null }),
          ...(city !== undefined && { city: city || null }),
          ...(state !== undefined && { state: state || null }),
          ...(phoneNumber !== undefined && { phoneNumber: phoneNumber || null }),
          ...(bloodGroup !== undefined && { bloodGroup: bloodGroup || null }),
          ...(profileImage !== undefined && { profileImage: profileImage || null }),
          ...(sectionId !== undefined && { sectionId }),
          ...(isActive !== undefined && { isActive: !!isActive })
        }
      });

      return updatedStudent;
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Failed to update student",
      error: error.message
    });
  }
};

// 5. BULK DELETE STUDENTS
export const bulkDeleteStudents = async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid or empty student IDs list." });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Find the user IDs of the target students
      const students = await tx.student.findMany({
        where: { id: { in: ids } },
        select: { userId: true }
      });
      const userIds = students.map(s => s.userId).filter(Boolean) as string[];

      // Clear dependent records first to satisfy foreign keys
      await tx.mark.deleteMany({ where: { studentId: { in: ids } } });
      await tx.calculatedResult.deleteMany({ where: { studentId: { in: ids } } });
      await tx.monthlyFeeRecord.deleteMany({ where: { studentId: { in: ids } } });
      await tx.submission.deleteMany({ where: { studentId: { in: ids } } });
      await tx.attendance.deleteMany({ where: { studentId: { in: ids } } });

      // Delete student profiles
      await tx.student.deleteMany({ where: { id: { in: ids } } });

      // Delete user accounts
      await tx.user.deleteMany({ where: { id: { in: userIds } } });
    });

    return res.status(200).json({
      success: true,
      message: "Students deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Failed to delete students",
      error: error.message
    });
  }
};


