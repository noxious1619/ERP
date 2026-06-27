import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

function formatClassSection(className: string, sectionName: string): string {
  const match = className.match(/\d+/);
  const classDigits = match ? match[0] : className;

  if (!sectionName) {
    return classDigits;
  }

  let cleanSection = sectionName.trim();
  if (cleanSection.toLowerCase().startsWith("section ")) {
    cleanSection = cleanSection.substring(8).trim();
  } else if (cleanSection.toLowerCase().startsWith("sec ")) {
    cleanSection = cleanSection.substring(4).trim();
  }
  return `${classDigits}${cleanSection}`;
}


// 1. GET ALL SUBJECTS (with filters, search, pagination, and live stats)
export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      classId = "",
      type = "",
      page = "1",
      limit = "6",
    } = req.query;

    const currentPage = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));

    // Fetch all Subjects with their class and teaching assignments
    const subjects = await prisma.subject.findMany({
      include: {
        class: true,
        teachingAssignments: {
          include: {
            section: true,
            teacher: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Group assignments by Subject to keep one row per Subject in the table
    const rows: any[] = [];
    for (const subj of subjects) {
      const classesList: string[] = [];
      const teachersList: string[] = [];
      const sectionIds: string[] = [];
      let teacherId = "unassigned";

      if (subj.teachingAssignments.length === 0) {
        classesList.push(formatClassSection(subj.class.name, ""));
        teachersList.push("Unassigned");
      } else {
        const uniqueTeachers = new Set<string>();
        for (const ta of subj.teachingAssignments) {
          classesList.push(formatClassSection(subj.class.name, ta.section.name));
          const tName = `${ta.teacher.firstName} ${ta.teacher.lastName}`.trim() || ta.teacher.email || "Unnamed Teacher";
          uniqueTeachers.add(tName);
          sectionIds.push(ta.section.id);
          teacherId = ta.teacher.id;
        }
        teachersList.push(...Array.from(uniqueTeachers));
      }

      rows.push({
        id: subj.id,
        subjectId: subj.id,
        name: subj.name,
        code: subj.code,
        classId: subj.classId,
        className: subj.class.name,
        classes: classesList,
        sectionIds,
        teacherId,
        teacherName: teachersList.join(", "),
        teachers: teachersList,
        type: subj.type,
      });
    }

    // Apply Filter and Search in JavaScript
    let filteredRows = rows;

    // Class ID filter
    if (classId && classId !== "All Classes") {
      filteredRows = filteredRows.filter((row) => row.classId === classId);
    }

    // Type filter (Theory / Lab)
    if (type && type !== "All Type") {
      filteredRows = filteredRows.filter(
        (row) => row.type.toLowerCase() === String(type).toLowerCase()
      );
    }

    // Search query matches name, code, class, sections list, teachers, or type
    if (search) {
      const searchStr = String(search).toLowerCase().trim();
      filteredRows = filteredRows.filter(
        (row) =>
          row.name.toLowerCase().includes(searchStr) ||
          row.code.toLowerCase().includes(searchStr) ||
          row.className.toLowerCase().includes(searchStr) ||
          row.teachers.some((t: string) => t.toLowerCase().includes(searchStr)) ||
          row.classes.some((c: string) => c.toLowerCase().includes(searchStr)) ||
          row.type.toLowerCase().includes(searchStr)
      );
    }

    // Global Stats Counts (from unique subjects)
    const [totalInDb, totalTheory, totalLab] = await Promise.all([
      prisma.subject.count(),
      prisma.subject.count({ where: { type: { equals: "Theory", mode: "insensitive" } } }),
      prisma.subject.count({ where: { type: { equals: "Lab", mode: "insensitive" } } }),
    ]);

    // Paginate matching rows
    const totalMatching = filteredRows.length;
    const skip = (currentPage - 1) * pageSize;
    const paginatedData = filteredRows.slice(skip, skip + pageSize);

    return res.status(200).json({
      success: true,
      data: paginatedData,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / pageSize),
      },
      stats: {
        total: totalInDb,
        theory: totalTheory,
        lab: totalLab,
        found: totalMatching,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};

async function getOrCreateDummyTeacher() {
  const dummyEmail = "unassigned@erp.com";
  const dummyEmployeeId = "TCH_UNASSIGNED";

  // Check if teacher exists
  let teacher = await prisma.teacher.findUnique({
    where: { employeeId: dummyEmployeeId },
  });

  if (!teacher) {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: dummyEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Unassigned Teacher",
          email: dummyEmail,
          passwordHash: "",
          role: "TEACHER",
          isActive: false,
        },
      });
    }

    teacher = await prisma.teacher.create({
      data: {
        firstName: "Unassigned",
        lastName: "",
        employeeId: dummyEmployeeId,
        joiningDate: new Date(),
        userId: user.id,
        email: dummyEmail,
        status: "INACTIVE",
      },
    });
  }

  return teacher;
}

// 2. CREATE SUBJECT (supports assigning to class and sections)
export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, code, type = "Theory", classId, sectionIds = [] } = req.body;

    if (!name || !code || !classId) {
      return res.status(400).json({
        success: false,
        message: "Subject name, code, and class assignment are required.",
      });
    }

    // Check if the class exists first
    const parentClass = await prisma.class.findUnique({
      where: { id: classId },
    });
    if (!parentClass) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    // Check if subject code already exists globally
    const existingSubjectCode = await prisma.subject.findFirst({
      where: {
        code: {
          equals: code.toUpperCase().trim(),
          mode: "insensitive"
        }
      }
    });

    if (existingSubjectCode) {
      return res.status(400).json({
        success: false,
        message: "Subject with this code already exists.",
      });
    }

    // Create new subject
    const subject = await prisma.subject.create({
      data: {
        name,
        code: code.toUpperCase().trim(),
        type,
        classId,
      },
    });

    // Create assignments for all selected sections under dummy teacher
    if (Array.isArray(sectionIds) && sectionIds.length > 0) {
      const dummyTeacher = await getOrCreateDummyTeacher();
      for (const sectionId of sectionIds) {
        await prisma.teacherSectionSubject.create({
          data: {
            teacherId: dummyTeacher.id,
            sectionId,
            subjectId: subject.id,
          },
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      data: subject,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error creating subject",
      error: error.message,
    });
  }
};

