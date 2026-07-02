import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";


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
  classTeacherOf: {
    select: {
      id:   true,
      name: true,
      academicClass: { select: { name: true } },
    },
  },
  teachingAssignments: {
    select: {
      id: true,
      subject: {
        select: { id: true, name: true, code: true },
      },
      section: {
        select: {
          id:   true,
          name: true,
          academicClass: { select: { id: true, name: true } },
        },
      },
    },
  },
} as const;

// ─── POST /api/teachers/onboard (Admin only) ──────────────────────────────────
export const registerTeacher = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    employeeId,
    gender,
    dateOfBirth,
    phone,
    qualification,
    specialization,
    bio,
    experience,
    joiningDate,
    designation,
    address,
    city,
    state,
    bloodGroup,

    // NEW
    assignments = [],
    classTeacherOfId,
  } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email already registered");
      }

      const [existingTeacher, existingStaff] = await Promise.all([
        tx.teacher.findUnique({
          where: { employeeId },
        }),
        tx.staff.findUnique({
          where: { employeeId },
        }),
      ]);

      if (existingTeacher || existingStaff) {
        throw new Error(
          `Employee ID "${employeeId}" is already in use. Please use a different ID.`,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await tx.user.create({
        data: {
          name: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
          email,
          passwordHash: hashedPassword,
          role: "TEACHER",
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          employeeId,
          qualification: qualification ?? null,
          specialization: specialization ?? null,
          experience:
            experience != null ? Number(experience) : null,
          joiningDate: new Date(joiningDate),
          designation: designation ?? "Teacher",
          gender: gender ?? null,
          dateOfBirth: dateOfBirth
            ? new Date(dateOfBirth)
            : null,
          phone: phone ?? null,
          address: address ?? null,
          city: city ?? null,
          state: state ?? null,
          bloodGroup: bloodGroup ?? null,
          bio: bio ?? null,
          email: email ?? null,
          userId: user.id,
        },
      });

      // ===============================
      // Teaching Assignments
      // ===============================
      if (Array.isArray(assignments) && assignments.length > 0) {
        const teacherAssignments = assignments.flatMap(
          (assignment: {
            subjectId: string;
            sectionIds: string[];
          }) =>
            assignment.sectionIds.map((sectionId: string) => ({
              teacherId: teacher.id,
              subjectId: assignment.subjectId,
              sectionId,
            })),
        );

        if (teacherAssignments.length > 0) {
          await tx.teacherSectionSubject.createMany({
            data: teacherAssignments,
            skipDuplicates: true,
          });
        }
      }

      
      // ===============================
      // Class Teacher
      // ===============================
      if (classTeacherOfId) {
        await tx.section.update({
          where: {
            id: classTeacherOfId,
          },
          data: {
            classTeacherId: teacher.id,
          },
        });
      }

      return tx.teacher.findUnique({
        where: {
          id: teacher.id,
        },
        select: teacherSelect,
      });
    });

    return res.status(201).json({
      
      success: true,
      message: "Teacher onboarded successfully",
      data: result,
      
    });
  } catch (error: any) {
    const target =
      error?.meta?.target?.[0] ??
      error?.cause?.meta?.target?.[0] ??
      "";

    const code =
      error?.code ??
      error?.cause?.code ??
      "";

    if (code === "P2002") {
      if (target.includes("employeeId")) {
        return res.status(400).json({
          success: false,
          message: `Employee ID "${employeeId}" is already in use. Please use a different ID.`,
        });
      }

      if (target.includes("email")) {
        return res.status(400).json({
          success: false,
          message: `Email "${email}" is already registered. Please use a different email.`,
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── PATCH /api/teachers/:id (Admin only) ────────────────────────────────────
export const updateTeacher = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const {
    firstName,
    lastName,
    employeeId,
    password,
    designation,
    qualification,
    specialization,
    experience,
    joiningDate,
    gender,
    dateOfBirth,
    phone,
    address,
    city,
    state,
    bloodGroup,
    bio,
    email,
    status,

    // Teaching assignments
    assignments = [],
    classTeacherOfId,
  } = req.body;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.teacher.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Teacher not found");
      }

      // =====================================================
      // Check Employee ID uniqueness (Teacher + Staff)
      // =====================================================
      if (
        employeeId !== undefined &&
        employeeId !== existing.employeeId
      ) {
        const [dupTeacher, dupStaff] = await Promise.all([
          tx.teacher.findUnique({
            where: { employeeId },
          }),
          tx.staff.findUnique({
            where: { employeeId },
          }),
        ]);

        if (dupTeacher || dupStaff) {
          throw new Error(
            `Employee ID "${employeeId}" is already in use. Please use a different ID.`
          );
        }
      }

      // =====================================================
      // Update Teacher Details
      // =====================================================
      const updateData: any = {};

      if (employeeId !== undefined)
        updateData.employeeId = employeeId;

      if (firstName !== undefined)
        updateData.firstName = firstName;

      if (lastName !== undefined)
        updateData.lastName = lastName;

      if (designation !== undefined)
        updateData.designation = designation;

      if (qualification !== undefined)
        updateData.qualification = qualification;

      if (specialization !== undefined)
        updateData.specialization = specialization;

      if (experience !== undefined) {
        updateData.experience =
          experience === "" || experience === null
            ? null
            : Number(experience);
      }

      if (joiningDate !== undefined) {
        updateData.joiningDate = joiningDate
          ? new Date(joiningDate)
          : null;
      }

      if (gender !== undefined)
        updateData.gender = gender;

      if (dateOfBirth !== undefined) {
        updateData.dateOfBirth = dateOfBirth
          ? new Date(dateOfBirth)
          : null;
      }

      if (phone !== undefined)
        updateData.phone = phone;

      if (address !== undefined)
        updateData.address = address;

      if (city !== undefined)
        updateData.city = city;

      if (state !== undefined)
        updateData.state = state;

      if (bloodGroup !== undefined)
        updateData.bloodGroup = bloodGroup;

      if (bio !== undefined)
        updateData.bio = bio;

      if (email !== undefined)
        updateData.email = email;

      if (status !== undefined)
        updateData.status = status;

      await tx.teacher.update({
        where: { id },
        data: updateData,
      });

      // =====================================================
      // Reset Password (updates linked User table)
      // =====================================================
      if (
        password !== undefined &&
        password.trim() !== ""
      ) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await tx.user.update({
          where: {
            id: existing.userId,
          },
          data: {
            passwordHash: hashedPassword,
          },
        });
      }

      // =====================================================
      // Replace Teaching Assignments
      // =====================================================
      await tx.teacherSectionSubject.deleteMany({
        where: {
          teacherId: id,
        },
      });

      if (
        Array.isArray(assignments) &&
        assignments.length > 0
      ) {
        const teacherAssignments = assignments.flatMap(
          (assignment: {
            subjectId: string;
            sectionIds: string[];
          }) =>
            assignment.sectionIds.map((sectionId: string) => ({
              teacherId: id,
              subjectId: assignment.subjectId,
              sectionId,
            }))
        );

        if (teacherAssignments.length > 0) {
          await tx.teacherSectionSubject.createMany({
            data: teacherAssignments,
            skipDuplicates: true,
          });
        }
      }

      // =====================================================
      // Class Teacher Assignment
      // =====================================================
      if (classTeacherOfId !== undefined) {
        await tx.section.updateMany({
          where: {
            classTeacherId: id,
          },
          data: {
            classTeacherId: null,
          },
        });

        if (classTeacherOfId) {
          await tx.section.update({
            where: {
              id: classTeacherOfId,
            },
            data: {
              classTeacherId: id,
            },
          });
        }
      }

      return tx.teacher.findUnique({
        where: {
          id,
        },
        select: teacherSelect,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("[updateTeacher]", error);

    const target = error?.meta?.target?.[0] ?? "";

    if (error.code === "P2002") {
      if (target.includes("employeeId")) {
        return res.status(400).json({
          success: false,
          message: `Employee ID "${req.body.employeeId}" is already in use.`,
        });
      }

      if (target.includes("email")) {
        return res.status(400).json({
          success: false,
          message:
            "Email is already registered to another user.",
        });
      }
    }

    return res.status(
      error.message === "Teacher not found" ? 404 : 500
    ).json({
      success: false,
      message: error.message,
    });
  }
};
// ─── GET /api/teachers/me (Teacher only) ─────────────────────────────────────

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised",
      });
    }

    const teacher = await prisma.teacher.findUnique({
  where: { userId },
  select: {
    id:             true,
    firstName:      true,
    lastName:       true,
    email:          true,
    phone:          true,
    designation:    true,
    qualification:  true,
    specialization: true,
    experience:     true,
    joiningDate:    true,
    gender:         true,
    dateOfBirth:    true,
    address:        true,
    city:           true,
    state:          true,
    bloodGroup:     true,
    bio:            true,
    status:         true,
    employeeId:     true,

    // Login identity — keep for future use
    user: {
      select: {
        id:    true,
        email: true,
        role:  true,
      },
    },

    classTeacherOf: {
      select: {
        id:   true,
        name: true,
        academicClass: {
          select: { id: true, name: true },
        },
      },
    },

    teachingAssignments: {
      select: {
        id: true,
        section: {
          select: {
            id:   true,
            name: true,
            academicClass: {
              select: { id: true, name: true },
            },
          },
        },
        subject: {
          select: { id: true, name: true, code: true },
        },
      },
    },
  },
});

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    // Optional: Format the data to flatten 'teachingAssignments' back into a 'sections' array 
    // if your frontend is strictly expecting an array of sections.
    /*
    const formattedTeacher = {
      ...teacher,
      sections: teacher.teachingAssignments.map(ta => ({
        ...ta.section,
        subject: ta.subject 
      }))
    };
    // Then return `data: formattedTeacher` below.
    */

    return res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error: any) {
    console.error("[getMyProfile] Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// POST /api/teachers/assign-subject-section

export const assignTeacherToSectionSubject = async (
  req: Request,
  res: Response
) => {
  try {
    const { teacherId, sectionId, subjectId } = req.body;

    if (!teacherId || !sectionId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "teacherId, sectionId and subjectId are required",
      });
    }

    // Verify entities exist
    const [teacher, section, subject] = await Promise.all([
      prisma.teacher.findUnique({ where: { id: teacherId } }),
      prisma.section.findUnique({ where: { id: sectionId } }),
      prisma.subject.findUnique({ where: { id: subjectId } }),
    ]);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Prevent duplicate assignment
    const existing = await prisma.teacherSectionSubject.findFirst({
      where: {
        teacherId,
        sectionId,
        subjectId,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Assignment already exists",
      });
    }

    const assignment = await prisma.teacherSectionSubject.create({
      data: {
        teacherId,
        sectionId,
        subjectId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
            academicClass: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Teaching assignment created successfully",
      data: assignment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/teachers/:id/teaching-assignments

export const getTeacherTeachingAssignments = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string; 
    const assignments = await prisma.teacherSectionSubject.findMany({
      where: {
        teacherId: id,
      },
      select: {
        id: true,

        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        section: {
          select: {
            id: true,
            name: true,

            academicClass: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ── GET /api/teachers ─────────────────────────────────────────────────────────
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const page         = Math.max(1, parseInt(req.query.page   as string) || 1);
    const limit        = Math.max(1, parseInt(req.query.limit  as string) || 10);
    const search       = (req.query.search as string)?.trim() || "";
    const statusFilter = (req.query.status as string)?.trim() || "";
    const genderFilter = (req.query.gender as string)?.trim() || "";
    const classId       = (req.query.classId as string)?.trim() || "";
    const subjectId     = (req.query.subjectId as string)?.trim() || "";
    const skip         = (page - 1) * limit;

    console.log("[getAllTeachers] query params:", {
      search, statusFilter, genderFilter, classId, subjectId,
    });

    const searchCondition = search ? {
      OR: [
        { firstName:  { contains: search, mode: "insensitive" as const } },
        { lastName:   { contains: search, mode: "insensitive" as const } },
        { employeeId: { contains: search, mode: "insensitive" as const } },
        { phone:      { contains: search, mode: "insensitive" as const } },
      ],
    } : {};

    const statusCondition =
      statusFilter === "Active"   ? { status: "ACTIVE" }   :
      statusFilter === "On Leave" ? { status: "ON_LEAVE" } : {};

    // Case-insensitive so "MALE" (dropdown) matches "Male" (DB) regardless of casing
    const genderCondition = genderFilter
      ? { gender: { equals: genderFilter, mode: "insensitive" as const } }
      : {};

    const assignmentCondition =
      classId || subjectId
        ? {
            teachingAssignments: {
              some: {
                ...(subjectId ? { subjectId } : {}),
                ...(classId ? { section: { classId } } : {}),
              },
            },
          }
        : {};

    const where = {
      ...searchCondition,
      ...statusCondition,
      ...genderCondition,
      ...assignmentCondition,
    };

    console.log("[getAllTeachers] final where:", JSON.stringify(where, null, 2));

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        select: {
          id:            true,
          firstName:     true,
          lastName:      true,
          employeeId:    true,
          phone:         true,
          status:        true,
          qualification: true,
          designation:   true,
          gender:        true,
          teachingAssignments: {
            select: {
              subject: { select: { name: true } },
              section: {
                select: {
                  name: true,
                  academicClass: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { employeeId: "asc" },
        skip,
        take: limit,
      }),
      prisma.teacher.count({ where }),
    ]);

    console.log("[getAllTeachers] matched count:", total);

    const normalizeStatus = (s: string) =>
      s === "ACTIVE" ? "Active" : s === "ON_LEAVE" ? "On Leave" : s;

    const data = teachers.map((t) => {
      const subjects = [
        ...new Set(
          t.teachingAssignments.map((a) => a.subject.name)
        ),
      ];
      const sections = t.teachingAssignments.map(
        (a) => `${a.section.academicClass.name}:${a.section.name}`
      );
      return {
        id:            t.id,
        employeeId:    t.employeeId,
        name:          `${t.firstName} ${t.lastName}`.trim(),
        subject:       subjects.join(", ") || "-",
        sections:      sections.length > 0 ? sections : ["-"],
        qualification: t.qualification ?? "-",
        contact:       t.phone ?? "-",
        status:        normalizeStatus(t.status),
        gender:        t.gender ?? "-",
      };
    });

    const monthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const [totalCount, activeCount, onLeaveCount, newThisMonth] =
      await Promise.all([
        prisma.teacher.count(),
        prisma.teacher.count({ where: { status: "ACTIVE" } }),
        prisma.teacher.count({ where: { status: "ON_LEAVE" } }),
        prisma.teacher.count({ where: { createdAt: { gte: monthStart } } }),
      ]);

    return res.status(200).json({
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        stats: {
          totalTeachers: totalCount,
          newThisMonth,
          active:        activeCount,
          onLeave:       onLeaveCount,
        },
      },
    });
  } catch (error: any) {
    console.error("[getAllTeachers] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/teachers/:id ─────────────────────────────────────────────────────
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: {
        id:            true,
        firstName:     true,
        lastName:      true,
        employeeId:    true,
        designation:   true,
        gender:        true,
        dateOfBirth:   true,
        phone:         true,
        address:       true,
        city:          true,
        state:         true,
        bloodGroup:    true,
        qualification: true,
        specialization:true,
        experience:    true,
        bio:           true,
        joiningDate:   true,
        status:        true,
        email:         true,
        user: {
          select: { id: true, email: true },
        },
        classTeacherOf: {
          select: {
            id:   true,
            name: true,
            academicClass: { select: { name: true } },
          },
        },
        teachingAssignments: {
          select: {
            id: true,
            subject: { select: { id: true, name: true, code: true } },
            section: {
              select: {
                id:   true,
                name: true,
                academicClass: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/teachers/:id ──────────────────────────────────────────────────
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Delete teaching assignments first (cascade may handle this
      // but being explicit is safer)
      await tx.teacherSectionSubject.deleteMany({ where: { teacherId: id } });
      // Remove class teacher reference if any
      await tx.section.updateMany({
        where: { classTeacherId: id },
        data:  { classTeacherId: null },
      });
      await tx.teacher.delete({ where: { id } });
      await tx.user.delete({ where: { id: existing.userId } });
    });

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/teachers/bulk-delete ──────────────────────────────────────────
export const deleteMultipleTeachers = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of teacher IDs.",
      });
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No teachers found.",
      });
    }

    const teacherIds = teachers.map((t) => t.id);
    const userIds = teachers.map((t) => t.userId);

    await prisma.$transaction(async (tx) => {
      // Remove teaching assignments
      await tx.teacherSectionSubject.deleteMany({
        where: {
          teacherId: {
            in: teacherIds,
          },
        },
      });

      // Remove class teacher references
      await tx.section.updateMany({
        where: {
          classTeacherId: {
            in: teacherIds,
          },
        },
        data: {
          classTeacherId: null,
        },
      });

      // Delete teachers
      await tx.teacher.deleteMany({
        where: {
          id: {
            in: teacherIds,
          },
        },
      });

      // Delete login accounts
      await tx.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
    });

    return res.status(200).json({
      success: true,
      deletedCount: teachers.length,
      message: `${teachers.length} teacher(s) deleted successfully.`,
    });
  } catch (error: any) {
    console.error("[deleteMultipleTeachers]", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};