import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { logActivity } from '../lib/auditService.js';
import { normalizeTimetable } from '../helper/timetableHelper.js';
import { isCurrentPeriodActive , getDuration } from '../helper/activePeriod.helper.js'; 

export const createAcademicYear = async (req: any, res: Response) => {
  try {
    const { name, isCurrent } = req.body;

    // 1. If this is set to current, unset any other current year
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    // 2. Create the new year
    const newYear = await prisma.academicYear.create({
      data: { name, isCurrent: isCurrent || false },
    });

    // 3. Log the action (Module 2 integration!)
    logActivity(req.user.id, 'CREATE', 'AcademicYear', newYear.id, null, newYear);

    res.status(201).json({
      success: true,
      data: newYear
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating academic year", error });
  }
};

export const getAcademicYears = async (req: Request, res: Response) => {
  const years = await prisma.academicYear.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(years);
};

// Create a Class
export const createClass = async (req: any, res: Response) => {
  try {
    const { name, academicYearId } = req.body;

    const newClass = await prisma.class.create({
      data: { name, academicYearId },
    });

    logActivity(req.user.id, 'CREATE', 'Class', newClass.id, null, newClass);

    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    res.status(500).json({ message: "Error creating class", error });
  }
};

// Create a Section linked to a Class
export const createSection = async (req: any, res: Response) => {
  try {
    const { name, classId } = req.body;

    const newSection = await prisma.section.create({
      data: { name, classId },
    });

    logActivity(req.user.id, 'CREATE', 'Section', newSection.id, null, newSection);

    res.status(201).json({ success: true, data: newSection });
  } catch (error) {
    res.status(500).json({ message: "Error creating section", error });
  }
};

export const createSubject = async (req: any, res: Response) => {
  try {
    const { name, code, classId ,icon  } = req.body;

    // 1. Check if the class exists first
    const parentClass = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!parentClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    // 2. Create the Subject
    const newSubject = await prisma.subject.create({
      data: { 
        name, 
        code: code.toUpperCase(), // Standardize codes like 'MATH101'
        classId ,
        icon: icon || null // Optional field for subject icon
      },
    });

    // 3. Log the action
    logActivity(req.user.id, 'CREATE', 'Subject', newSubject.id, null, newSubject);

    res.status(201).json({
      success: true,
      data: newSubject
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating subject", error });
  }
};

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

export const getWeeklyTimetableBySection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    // 1. Validation check
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: sectionId parameter is required."
      });
    }

    // 2. Query all rows matching the section with relational data joined
    const weeklySchedule = await prisma.timetable.findMany({
      where: {
        sectionId: sectionId
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
            name: true
          }
        }
      },
      // Chronological sort by day and start time to keep output clean
      orderBy: [
        { day: "asc" },
        { startTime: "asc" }
      ]
    });

    // 3. Return the unified array payload
    return res.status(200).json({
      success: true,
      count: weeklySchedule.length,
      data: weeklySchedule
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve the weekly timetable.",
      error: error.message
    });
  }
};

export const getStudentTimetable = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { day } = req.query;
    if ( !day || typeof day !== 'string'){
      return res.status(400).json({
        success: false,
        message:
          'Valid day parameter is required.'
      });
    }

    if (day.trim().toLowerCase() === 'sunday') {
      return res.status(200).json({
        success: true,
        message: 'Today is Sunday',
        data: [] 
      });
    }
    const studentProfile =
      await prisma.student.findUnique({
        where: {
          userId
        },
        select: {
          sectionId: true
        }
      });
    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message:
          'Student profile not found.'
      });
    }

    if (!studentProfile.sectionId) {
      return res.status(400).json({
        success: false,
        message:
          'Student is not assigned to any section.'
      });
    }

    const timetableRows = await prisma.timetable.findMany({
        where: {
          sectionId:
            studentProfile.sectionId,
          day:
            day.toUpperCase() as any
        },
        include: {
          subject: {
            select: {
              name: true
            }
          },
          teacher: {
            select: {
              name: true,
            }
          }
        },
        orderBy: {
          period: 'asc'
        }
      });

    // Normalize response
    const normalizedSchedule =
      normalizeTimetable(
        timetableRows,
        day
      );
    return res.status(200).json({
      success: true,
      data: normalizedSchedule
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch timetable.',
      error: error.message
    });
  }
};