// 3. UPDATE SUBJECT (updates subject details and section assignments)
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, code, type, classId, sectionIds = [] } = req.body;

    if (!name || !code || !classId) {
      return res.status(400).json({
        success: false,
        message: "Subject name, code, and class assignment are required.",
      });
    }

    // Find the subject record
    let subjectId = "";
    const tss = await prisma.teacherSectionSubject.findUnique({
      where: { id },
    });

    if (tss) {
      subjectId = tss.subjectId;
    } else {
      const subject = await prisma.subject.findUnique({
        where: { id },
      });
      if (!subject) {
        return res.status(404).json({ success: false, message: "Subject not found." });
      }
      subjectId = subject.id;
    }

    // Check if subject code already exists globally on ANOTHER subject
    const existingSubjectCode = await prisma.subject.findFirst({
      where: {
        code: {
          equals: code.toUpperCase().trim(),
          mode: "insensitive"
        },
        id: {
          not: subjectId
        }
      }
    });

    if (existingSubjectCode) {
      return res.status(400).json({
        success: false,
        message: "Subject with this code already exists.",
      });
    }

    // Update parent subject
    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        name,
        code: code.toUpperCase().trim(),
        type,
        classId,
      },
    });

    // Update teaching assignments for sections under dummy teacher
    const dummyTeacher = await getOrCreateDummyTeacher();

    // Get all current assignments for this subject
    const currentAssignments = await prisma.teacherSectionSubject.findMany({
      where: { subjectId },
    });

    // Delete assignments for sections that are no longer selected
    const toDelete = currentAssignments.filter(a => !sectionIds.includes(a.sectionId));
    for (const tssDel of toDelete) {
      await prisma.teacherSectionSubject.delete({
        where: { id: tssDel.id }
      });
    }

    // Create/update assignments for selected sections
    for (const secId of sectionIds) {
      const existing = currentAssignments.find(a => a.sectionId === secId);
      if (existing) {
        // Ensure the teacher is the dummy teacher
        if (existing.teacherId !== dummyTeacher.id) {
          await prisma.teacherSectionSubject.update({
            where: { id: existing.id },
            data: { teacherId: dummyTeacher.id },
          });
        }
      } else {
        // Create new assignment
        await prisma.teacherSectionSubject.create({
          data: {
            subjectId,
            sectionId: secId,
            teacherId: dummyTeacher.id,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error updating subject",
      error: error.message,
    });
  }
};

// 4. BULK DELETE SUBJECTS / ASSIGNMENTS
export const bulkDeleteSubjects = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty subject IDs list." });
    }

    for (const id of ids) {
      const tss = await prisma.teacherSectionSubject.findUnique({
        where: { id },
      });

      if (tss) {
        // Delete the assignment
        await prisma.teacherSectionSubject.delete({
          where: { id },
        });

        // Cleanup: If parent Subject has no other assignments left, delete it too
        const remainingCount = await prisma.teacherSectionSubject.count({
          where: { subjectId: tss.subjectId },
        });

        if (remainingCount === 0) {
          await prisma.subject.delete({
            where: { id: tss.subjectId },
          });
        }
      } else {
        // Delete the Subject directly
        const subject = await prisma.subject.findUnique({
          where: { id },
        });

        if (subject) {
          await prisma.subject.delete({
            where: { id },
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted selected subjects/assignments.`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error deleting subjects",
      error: error.message,
    });
  }
};

// 5. GET ALL CLASSES (for dynamic filters & dropdown options)
export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching classes",
      error: error.message,
    });
  }
};

// 6. GET SECTIONS FOR A CLASS
export const getSectionsByClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.classId as string;

    const sections = await prisma.section.findMany({
      where: {
        classId: classId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching sections for class",
      error: error.message,
    });
  }
};

// 7. GET ALL TEACHERS (for dynamic dropdown)
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    const formattedTeachers = teachers.map((t) => ({
      id: t.id,
      name: `${t.firstName} ${t.lastName}`.trim() || t.email || "Unnamed Teacher",
    }));

    return res.status(200).json({
      success: true,
      data: formattedTeachers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};

// 8. GET SINGLE SUBJECT BY ID (with all assigned sections & teacher)
export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const tss = await prisma.teacherSectionSubject.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            teachingAssignments: true
          }
        }
      }
    });

    let subject;

    if (tss) {
      subject = tss.subject;
    } else {
      subject = await prisma.subject.findUnique({
        where: { id },
        include: {
          teachingAssignments: true
        }
      });
    }

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    const sectionIds = subject.teachingAssignments.map(ta => ta.sectionId);

    return res.status(200).json({
      success: true,
      data: {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        type: subject.type,
        classId: subject.classId,
        sectionIds
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving subject details",
      error: error.message
    });
  }
};
