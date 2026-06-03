import type { Request, Response } from "express";
// import { PrismaClient, Role } from "../../generated/prisma/index.js";
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
              gender: String(gender).toUpperCase(),
            }
          : {},

        status
          ? {
              isActive: String(status).toUpperCase() === "ACTIVE",
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

    return res.status(200).json({
      success: true,
      data: students,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total: totalStudents,
        totalPages: Math.ceil(totalStudents / pageSize),
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
      email: row.email
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


