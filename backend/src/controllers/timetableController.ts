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

    // Resolve teacherId (Teacher.id) to User.id for database storage
    let targetUserId = null;
    if (!treatAsBreak && teacherId) {
      const teacherProfile = await prisma.teacher.findFirst({
        where: {
          OR: [
            { id: teacherId },
            { userId: teacherId }
          ]
        }
      });
      targetUserId = teacherProfile ? teacherProfile.userId : teacherId;
    }

    if (!treatAsBreak && targetUserId) {
      const teacherConflict = await prisma.timetable.findFirst({
        where: { 
          day: formattedDay as any, 
          period: periodNumber, 
          teacherId: targetUserId 
        }
      });
      if (teacherConflict) {
        return res.status(400).json({ 
          success: false, 
          message: "Teacher is already assigned to another section at this time." 
        });
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

    // Create database entry with User.id for teacherId
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
        teacherId: treatAsBreak ? null : targetUserId
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

        // Resolve teacherId (Teacher.id) to User.id for database storage
        let targetUserId = null;
        if (!treatAsBreak && teacherId) {
          const teacherProfile = await tx.teacher.findFirst({
            where: {
              OR: [
                { id: teacherId },
                { userId: teacherId }
              ]
            }
          });
          targetUserId = teacherProfile ? teacherProfile.userId : teacherId;
        }

        // 1. Conflict check for Teacher (Skip if it's a structural break)
        if (!treatAsBreak && targetUserId) {
          const teacherConflict = await tx.timetable.findFirst({
            where: {
              day: formattedDay as any,
              period: periodNumber,
              teacherId: targetUserId
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
            teacherId: treatAsBreak ? null : targetUserId
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
    const sectionId = req.params.sectionId as string;
    const day = req.query.day as string;
 
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
      },
      orderBy: { period: "asc" },
    });
 
    // Manually resolve teacher profiles since teacherId stores User.id in the DB
    const resolvedRows = [];
    for (const row of timetableRows) {
      let resolvedTeacher = null;
      if (row.teacherId) {
        resolvedTeacher = await prisma.teacher.findUnique({
  where: { id: row.teacherId },  
  select: { id: true, firstName: true, lastName: true }
});
      }
      resolvedRows.push({
        ...row,
        teacher: resolvedTeacher
      });
    }

    const normalizedSchedule = normalizeTimetable(resolvedRows, day);
 
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
    const sectionId = req.params.sectionId as string;

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

    let weeklySchedule = await prisma.timetable.findMany({
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

    // Auto-initialize default periods as placeholders if database is empty for this section
    if (weeklySchedule.length === 0) {
      const defaultPeriods = [
        { period: 1, startTime: "08:00", endTime: "08:45" },
        { period: 2, startTime: "08:45", endTime: "09:30" },
        { period: 3, startTime: "09:30", endTime: "10:15" },
        { period: 4, startTime: "10:30", endTime: "11:15" },
        { period: 5, startTime: "11:15", endTime: "12:00" },
        { period: 6, startTime: "12:00", endTime: "12:45" },
        { period: 7, startTime: "01:15", endTime: "02:00" },
        { period: 8, startTime: "02:00", endTime: "02:45" }
      ];

      await prisma.$transaction(
        defaultPeriods.map(dp => 
          prisma.timetable.create({
            data: {
              sectionId,
              day: "MONDAY",
              period: dp.period,
              startTime: dp.startTime,
              endTime: dp.endTime,
              isBreak: false,
              subjectId: null,
              teacherId: null
            }
          })
        )
      );

      // Re-fetch
      weeklySchedule = await prisma.timetable.findMany({
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
    }

    // Resolve teacher profiles manually since teacherId stores User.id in the DB
    const formattedSchedule = [];
    for (const entry of weeklySchedule) {
      let displayTeacherName = "Unassigned";
      let resolvedTeacherId = entry.teacherId;

      if (entry.teacherId) {
       const tProfile = await prisma.teacher.findUnique({
  where: { id: entry.teacherId }  // ← Teacher.id, not userId
});
        if (tProfile) {
          displayTeacherName = `${tProfile.firstName} ${tProfile.lastName}`.trim();
          resolvedTeacherId = tProfile.id; // Return Teacher.id for the frontend select dropdown
        }
      }

      formattedSchedule.push({
        ...entry,
        teacherId: resolvedTeacherId,
        displayTeacherName
      });
    }

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
    const teacherId = req.params.teacherId as string;
    const day = req.query.day as string;

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

    // Resolve teacher profile to get User.id for database query
    const teacherProfile = await prisma.teacher.findFirst({
      where: {
        OR: [
          { id: teacherId },
          { userId: teacherId }
        ]
      }
    });
    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found."
      });
    }
   

    const filter = req.query.filter as string | undefined;

    // Fetch strictly the actual classes this teacher is taking today
    const whereClause: any = {
     teacherId: teacherId, 
      day: formattedDay,
      isBreak: false,
    };

    if (filter === "mySubject") {
      // Fetch strictly the subjects assigned to this teacher in their profile (TeacherSectionSubject)
      const assignments = await prisma.teacherSectionSubject.findMany({
        where: { teacherId: teacherProfile.id },
        select: { subject: { select: { name: true } } }
      });
      const assignedSubjectNames = Array.from(new Set(assignments.map((a) => a.subject?.name).filter(Boolean)));

      // Find all subject IDs matching those names
      const matchingSubjects = await prisma.subject.findMany({
        where: { name: { in: assignedSubjectNames as string[] } },
        select: { id: true }
      });
      const assignedSubjectIds = matchingSubjects.map((s) => s.id);
      whereClause.subjectId = { in: assignedSubjectIds };
    }

    // Fetch strictly the actual classes this teacher is taking today
    const teacherPeriods = await prisma.timetable.findMany({
      where: whereClause,
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
      room: row.room || null,
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
    const teacherId = req.params.teacherId as string;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID parameter is required.",
      });
    }

    // Resolve teacher profile to get User.id for database query
    const teacherProfile = await prisma.teacher.findFirst({
      where: {
        OR: [
          { id: teacherId },
          { userId: teacherId }
        ]
      }
    });
    if (!teacherProfile) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found."
      });
    }

    const filter = req.query.filter as string | undefined;

    const whereClause: any = {
      teacherId: teacherId, 
      isBreak: false,       // ✅ Completely ignoring school breaks
    };

    if (filter === "mySubject") {
      // Fetch strictly the subjects assigned to this teacher in their profile (TeacherSectionSubject)
      const assignments = await prisma.teacherSectionSubject.findMany({
        where: { teacherId: teacherProfile.id },
        select: { subject: { select: { name: true } } }
      });
      const assignedSubjectNames = Array.from(new Set(assignments.map((a) => a.subject?.name).filter(Boolean)));

      // Find all subject IDs matching those names
      const matchingSubjects = await prisma.subject.findMany({
        where: { name: { in: assignedSubjectNames as string[] } },
        select: { id: true }
      });
      const assignedSubjectIds = matchingSubjects.map((s) => s.id);
      whereClause.subjectId = { in: assignedSubjectIds };
    }

    // 2. Fetch strictly the actual classes this teacher is taking for the entire week
    const weeklyPeriods = await prisma.timetable.findMany({
      where: whereClause,
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
      room: row.room || null,
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

export const updateTimetableEntry = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      startTime,
      endTime,
      room,
      color,
      isBreak,
      breakLabel,
      subjectId,
      teacherId
    } = req.body;

    const existingEntry = await prisma.timetable.findUnique({
      where: { id }
    });

    if (!existingEntry) {
      return res.status(404).json({ success: false, message: "Timetable entry not found." });
    }

    const treatAsBreak = isBreak !== undefined ? Boolean(isBreak) : existingEntry.isBreak;

    // Resolve teacherId (Teacher.id) to User.id for database storage
    let targetUserId = null;
    if (!treatAsBreak && teacherId) {
      const teacherProfile = await prisma.teacher.findFirst({
        where: {
          OR: [
            { id: teacherId },
            { userId: teacherId }
          ]
        }
      });
      targetUserId = teacherProfile ? teacherProfile.userId : teacherId;
    } else if (!treatAsBreak) {
      targetUserId = existingEntry.teacherId;
    }

    // Check teacher conflict if teacherId is changed and is not a break
    if (!treatAsBreak && targetUserId) {
      const teacherConflict = await prisma.timetable.findFirst({
        where: {
          day: existingEntry.day,
          period: existingEntry.period,
          teacherId: targetUserId,
          id: { not: id } // exclude current entry
        }
      });
      if (teacherConflict) {
        return res.status(400).json({
          success: false,
          message: "Teacher is already assigned to another section at this time."
        });
      }
    }

    const updatedEntry = await prisma.timetable.update({
      where: { id },
      data: {
        startTime: startTime !== undefined ? startTime : existingEntry.startTime,
        endTime: endTime !== undefined ? endTime : existingEntry.endTime,
        room: room !== undefined ? (room || null) : existingEntry.room,
        color: color !== undefined ? (color || null) : existingEntry.color,
        isBreak: treatAsBreak,
        breakLabel: treatAsBreak ? (breakLabel || "Recess") : null,
        subjectId: treatAsBreak ? null : (subjectId !== undefined ? subjectId : existingEntry.subjectId),
        teacherId: treatAsBreak ? null : (teacherId !== undefined ? targetUserId : existingEntry.teacherId)
      }
    });

    return res.status(200).json({ success: true, data: updatedEntry });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating timetable entry",
      error: error.message
    });
  }
};

