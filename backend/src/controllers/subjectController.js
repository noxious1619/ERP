import { prisma } from "../lib/prisma.js";
// Helper to resolve a teacher by name
async function resolveTeacherByName(teacherName) {
    if (!teacherName || !teacherName.trim())
        return { id: null, name: "Unassigned" };
    const nameStr = teacherName.trim();
    const parts = nameStr.split(/\s+/);
    const firstNamePart = parts[0] || "";
    const lastNamePart = parts.slice(1).join(" ") || "";
    // Search case-insensitively in existing Teacher table
    const teacher = await prisma.teacher.findFirst({
        where: {
            OR: [
                {
                    firstName: { contains: firstNamePart, mode: "insensitive" },
                    ...(lastNamePart ? { lastName: { contains: lastNamePart, mode: "insensitive" } } : {}),
                },
                {
                    lastName: { contains: firstNamePart, mode: "insensitive" },
                },
            ],
        },
        select: { id: true, firstName: true, lastName: true },
    });
    if (teacher) {
        return {
            id: teacher.id,
            name: `${teacher.firstName} ${teacher.lastName}`.trim(),
        };
    }
    // If not found in database, return the name entered as-is
    return { id: null, name: nameStr };
}
// Helper to find or create academic year, class
async function getOrCreateClass(classVal) {
    const nameStr = classVal.trim();
    // 1. Get current or first academic year
    let academicYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
    });
    if (!academicYear) {
        academicYear = await prisma.academicYear.findFirst();
    }
    if (!academicYear) {
        academicYear = await prisma.academicYear.create({
            data: {
                name: "2026-2027",
                isCurrent: true,
            },
        });
    }
    // 2. Find or create Class in existing Class table
    let academicClass = await prisma.class.findFirst({
        where: {
            name: { equals: nameStr, mode: "insensitive" },
            academicYearId: academicYear.id,
        },
    });
    if (!academicClass) {
        academicClass = await prisma.class.create({
            data: {
                name: nameStr,
                academicYearId: academicYear.id,
            },
        });
    }
    return academicClass;
}
// 1. GET ALL SUBJECTS (with filters, search, pagination, and live stats)
export const getAllSubjects = async (req, res) => {
    try {
        const { search = "", classId = "", type = "", page = "1", limit = "6", } = req.query;
        const currentPage = Math.max(1, Number(page));
        const pageSize = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageSize;
        // Build the query where clause
        const whereClause = {
            AND: [],
        };
        // Filter by Class ID (which contains classId in classId field)
        if (classId && classId !== "All Classes") {
            whereClause.AND.push({
                classId: String(classId),
            });
        }
        // Filter by Type (Theory or Lab)
        if (type && type !== "All Type") {
            whereClause.AND.push({
                type: { equals: String(type), mode: "insensitive" },
            });
        }
        // Search query (case-insensitive across name, code, class name, teacher name)
        if (search) {
            const searchStr = String(search).trim();
            whereClause.AND.push({
                OR: [
                    { name: { contains: searchStr, mode: "insensitive" } },
                    { code: { contains: searchStr, mode: "insensitive" } },
                    { className: { contains: searchStr, mode: "insensitive" } },
                    { teacherName: { contains: searchStr, mode: "insensitive" } },
                ],
            });
        }
        // If AND is empty, clean it up
        if (whereClause.AND.length === 0) {
            delete whereClause.AND;
        }
        // Query dynamic subjects table
        const [subjects, totalMatching, totalInDb, totalTheory, totalLab] = await Promise.all([
            // Paginated subjects
            prisma.dynamicSubject.findMany({
                where: whereClause,
                skip,
                take: pageSize,
                orderBy: {
                    name: "asc",
                },
            }),
            // Total matching current search/filters
            prisma.dynamicSubject.count({ where: whereClause }),
            // Global stats counts
            prisma.dynamicSubject.count(),
            prisma.dynamicSubject.count({ where: { type: { equals: "Theory", mode: "insensitive" } } }),
            prisma.dynamicSubject.count({ where: { type: { equals: "Lab", mode: "insensitive" } } }),
        ]);
        // Format output to match frontend table layout requirements
        const formattedData = subjects.map((subj) => ({
            id: subj.id,
            name: subj.name,
            code: subj.code,
            classId: subj.classId,
            className: subj.className,
            classes: subj.section ? [`${subj.className} - ${subj.section}`] : [subj.className],
            section: subj.section || "",
            teacherId: subj.teacherId,
            teacherName: subj.teacherName || "Unassigned",
            teachers: [subj.teacherName || "Unassigned"],
            type: subj.type,
        }));
        return res.status(200).json({
            success: true,
            data: formattedData,
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch subjects",
            error: error.message,
        });
    }
};
// 2. CREATE SUBJECT (supports assigning to multiple classes simultaneously)
export const createSubject = async (req, res) => {
    try {
        const { name, code, type = "Theory", teacherName = "", classSections = [] } = req.body;
        if (!name || !code) {
            return res.status(400).json({ success: false, message: "Subject name and code are required." });
        }
        if (!classSections || !Array.isArray(classSections) || classSections.length === 0) {
            return res.status(400).json({ success: false, message: "At least one class assignment is required." });
        }
        // Resolve teacher ID and Name
        const teacherResult = await resolveTeacherByName(teacherName);
        const createdSubjects = [];
        // Loop through each class & section, verify/create class, and create the dynamic subject record
        for (const item of classSections) {
            const { classVal, section } = item;
            if (!classVal || !classVal.trim())
                continue;
            const academicClass = await getOrCreateClass(classVal);
            // Check if subject already exists for this specific class and section
            const existing = await prisma.dynamicSubject.findFirst({
                where: {
                    code: code.toUpperCase(),
                    classId: academicClass.id,
                    section: section ? section.trim() : null,
                },
            });
            if (existing) {
                // If it exists, update it instead of failing
                const updated = await prisma.dynamicSubject.update({
                    where: { id: existing.id },
                    data: {
                        name,
                        type,
                        teacherId: teacherResult.id,
                        teacherName: teacherResult.name,
                    },
                });
                createdSubjects.push(updated);
            }
            else {
                // Create new subject
                const newSubject = await prisma.dynamicSubject.create({
                    data: {
                        name,
                        code: code.toUpperCase(),
                        type,
                        classId: academicClass.id,
                        className: academicClass.name,
                        section: section ? section.trim() : null,
                        teacherId: teacherResult.id,
                        teacherName: teacherResult.name,
                    },
                });
                createdSubjects.push(newSubject);
            }
        }
        return res.status(201).json({
            success: true,
            message: `Successfully created/updated ${createdSubjects.length} subjects.`,
            data: createdSubjects,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating subject",
            error: error.message,
        });
    }
};
// 3. UPDATE SUBJECT (updates a single subject entry)
export const updateSubject = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, code, type, teacherName, classVal, section } = req.body;
        const existingSubject = await prisma.dynamicSubject.findUnique({
            where: { id: String(id) },
        });
        if (!existingSubject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (code !== undefined)
            updateData.code = code.toUpperCase();
        if (type !== undefined)
            updateData.type = type;
        if (teacherName !== undefined) {
            const teacherResult = await resolveTeacherByName(teacherName);
            updateData.teacherId = teacherResult.id;
            updateData.teacherName = teacherResult.name;
        }
        if (classVal !== undefined) {
            const academicClass = await getOrCreateClass(classVal);
            updateData.classId = academicClass.id;
            updateData.className = academicClass.name;
        }
        if (section !== undefined) {
            updateData.section = section ? section.trim() : null;
        }
        const updated = await prisma.dynamicSubject.update({
            where: { id: String(id) },
            data: updateData,
        });
        return res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            data: updated,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating subject",
            error: error.message,
        });
    }
};
// 4. BULK DELETE SUBJECTS
export const bulkDeleteSubjects = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or empty subject IDs list." });
        }
        // Perform deletion
        const deleteResult = await prisma.dynamicSubject.deleteMany({
            where: {
                id: { in: ids },
            },
        });
        return res.status(200).json({
            success: true,
            message: `Successfully deleted ${deleteResult.count} subjects.`,
            count: deleteResult.count,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting subjects",
            error: error.message,
        });
    }
};
// 5. GET ALL DYNAMIC CLASSES (for filtering)
export const getClasses = async (req, res) => {
    try {
        const classes = await prisma.class.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return res.status(200).json({
            success: true,
            data: classes,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching classes",
            error: error.message,
        });
    }
};
//# sourceMappingURL=subjectController.js.map