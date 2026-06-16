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
    console.log(req.body)

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

    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true, sectionId: true, section: { select: { classId: true } } }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    // 2. Fetch assignments matching Class + (Specific Section OR null)
    const assignments = await prisma.assignment.findMany({
      where: {
        classId: student.section.classId,
        OR: [
          { sectionId: null },             
          { sectionId: student.sectionId }
        ]
      },
      include: {
        subject: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true } },
        submissions: {
          where: { studentId: student.id },
          select: { status: true, score: true }
        }
      },
      orderBy: { dueDate: 'asc' } 
    });
    const normalizedFeed = normalizeAssignmentsForStudent(assignments as any);
    res.status(200).json({ success: true, data: normalizedFeed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const { assignmentId, content } = req.body;
    const userId = (req as any).user.id;

    // 1. Get Student ID from the logged-in User
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) return res.status(404).json({ success: false, message: "Student record not found" });

    // 2. Verify Assignment exists and check deadline
    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

    const isLate = new Date() > new Date(assignment.dueDate);

    // 3. Save Submission
    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: student.id,
        content: content || null,
        fileUrl: req.file ? req.file.path : null, // The PDF from Multer
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
    // Prisma Unique Constraint Error (P2002) - Student already submitted
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: "You have already submitted this assignment." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignmentSubmissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Assignment ID

    const submissions = await prisma.submission.findMany({
      where: { assignmentId: id },
      include: {
        student: {
          select: {
            id: true,
            rollNumber: true,
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.status(200).json({ success: true, data: submissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
        score: parseFloat(score),
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
    const { classId, sectionId, date } = req.query as Record<string, string>;

    const page     = Math.max(1, parseInt((req.query.page     as string) ?? '1',  10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt((req.query.pageSize as string) ?? '10', 10) || 10));
    const skip     = (page - 1) * pageSize;

    if (!classId) {
      return res.status(400).json({ success: false, message: 'classId is required.' });
    }

    // ── Build where clause ──────────────────────────────────────
    const where: any = {
      teacherId: teacher.id,
      classId,
    };

    if (sectionId) {
      where.sectionId = sectionId;
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
      dueDate:         a.dueDate,
      maxScore:        a.maxScore,
      class:           a.class,
      section:         a.section ?? null,
      subject:         a.subject,
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