import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const createParentAccount = async (req, res) => {
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
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const upsertParentForStudent = async (req, res) => {
    const studentId = req.params.studentId;
    if (!studentId || Array.isArray(studentId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid student ID",
        });
    }
    const { fatherName, fatherPhone, motherName, motherPhone, email } = req.body;
    try {
        // 1. Check student exists
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: true },
        });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        let parent;
        if (student.parentId) {
            // 2a. Update existing parent record
            parent = await prisma.parent.update({
                where: { id: student.parentId },
                data: {
                    fatherName: fatherName ?? undefined,
                    fatherPhone: fatherPhone ?? undefined,
                    motherName: motherName ?? undefined,
                    motherPhone: motherPhone ?? undefined,
                    email: email ?? undefined,
                },
            });
        }
        else {
            // 2b. Create a new parent and link to student in one transaction
            parent = await prisma.$transaction(async (tx) => {
                const newParent = await tx.parent.create({
                    data: { fatherName, fatherPhone, motherName, motherPhone, email },
                });
                await tx.student.update({
                    where: { id: studentId },
                    data: { parentId: newParent.id },
                });
                return newParent;
            });
        }
        return res.status(200).json({ success: true, data: parent });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=parentController.js.map