import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { normalizeAssignmentsForStudent } from '../utils/assignmentNormalizer.js';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      content, 
      classId, 
      sectionId, 
      subjectId, 
      dueDate, 
      maxScore 
    } = req.body;
  

    const userId = (req as any).user.id;
    const teacher = await prisma.teacher.findUnique({
      where: { userId: userId }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile record not found for this authenticated session."
      });
    }
    const teacherId = teacher.id;

    // 1. Handle File Path (from Multer)
    const fileUrl = req.file ? req.file.path : null;

    // 2. Validate Class-Section Relationship
    // If a sectionId is provided, make sure it actually belongs to that classId
    if (sectionId) {
      const section = await prisma.section.findFirst({
        where: { id: sectionId, classId: classId }
      });
      if (!section) {
        return res.status(400).json({ 
          success: false, 
          message: "The selected section does not belong to this class." 
        });
      }
    }

    // 3. Create Assignment in Database
    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        content,
        fileUrl,
        dueDate: new Date(dueDate),
        maxScore: parseInt(maxScore) || 100,
        subjectId,
        classId,
        sectionId: sectionId || null, // If empty, it becomes a Class-wide task
        teacherId
      },
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: "Assignment published successfully!",
      data: newAssignment
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentAssignments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string; 
    const skip = (page - 1) * limit;

    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true, sectionId: true, section: { select: { classId: true } } }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    const baseWhere: any = {
      classId: student.section.classId,
      OR: [
        { sectionId: null },             
        { sectionId: student.sectionId }
      ]
    };

    // Logical evaluation using relation queries (some / none) and deadlines
    if (status === 'COMPLETED') {
      // Completed means a submission record successfully exists for this student
      baseWhere.submissions = {
        some: { studentId: student.id }
      };
    } else if (status === 'PENDING') {
      // Pending means no submission record exists yet AND the deadline is in the future
      baseWhere.submissions = {
        none: { studentId: student.id }
      };
      baseWhere.dueDate = {
        gte: new Date() 
      };
    } else if (status === 'OVERDUE') {
      // Overdue means no submission record exists yet AND the deadline has passed
      baseWhere.submissions = {
        none: { studentId: student.id }
      };
      baseWhere.dueDate = {
        lt: new Date() 
      };
    }

    const [totalRecords, assignments] = await Promise.all([
      prisma.assignment.count({ where: baseWhere }),
      prisma.assignment.findMany({
        where: baseWhere,
        skip: skip,   
        take: limit,  
        include: {
          subject: { select: { name: true } },
          teacher: { select: { firstName: true, lastName: true } },
          submissions: {
            where: { studentId: student.id },
            select: { status: true, marksObtained: true } 
          }
        },
        orderBy: { dueDate: 'asc' } 
      })
    ]);

    const normalizedFeed = normalizeAssignmentsForStudent(assignments as any);
    
    res.status(200).json({ 
      success: true, 
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords: totalRecords,
        limit: limit
      },
      data: normalizedFeed 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAssignment = async (req: Request, res: Response) => {
  try {
    // 1. Change 'studentString' to 'student' to match the frontend
    const { student, assignmentId, content } = req.body;

    if (!student) return res.status(404).json({ success: false, message: "Student record not found" });
    
    // 2. Parse the 'student' string
    const parsedStudent = JSON.parse(student);

    // 2. Verify Assignment exists and check deadline
    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

    const isLate = new Date() > new Date(assignment.dueDate);

    // 3. Save Submission
    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: parsedStudent.id, // Use the parsed ID
        content: content || null,
        fileUrl: req.file ? req.file.path : null,
        status: isLate ? 'LATE' : 'SUBMITTED',
        submittedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: isLate ? "Submitted successfully (Marked Late)" : "Submitted successfully!",
      data: submission
    });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: "You have already submitted this assignment." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignmentSubmissions = async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.id;
    const { search = "", status = "ALL", page = "1", pageSize = "10" } = req.query;

    // 1. Fetch Assignment basic details
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        class: { select: { name: true } },
        section: { select: { id: true, name: true } },
        subject: { select: { name: true } },
      }
    });

    if (!assignment || !assignment.sectionId) {
      return res.status(404).json({ success: false, message: "Assignment or Section not found" });
    }

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: assignment.teacherId,
      },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    const teacherName = teacher
      ? `${teacher.firstName} ${teacher.lastName}`
      : "Unknown Teacher";

    const sectionId = assignment.sectionId;

    // 2. ⚡ OPTIMIZED STATS: Let the database count the rows
    const [totalStudents, submittedCount, lateCount] = await Promise.all([
      prisma.student.count({ where: { sectionId } }),
      prisma.submission.count({ 
        where: { assignmentId, status: { in: ["SUBMITTED", "GRADED"] } } 
      }),
      prisma.submission.count({ 
        where: { assignmentId, status: "LATE" } 
      })
    ]);

    const stats = {
      total: totalStudents,
      submitted: submittedCount,
      late: lateCount,
      missing: totalStudents - (submittedCount + lateCount),
    };

    // 3. ⚡ DYNAMIC WHERE CLAUSE: Let Prisma filter everything
    const studentWhere: any = { sectionId };

    if (search) {
      studentWhere.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { rollNumber: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (status !== "ALL") {
      if (status === "MISSING") {
        // Students with NO submission for this assignment
        studentWhere.submissions = { none: { assignmentId } };
      } else {
        // Students WITH a submission matching the status
        const targetStatuses = status === "SUBMITTED" ? ["SUBMITTED", "GRADED"] : [status];
        studentWhere.submissions = { 
          some: { assignmentId, status: { in: targetStatuses } } 
        };
      }
    }

    // 4. ⚡ TRUE PAGINATION: Only pull the 10 rows we actually need
    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.max(1, parseInt(pageSize as string));
    const skip = (pageNum - 1) * limit;

    const [filteredTotal, paginatedStudents] = await Promise.all([
      prisma.student.count({ where: studentWhere }),
      prisma.student.findMany({
        where: studentWhere,
        skip,
        take: limit,
        orderBy: { rollNumber: 'asc' }, // Keep the UI list ordered
        include: {
          submissions: {
            where: { assignmentId },
            take: 1
          }
        }
      })
    ]);

    // 5. Format for the React Frontend
    const formattedSubmissions = paginatedStudents.map(student => {
      const sub = student.submissions[0]; // Will be undefined if missing
      
      let currentStatus = "MISSING";
      if (sub) {
         currentStatus = sub.status === "GRADED" ? "SUBMITTED" : sub.status;
      }

      return {
        studentId: student.id,
        rollNo: student.rollNumber,
        name: `${student.firstName} ${student.lastName}`,
        submittedOn: sub ? sub.submittedAt : null,
        status: currentStatus,
        marks: sub?.marksObtained ?? null,
        result: sub?.marksObtained !== null && sub?.marksObtained !== undefined 
            ? (sub.marksObtained >= (assignment.maxScore * 0.4) ? "Pass" : "Fail") 
            : null,
        submissionId: sub?.id ?? null,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
         assignmentInfo: {
             id: assignment.id,
             title: assignment.title,
             subject: (assignment as any).subject.name,
             subjectId: assignment.subjectId,
             class: (assignment as any).class.name,
             classId: assignment.classId,
             section: (assignment as any).section?.name || "",
             sectionId: assignment.sectionId,
             fileUrl: assignment.fileUrl,
             givenBy: teacherName,
             description: assignment.content || `Maximum marks: ${assignment.maxScore || 100} marks. No description provided.`,
             content: assignment.content || "",
             dueDate: assignment.dueDate,
             createdAt: assignment.createdAt,
             maxScore: assignment.maxScore
         },
         stats,
         submissions: formattedSubmissions,
      },
      pagination: {
        total: filteredTotal,
        page: pageNum,
        pageSize: limit,
        totalPages: Math.ceil(filteredTotal / limit)
      }
    });

  } catch (error: any) {
    console.error("[getAssignmentSubmissions] Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const gradeSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { score, remarks } = req.body;
    const teacherId = (req as any).user.id;

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        marksObtained: parseFloat(score),
        remarks,
        status: 'GRADED',
        gradedById: teacherId
      }
    });

    res.status(200).json({
      success: true,
      message: "Submission graded successfully!",
      data: updatedSubmission
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /assignments/list
// Teacher: paginated, lightweight assignment cards
// Query params:
//   classId    – required
//   sectionId  – optional
//   date       – "today" | "all"  (default: "all")
//   page       – number (default: 1)
//   pageSize   – number (default: 10, max: 50)
// ─────────────────────────────────────────────
export const getAssignmentList = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Verify caller is a teacher
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found for this session.',
      });
    }

    // ── Parse & validate query params ──────────────────────────
    // Added subjectId here!
    const { classId, sectionId, subjectId, date } = req.query as Record<string, string>;

    const page     = Math.max(1, parseInt((req.query.page     as string) ?? '1',  10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt((req.query.pageSize as string) ?? '10', 10) || 10));
    const skip     = (page - 1) * pageSize;

    if (!classId) {
      return res.status(400).json({ success: false, message: 'classId is required.' });
    }

    // ── Build where clause ──────────────────────────────────────
    const where: any = {
      teacherId: teacher.id,
    };

    if (classId) {
      where.classId = classId;
    }

    if (sectionId) {
      where.sectionId = sectionId;
    }
    
    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (date === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      where.dueDate = { gte: startOfDay, lte: endOfDay };
    }

    // ── Run count + paginated fetch in parallel ─────────────────
    const [total, assignments] = await Promise.all([
      prisma.assignment.count({ where }),
      prisma.assignment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { dueDate: 'asc' },
        select: {
          id:        true,
          title:     true,
          content:   true,
          dueDate:   true,
          maxScore:  true,
          sectionId: true,
          class:     { select: { id: true, name: true } },
          section:   { select: { id: true, name: true } },
          subject:   { select: { id: true, name: true } },
          // attachment count: non-null fileUrl means 1 attachment
          fileUrl:   true,
          // lightweight submission counts (no full objects)
          _count: {
            select: { submissions: true },
          },
        },
      }),
    ]);

    // ── Shape the response ──────────────────────────────────────
    const cards = assignments.map((a) => ({
      id:              a.id,
      title:           a.title,
      content:         a.content,
      dueDate:         a.dueDate,
      maxScore:        a.maxScore,
      class:           a.class,
      section:         a.section ?? null,
      subject:         a.subject,
      fileUrl:         a.fileUrl,
      attachmentCount: a.fileUrl ? 1 : 0,
      submissionCount: a._count.submissions,
    }));

    return res.status(200).json({
      success: true,
      data: cards,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.error("[getAssignmentList] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /assignments/:id/details
// Full assignment record + submissions summary
// ─────────────────────────────────────────────
export const getAssignmentDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId  = (req as any).user.id;

    // Verify caller is a teacher
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found for this session.',
      });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        class:   { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
        submissions: {
          orderBy: { submittedAt: 'desc' },
          include: {
            student: {
              select: {
                id:         true,
                rollNumber: true,
                user:       { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    // Ensure the requesting teacher owns this assignment
    if (assignment.teacherId !== teacher.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(200).json({ success: true, data: assignment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET /assignments/summary
// Dashboard stats: submitted / late / missing counts
// Query params:
//   classId   – required
//   sectionId – optional
// ─────────────────────────────────────────────
export const getAssignmentSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found for this session.',
      });
    }

    const { classId, sectionId } = req.query as Record<string, string>;

    if (!classId) {
      return res.status(400).json({ success: false, message: 'classId is required.' });
    }

    // 1. Fetch all assignment IDs for this teacher + class (+ optional section)
    const assignmentWhere: any = {
      teacherId: teacher.id,
      classId,
    };
    if (sectionId) {
      assignmentWhere.sectionId = sectionId;
    }

    const assignments = await prisma.assignment.findMany({
      where: assignmentWhere,
      select: { id: true },
    });

    if (assignments.length === 0) {
      return res.status(200).json({
        success: true,
        data: { submitted: 0, late: 0, missing: 0, total: 0 },
      });
    }

    const assignmentIds = assignments.map((a) => a.id);

    // 2. Count submission statuses in a single aggregation-style query
    const [submitted, late] = await Promise.all([
      prisma.submission.count({
        where: {
          assignmentId: { in: assignmentIds },
          status: 'SUBMITTED',
        },
      }),
      prisma.submission.count({
        where: {
          assignmentId: { in: assignmentIds },
          status: 'LATE',
        },
      }),
    ]);

    // 3. "Missing" = total possible submissions - actual submissions received
    //    To calculate: count total enrolled students for the class/section
    //    then subtract total submissions (SUBMITTED + LATE + GRADED)
    const totalSubmissions = await prisma.submission.count({
      where: { assignmentId: { in: assignmentIds } },
    });

    // Count students in the relevant scope
    const studentCount = await prisma.student.count({
      where: sectionId
        ? { sectionId }
        : { section: { classId } },
    });

    // Each assignment should have one submission per student
    const totalExpected = assignmentIds.length * studentCount;
    const missing       = Math.max(0, totalExpected - totalSubmissions);

    return res.status(200).json({
      success: true,
      data: {
        submitted,
        late,
        missing,
        total:           assignmentIds.length,
        studentCount,
        totalSubmissions,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      content, 
      classId, 
      sectionId, 
      subjectId, 
      dueDate, 
      maxScore 
    } = req.body;

    const titleStr = title as string | undefined;
    const contentStr = content as string | undefined;
    const classIdStr = classId as string | undefined;
    const sectionIdStr = sectionId as string | undefined;
    const subjectIdStr = subjectId as string | undefined;
    const dueDateStr = dueDate as string | undefined;
    const maxScoreVal = maxScore !== undefined ? (parseInt(maxScore as string) || 100) : undefined;

    const userId = (req as any).user.id;
    const teacher = await prisma.teacher.findUnique({
      where: { userId: userId }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile record not found for this authenticated session."
      });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: id as string }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found."
      });
    }

    if (assignment.teacherId !== teacher.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this assignment."
      });
    }

    // 1. Handle File Path (from Multer)
    let fileUrl: string | null = assignment.fileUrl;
    if (req.file) {
      fileUrl = req.file.path;
    } else if (req.body.removeAttachment === "true") {
      fileUrl = null;
    }

    // 2. Validate Class-Section Relationship
    if (sectionIdStr) {
      const whereClause: any = { id: sectionIdStr };
      if (classIdStr) {
        whereClause.classId = classIdStr;
      }
      const section = await prisma.section.findFirst({
        where: whereClause
      });
      if (!section) {
        return res.status(400).json({ 
          success: false, 
          message: "The selected section does not belong to this class." 
        });
      }
    }

    const dataToUpdate: any = {};
    if (titleStr !== undefined) dataToUpdate.title = titleStr;
    if (contentStr !== undefined) dataToUpdate.content = contentStr;
    if (fileUrl !== undefined) dataToUpdate.fileUrl = fileUrl;
    if (dueDateStr !== undefined) dataToUpdate.dueDate = new Date(dueDateStr);
    if (maxScoreVal !== undefined) dataToUpdate.maxScore = maxScoreVal;
    if (subjectIdStr !== undefined) dataToUpdate.subjectId = subjectIdStr;
    if (classIdStr !== undefined) dataToUpdate.classId = classIdStr;
    if (sectionIdStr !== undefined) {
      dataToUpdate.sectionId = sectionIdStr === "" ? null : sectionIdStr;
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: id as string },
      data: dataToUpdate,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } }
      }
    });

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully!",
      data: updatedAssignment
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};