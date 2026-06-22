import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const registerStaff = async (req, res) => {
    const { name, email, password, role, // role will be ADMIN or FINANCE
    employeeId, department, designation, joiningDate } = req.body;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({ where: { email } });
            if (existingUser)
                throw new Error("Email already registered");
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role,
                },
            });
            const staff = await tx.staff.create({
                data: {
                    employeeId,
                    department,
                    designation,
                    joiningDate: new Date(joiningDate),
                    userId: user.id,
                },
            });
            return { user, staff };
        });
        res.status(201).json({
            success: true,
            message: `${role} onboarded successfully`,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=staffController.js.map