export const deleteTimetableEntry = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingEntry = await prisma.timetable.findUnique({
      where: { id }
    });

    if (!existingEntry) {
      return res.status(404).json({ success: false, message: "Timetable entry not found." });
    }

    // Check if this is the only record for this section and period
    const peerRecordsCount = await prisma.timetable.count({
      where: {
        sectionId: existingEntry.sectionId,
        period: existingEntry.period
      }
    });

    if (peerRecordsCount <= 1) {
      // Last record. Convert to placeholder instead of deleting to keep the period row in grid.
      await prisma.timetable.update({
        where: { id },
        data: {
          isBreak: false,
          breakLabel: null,
          subjectId: null,
          teacherId: null,
          room: null,
          color: null
        }
      });
      return res.status(200).json({ success: true, message: "Timetable entry cleared (period preserved)." });
    } else {
      await prisma.timetable.delete({
        where: { id }
      });
      return res.status(200).json({ success: true, message: "Timetable entry deleted successfully." });
    }

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error deleting timetable entry",
      error: error.message
    });
  }
};

export const updateSectionPeriods = async (req: Request, res: Response) => {
  try {
    const sectionId = req.params.sectionId as string;
    const { periods } = req.body; // array of { originalPeriod?: number, period: number, startTime: string, endTime: string }

    if (!sectionId) {
      return res.status(400).json({ success: false, message: "sectionId parameter is required." });
    }
    if (!periods || !Array.isArray(periods)) {
      return res.status(400).json({ success: false, message: "periods array is required." });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Fetch all existing records for this section
      const existingRecords = await tx.timetable.findMany({
        where: { sectionId }
      });

      // 2. Delete all existing records for this section to avoid unique constraint violations during update
      if (existingRecords.length > 0) {
        await tx.timetable.deleteMany({
          where: { sectionId }
        });
      }

      // 3. Re-create entries based on the new ordered period configuration
      for (const p of periods) {
        // Find existing records that belonged to this period's original number
        const matchedRecords = p.originalPeriod 
          ? existingRecords.filter(r => r.period === p.originalPeriod)
          : [];

        if (matchedRecords.length > 0) {
          // Recreate matching records with the updated period number and timing
          for (const rec of matchedRecords) {
            await tx.timetable.create({
              data: {
                sectionId,
                day: rec.day,
                period: p.period,
                startTime: p.startTime,
                endTime: p.endTime,
                isBreak: rec.isBreak,
                breakLabel: rec.breakLabel,
                subjectId: rec.subjectId,
                teacherId: rec.teacherId,
                room: rec.room,
                color: rec.color
              }
            });
          }
        } else {
          // No original records matched this period. Create a placeholder record on Monday
          await tx.timetable.create({
            data: {
              sectionId,
              day: "MONDAY",
              period: p.period,
              startTime: p.startTime,
              endTime: p.endTime,
              isBreak: false,
              subjectId: null,
              teacherId: null
            }
          });
        }
      }
    });

    return res.status(200).json({ success: true, message: "Periods updated and reordered successfully." });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update and reorder periods.",
      error: error.message
    });
  }
};