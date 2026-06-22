import { prisma } from "../lib/prisma.js";
import { getIndianDefaultHolidays } from "../utils/holidayDefaults.js";
import { HOLIDAY_TYPES, HOLIDAY_AUDIENCE } from "../constants/holiday.js";
// 🔐 Validation helpers
const VALID_HOLIDAY_TYPES = Object.values(HOLIDAY_TYPES);
const VALID_AUDIENCE = Object.values(HOLIDAY_AUDIENCE);
// 1. INITIALIZE DEFAULT HOLIDAYS
export const initializeYearHolidays = async (req, res) => {
    const { academicYearId, year } = req.body;
    try {
        if (!academicYearId || !year) {
            return res.status(400).json({
                success: false,
                message: "Academic Year ID and year are required.",
            });
        }
        // Prevent duplicate seeding
        const existing = await prisma.holiday.count({
            where: { academicYearId },
        });
        if (existing > 0) {
            return res.status(400).json({
                success: false,
                message: "Holidays already initialized for this academic year",
            });
        }
        const defaults = getIndianDefaultHolidays(academicYearId, year);
        const created = await prisma.holiday.createMany({
            data: defaults,
            skipDuplicates: true,
        });
        res.status(201).json({
            success: true,
            message: `Seeded ${created.count} holidays`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// 2. GET HOLIDAYS (ROLE BASED)
export const getHolidays = async (req, res) => {
    try {
        const { academicYearId } = req.query;
        const userRole = req.user.role;
        if (!academicYearId) {
            return res.status(400).json({
                success: false,
                message: "academicYearId is required",
            });
        }
        const audienceFilter = [HOLIDAY_AUDIENCE.ALL];
        if (userRole === "STUDENT") {
            audienceFilter.push(HOLIDAY_AUDIENCE.STUDENT);
        }
        else {
            audienceFilter.push(HOLIDAY_AUDIENCE.STAFF);
        }
        const holidays = await prisma.holiday.findMany({
            where: {
                academicYearId: String(academicYearId),
                appliesTo: { in: audienceFilter },
            },
            orderBy: { startDate: "asc" },
        });
        res.status(200).json({
            success: true,
            count: holidays.length,
            data: holidays,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// 3. ADD HOLIDAY
export const addHoliday = async (req, res) => {
    const { title, description, startDate, endDate, type, appliesTo, academicYearId } = req.body;
    try {
        // ✅ Validation
        if (type && !VALID_HOLIDAY_TYPES.includes(type)) {
            return res.status(400).json({ message: "Invalid holiday type" });
        }
        if (appliesTo && !VALID_AUDIENCE.includes(appliesTo)) {
            return res.status(400).json({ message: "Invalid audience" });
        }
        const holiday = await prisma.holiday.create({
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate || startDate),
                type: type || HOLIDAY_TYPES.GAZETTED,
                appliesTo: appliesTo || HOLIDAY_AUDIENCE.ALL,
                academicYearId,
            },
        });
        res.status(201).json({ success: true, data: holiday });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create holiday",
            error: error.message,
        });
    }
};
// 4. UPDATE HOLIDAY
export const updateHoliday = async (req, res) => {
    const { id } = req.params;
    try {
        const { type, appliesTo } = req.body;
        // ✅ Validation
        if (type && !VALID_HOLIDAY_TYPES.includes(type)) {
            return res.status(400).json({ message: "Invalid holiday type" });
        }
        if (appliesTo && !VALID_AUDIENCE.includes(appliesTo)) {
            return res.status(400).json({ message: "Invalid audience" });
        }
        const updated = await prisma.holiday.update({
            where: { id },
            data: {
                ...req.body,
                startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
                endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
                type,
                appliesTo,
            },
        });
        res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Update failed",
            error: error.message,
        });
    }
};
// 5. DELETE HOLIDAY
export const deleteHoliday = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.holiday.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Holiday deleted",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Delete failed",
            error: error.message,
        });
    }
};
//# sourceMappingURL=holidayController.js.map