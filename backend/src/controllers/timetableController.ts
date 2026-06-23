import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { normalizeTimetable } from '../helper/timetableHelper.js';
import { isCurrentPeriodActive , getDuration } from '../helper/activePeriod.helper.js'; 

export const createTimetableEntry = async (req: Request, res: Response) => {
  try {
    const { 
      day, 
      period, 
      startTime, 
      endTime, 
      room, 
      color, 
      isBreak, 
      breakLabel, 
      sectionId, 
      subjectId, 
      teacherId 
    } = req.body;

    const formattedDay = day.toUpperCase();
    const periodNumber = Number(period);
    const treatAsBreak = Boolean(isBreak);

    if (!treatAsBreak) {
      if (teacherId) {
        const teacherConflict = await prisma.timetable.findFirst({
          where: { 
            day: formattedDay as any, 
            period: periodNumber, 
            teacherId 
          }
        });
        if (teacherConflict) {
          return res.status(400).json({ 
            success: false, 
            message: "Teacher is already assigned to another section at this time." 
          });
        }
      }
    }

    const sectionConflict = await prisma.timetable.findFirst({
      where: { 
        day: formattedDay as any, 
        period: periodNumber, 
        sectionId 
      }
    });
    if (sectionConflict) {
      return res.status(400).json({ 
        success: false, 
        message: "This section already has a scheduled block for this period." 
      });
    }

    // 3. Create database entry with proper dynamic column typing
    const entry = await prisma.timetable.create({
      data: {
        day: formattedDay as any,
        period: periodNumber,
        startTime,
        endTime,
        room: room || null,
        color: color || null,
        isBreak: treatAsBreak,
        breakLabel: treatAsBreak ? (breakLabel || "Recess") : null,
        sectionId,
        subjectId: treatAsBreak ? null : subjectId,
        teacherId: treatAsBreak ? null : teacherId
      }
    });

    return res.status(201).json({ success: true, data: entry });

  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Error creating timetable entry", 
      error: error.message 
    });
  }
};

export const createWeeklyTimetable = async (req: Request, res: Response) => {
  try {
    const { entries } = req.body;

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'entries' field must be a non-empty array."
      });
    }

    // Wrap everything in a transaction for clean atomicity
    const result = await prisma.$transaction(async (tx) => {
      const createdEntries = [];

      for (const entry of entries) {
        const {
          day,
          period,
          startTime,
          endTime,
          room,
          color,
          isBreak,
          breakLabel,
          sectionId,
          subjectId,
          teacherId
        } = entry;

        const formattedDay = day.toUpperCase();
        const periodNumber = Number(period);
        const treatAsBreak = Boolean(isBreak);

        // 1. Conflict check for Teacher (Skip if it's a structural break)
        if (!treatAsBreak && teacherId) {
          const teacherConflict = await tx.timetable.findFirst({
            where: {
              day: formattedDay as any,
              period: periodNumber,
              teacherId
            }
          });
          if (teacherConflict) {
            throw new Error(`Conflict: Teacher is already assigned at ${formattedDay}, Period ${periodNumber}.`);
          }
        }

        // 2. Conflict check for Section
        const sectionConflict = await tx.timetable.findFirst({
          where: {
            day: formattedDay as any,
            period: periodNumber,
            sectionId
          }
        });
        if (sectionConflict) {
          throw new Error(`Conflict: Section already has a class scheduled at ${formattedDay}, Period ${periodNumber}.`);
        }

        // 3. Stage the record creation
        const newEntry = await tx.timetable.create({
          data: {
            day: formattedDay as any,
            period: periodNumber,
            startTime,
            endTime,
            room: room || null,
            color: color || null,
            isBreak: treatAsBreak,
            breakLabel: treatAsBreak ? (breakLabel || "Recess") : null,
            sectionId,
            subjectId: treatAsBreak ? null : subjectId,
            teacherId: treatAsBreak ? null : teacherId
          }
        });

        createdEntries.push(newEntry);
      }

      return createdEntries;
    });

    return res.status(201).json({
      success: true,
      message: `Successfully created ${result.length} timetable entries.`,
      data: result
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Failed to create weekly schedule batch.",
      error: error.message
    });
  }
};