export const getTeacherMySubjectTimetable = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { day } = req.query;
 
    if (!day || typeof day !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid day parameter is required.",
      });
    }
 
    const formattedDay = day.toUpperCase() as any;
 
    // 1. Fetch teacher's own periods for the day
    const teacherPeriods = await prisma.timetable.findMany({
      where: {
        teacherId: userId,
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
      orderBy: { period: "asc" },
    });
 
    if (teacherPeriods.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
 
    // 2. Get the sectionId from the first result to fetch breaks
    // All periods for one teacher are likely in the same section
    // Use distinct startTimes to avoid duplicate breaks if multi-section
   if (teacherPeriods.length === 0) {
  return res.status(200).json({ success: true, data: [] });
}

const sectionId = teacherPeriods[0].sectionId; // safe — length checked above

const breakRows = await prisma.timetable.findMany({
  where: {
    sectionId: sectionId, // now TypeScript knows it's a string
    day: formattedDay,
    isBreak: true,
  },
  orderBy: { period: "asc" },
});
    // 3. Normalize teacher periods
    const normalizedPeriods = teacherPeriods.map((row) => ({
      id: row.id,
      time: row.startTime,
      isActive: isCurrentPeriodActive(row.startTime, row.endTime, day),
      isBreak: false,
      breakLabel: null,
      room: row.room || "Campus Hall",
      color: row.color || null,
      subject: `${row.section.academicClass.name} - ${row.section.name}`,
      professor: row.subject?.name || "No Subject",
      duration: getDuration(row.startTime, row.endTime),
      _sortTime: row.startTime, // internal sort key
    }));
 
    // 4. Normalize break rows
    const normalizedBreaks = breakRows.map((row) => ({
      id: row.id,
      time: row.startTime,
      isActive: false,
      isBreak: true,
      breakLabel: row.breakLabel || "Institutional Break",
      room: null,
      color: null,
      subject: null,
      professor: null,
      duration: undefined,
      _sortTime: row.startTime,
    }));
 
    // 5. Merge and sort chronologically by startTime
    const merged = [...normalizedPeriods, ...normalizedBreaks].sort((a, b) =>
      a._sortTime.localeCompare(b._sortTime)
    );
 
    // 6. Strip internal sort key before sending
    const response = merged.map(({ _sortTime, ...rest }) => rest);
 
    return res.status(200).json({ success: true, data: response });
 
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teacher timetable.",
      error: error.message,
    });
  }
};
 

export const getTeacherMySubjectWeekly = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    // Fetch ALL days at once for the weekly grid — no day filter
    const timetableRows = await prisma.timetable.findMany({
      where: {
        teacherId: userId,
        isBreak: false,
      },
      include: {
        subject: {
          select: {
            name: true,
            code: true,
          },
        },
        section: {
          select: {
            name: true,
            academicClass: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { day: "asc" },
        { period: "asc" },
      ],
    });

    if (timetableRows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const normalized = timetableRows.map((row) => ({
      id: row.id,
      day: row.day,                          // "MONDAY", "TUESDAY" etc.
      startTime: row.startTime,              // "10:00"
      isBreak: false,
      // code = subject name (e.g. "ENGLISH") — shown as label on weekly card
      code: row.subject?.name?.toUpperCase() || "N/A",
      // subject = class + section name (e.g. "Class 10 - Section A")
      subject: `${row.section.academicClass.name} - ${row.section.name}`,
      teacher: "",                           // own schedule — not needed
      room: row.room || "TBD",
      color: row.color || "BLUE",
    }));

    return res.status(200).json({ success: true, data: normalized });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly teacher timetable.",
      error: error.message,
    });
  }
};