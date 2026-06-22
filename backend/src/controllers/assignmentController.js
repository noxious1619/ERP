import { prisma } from '../lib/prisma.js';
import { normalizeAssignmentsForStudent } from '../utils/assignmentNormalizer.js';
export const createAssignment = async (req, res) => {
    try {
        const { title, content, classId, sectionId, subjectId, dueDate, maxScore } = req.body;
        console.log(req.body);
        const userId = req.user.id;
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getStudentAssignments = async (req, res) => {
    try {
        const userId = req.user.id;
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
        const normalizedFeed = normalizeAssignmentsForStudent(assignments);
        res.status(200).json({ success: true, data: normalizedFeed });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, content } = req.body;
        const userId = req.user.id;
        // 1. Get Student ID from the logged-in User
        const student = await prisma.student.findUnique({ where: { userId } });
        if (!student)
            return res.status(404).json({ success: false, message: "Student record not found" });
        // 2. Verify Assignment exists and check deadline
        const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
        if (!assignment)
            return res.status(404).json({ success: false, message: "Assignment not found" });
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
    }
    catch (error) {
        // Prisma Unique Constraint Error (P2002) - Student already submitted
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: "You have already submitted this assignment." });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAssignmentSubmissions = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { score, remarks } = req.body;
        const teacherId = req.user.id;
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=assignmentController.js.map