export const getDailyTimetableBySection = async (
  req: Request,
  res: Response
) => {
  try {
    const { sectionId } = req.params;
    const { day } = req.query;
 
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId is required.",
      });
    }
 
    if (!day || typeof day !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid day parameter is required.",
      });
    }
 
    if (day.trim().toLowerCase() === "sunday") {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
 
    const timetableRows = await prisma.timetable.findMany({
      where: {
        sectionId,
        day: day.toUpperCase() as any,
      },
      include: {
        subject: { select: { name: true, code: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { period: "asc" },
    });
 
    const normalizedSchedule = normalizeTimetable(timetableRows, day);
 
    return res.status(200).json({
      success: true,
      data: normalizedSchedule,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch section timetable.",
      error: error.message,
    });
  }
};

export const getWeeklyTimetableBySection = async (
  req: Request,
  res: Response
) => {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: sectionId parameter is required."
      });
    }

    const sectionMetadata = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        academicClass: {
          select: { name: true }
        }
      }
    });

    if (!sectionMetadata) {
      return res.status(404).json({
        success: false,
        message: "Section not found."
      });
    }

    const sectionLabel = `${sectionMetadata.academicClass.name} - ${sectionMetadata.name}`;

    const weeklySchedule = await prisma.timetable.findMany({
      where: {
        sectionId
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: [
        { day: "asc" },
        { startTime: "asc" }
      ]
    });

    const formattedSchedule = weeklySchedule.map((entry) => ({
      ...entry,
      displayTeacherName: entry.teacher
        ? `${entry.teacher.firstName} ${entry.teacher.lastName}`.trim()
        : "Unassigned"
    }));

    return res.status(200).json({
      success: true,
      sectionLabel,
      count: formattedSchedule.length,
      data: formattedSchedule
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve the weekly timetable.",
      error: error.message
    });
  }
};

export const getDailyTeacherTimetable = async (
  req: Request,
  res: Response
) => {
  try {
    // Grab the IDs straight from the route params and query
    const { teacherId } = req.params;
    const { day } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID parameter is required.",
      });
    }

    if (!day || typeof day !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid day parameter is required.",
      });
    }

    const formattedDay = day.toUpperCase() as any;

    // Fetch strictly the actual classes this teacher is taking today
    const teacherPeriods = await prisma.timetable.findMany({
      where: {
        teacherId: teacherId, 
        day: formattedDay,
        isBreak: false,       
      },
      include: {
        subject: { select: { name: true, code: true } },
        section: {
          select: {
            name: true,
            academicClass: { select: { name: true } },
          },
        },
      },
      // Sort chronologically by start time
      orderBy: { startTime: "asc" },
    });

    const formattedSchedule = teacherPeriods.map((row) => ({
      id: row.id,
      time: row.startTime,
      endTime: row.endTime,
      period: row.period,
      isActive: isCurrentPeriodActive(row.startTime, row.endTime, day), // Assumes you have this helper imported
      room: row.room || "Campus Hall",
      color: row.color || null,
      subject: row.subject?.name || "Unknown Subject",
      sectionLabel: row.section 
        ? `${row.section.academicClass.name} - ${row.section.name}` 
        : "Unassigned",
      duration: getDuration(row.startTime, row.endTime), 
    }));

    return res.status(200).json({ 
      success: true, 
      count: formattedSchedule.length,
      data: formattedSchedule 
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch daily teacher timetable.",
      error: error.message,
    });
  }
};

export const getWeeklyTeacherTimetable = async (req: Request, res: Response) => {
  try {
    // 1. Grab the exact Teacher Profile ID from the URL
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID parameter is required.",
      });
    }

    // 2. Fetch strictly the actual classes this teacher is taking for the entire week
    const weeklyPeriods = await prisma.timetable.findMany({
      where: {
        teacherId: teacherId, 
        isBreak: false,       // ✅ Completely ignoring school breaks
      },
      include: {
        subject: { select: { name: true, code: true } },
        section: {
          select: {
            name: true,
            academicClass: { select: { name: true } },
          },
        },
      },
      orderBy: [
        { day: "asc" },
        { startTime: "asc" }
      ],
    });

    // Exit early if the schedule is empty
    if (weeklyPeriods.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    // 3. Clean up the payload for the frontend
    const formattedSchedule = weeklyPeriods.map((row) => ({
      id: row.id,
      day: row.day,
      period: row.period,
      time: row.startTime,
      endTime: row.endTime,
      room: row.room || "Campus Hall",
      color: row.color || null,
      subject: row.subject?.name || "Unknown Subject",
      code: row.subject?.code || "N/A",
      sectionLabel: row.section 
        ? `${row.section.academicClass.name} - ${row.section.name}` 
        : "Unassigned",
    }));

    return res.status(200).json({ 
      success: true, 
      count: formattedSchedule.length,
      data: formattedSchedule 
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly teacher timetable.",
      error: error.message,
    });
  }
};