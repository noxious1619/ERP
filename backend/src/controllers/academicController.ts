import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { logActivity } from '../lib/auditService.js';
import { normalizeTimetable } from '../helper/timetableHelper.js';
import { isCurrentPeriodActive, getDuration } from '../helper/activePeriod.helper.js';

export const createAcademicYear = async (req: any, res: Response) => {
  try {
    const { name, isCurrent } = req.body;

    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const newYear = await prisma.academicYear.create({
      data: { name, isCurrent: isCurrent || false },
    });

    logActivity(req.user.id, 'CREATE', 'AcademicYear', newYear.id, null, newYear);

    res.status(201).json({ success: true, data: newYear });
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
export const createSection = async (req: any, res: Response) => {
  try {
    const { name, classId, capacity, homeRoom, classTeacherId } = req.body;

    const newSection = await prisma.section.create({
      data: {
        name,
        classId,
        capacity: capacity ? Number(capacity) : 50,
        homeRoom: homeRoom || null,
        classTeacherId: classTeacherId || null
      },
    });

    logActivity(req.user.id, 'CREATE', 'Section', newSection.id, null, newSection);

    res.status(201).json({ success: true, data: newSection });
  } catch (error) {
    res.status(500).json({ message: "Error creating section", error });
  }
};
export const createSubject = async (req: any, res: Response) => {
  try {
    const { name, code, classId, icon } = req.body;

    const parentClass = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!parentClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        code: code.toUpperCase(),
        classId,
        icon: icon || null
      },
    });

    logActivity(req.user.id, 'CREATE', 'Subject', newSubject.id, null, newSubject);

    res.status(201).json({ success: true, data: newSubject });
  } catch (error) {
    res.status(500).json({ message: "Error creating subject", error });
  }
};

export const createTimetableEntry = async (req: Request, res: Response) => {
  try {
    const {
      day, period, startTime, endTime, room, color,
      isBreak, breakLabel, sectionId, subjectId, teacherId
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

    const result = await prisma.$transaction(async (tx) => {
      const createdEntries = [];

      for (const entry of entries) {
        const {
          day, period, startTime, endTime, room, color,
          isBreak, breakLabel, sectionId, subjectId, teacherId
        } = entry;

        const formattedDay = day.toUpperCase();
        const periodNumber = Number(period);
        const treatAsBreak = Boolean(isBreak);

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
    const sectionIdStr = sectionId as string;

    if (!sectionIdStr) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: sectionId parameter is required."
      });
    }

   const weeklySchedule = await prisma.timetable.findMany({
  where: { sectionId: sectionIdStr },
  include: {
    subject: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
    teacher: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    },
  },
  orderBy: [
    { day: "asc" },
    { startTime: "asc" },
  ],
});

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

export const getStudentTimetable = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { day } = req.query;

    if (!day || typeof day !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid day parameter is required.'
      });
    }

    if (day.trim().toLowerCase() === 'sunday') {
      return res.status(200).json({ success: true, message: 'Today is Sunday', data: [] });
    }

    const studentProfile = await prisma.student.findUnique({
      where: { userId },
      select: { sectionId: true }
    });

    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    if (!studentProfile.sectionId) {
      return res.status(400).json({ success: false, message: 'Student is not assigned to any section.' });
    }

    const timetableRows = await prisma.timetable.findMany({
  where: {
    sectionId: studentProfile.sectionId,
    day: day.toUpperCase() as any
  },
  include: {
    subject: { select: { name: true } },
    teacher: { select: { firstName: true, lastName: true } }
  },
  orderBy: { period: 'asc' }
});

    const normalizedSchedule = normalizeTimetable(timetableRows, day);

    return res.status(200).json({ success: true, data: normalizedSchedule });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable.',
      error: error.message
    });
  }
};

export const getTeacherMySubjectTimetable = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { day } = req.query;

    if (!day || typeof day !== "string") {
      return res.status(400).json({ success: false, message: "Valid day parameter is required." });
    }

    const formattedDay = day.toUpperCase() as any;

    const teacherPeriods = await prisma.timetable.findMany({
      where: { teacherId: userId, day: formattedDay, isBreak: false },
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

    const breakRows = await prisma.timetable.findMany({
      where: { day: formattedDay, isBreak: true },
      distinct: ['startTime'],
      orderBy: { period: 'asc' },
    });

    const normalizedPeriods = teacherPeriods.map((row) => ({
      id:         row.id,
      time:       row.startTime,
      isActive:   isCurrentPeriodActive(row.startTime, row.endTime, day),
      isBreak:    false,
      breakLabel: null,
      room:       row.room || "Campus Hall",
      color:      row.color || null,
      subject:    `${row.section.academicClass.name} - ${row.section.name}`,
      professor:  row.subject?.name || "No Subject",
      duration:   getDuration(row.startTime, row.endTime),
      _sortTime:  row.startTime,
    }));

    const normalizedBreaks = breakRows.map((row) => ({
      id:         row.id,
      time:       row.startTime,
      isActive:   false,
      isBreak:    true,
      breakLabel: row.breakLabel || "Institutional Break",
      room:       null,
      color:      null,
      subject:    null,
      professor:  null,
      duration:   undefined,
      _sortTime:  row.startTime,
    }));

    const merged = [...normalizedPeriods, ...normalizedBreaks]
      .sort((a, b) => a._sortTime.localeCompare(b._sortTime));

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

export const getTeacherMySubjectWeekly = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const timetableRows = await prisma.timetable.findMany({
      where: { teacherId: userId, isBreak: false },
      include: {
        subject: { select: { name: true, code: true } },
        section: {
          select: {
            name: true,
            academicClass: { select: { name: true } },
          },
        },
      },
      orderBy: [{ day: "asc" }, { period: "asc" }],
    });

    if (timetableRows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const breakRows = await prisma.timetable.findMany({
      where: { isBreak: true },
      distinct: ["startTime", "day"],
      orderBy: [{ day: "asc" }, { period: "asc" }],
    });

    const normalizedPeriods = timetableRows.map((row) => ({
      id:        row.id,
      day:       row.day,
      startTime: row.startTime,
      isBreak:   false,
      code:      row.subject?.name?.toUpperCase() || "N/A",
      subject:   `${row.section.academicClass.name} - ${row.section.name}`,
      teacher:   "",
      room:      row.room || "TBD",
      color:     row.color || "BLUE",
    }));

    const normalizedBreaks = breakRows.map((row) => ({
      id:         row.id,
      day:        row.day,
      startTime:  row.startTime,
      isBreak:    true,
      breakLabel: row.breakLabel || "Break",
      code:       "",
      subject:    row.breakLabel || "Break",
      teacher:    "",
      room:       "",
      color:      "",
    }));

    const merged = [...normalizedPeriods, ...normalizedBreaks];

    return res.status(200).json({ success: true, data: merged });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly teacher timetable.",
      error: error.message,
    });
  }
};

export const getDailyTimetableBySection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { day } = req.query;
    const sectionIdStr = sectionId as string;

    if (!sectionIdStr) {
      return res.status(400).json({ success: false, message: "sectionId is required." });
    }

    if (!day || typeof day !== "string") {
      return res.status(400).json({ success: false, message: "Valid day parameter is required." });
    }

    if (day.trim().toLowerCase() === "sunday") {
      return res.status(200).json({ success: true, data: [] });
    }

   const timetableRows = await prisma.timetable.findMany({
  where: {
   sectionId: sectionIdStr,
    day: day.toUpperCase() as any,
  },
  include: {
    subject: {
      select: {
        name: true,
        code: true,
      },
    },
    teacher: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
  },
  orderBy: {
    period: "asc",
  },
});

    const normalizedSchedule = normalizeTimetable(timetableRows, day);

    return res.status(200).json({ success: true, data: normalizedSchedule });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch section timetable.",
      error: error.message,
    });
  }
};

export const getClassesByYear = async (req: Request, res: Response) => {
  try {
    let { yearId } = req.query;

    if (!yearId) {
      const currentYear = await prisma.academicYear.findFirst({
        where: { isCurrent: true },
      });

      if (!currentYear) {
        return res.status(404).json({
          success: false,
          message: "No current academic year found.",
        });
      }

      yearId = currentYear.id;
    }

    const classes = await prisma.class.findMany({
      where: {
        academicYearId: yearId as string,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch classes.",
      error: error.message,
    });
  }
};

export const getSectionsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;

    if (!classId || typeof classId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'classId query parameter is required.'
      });
    }

    const sections = await prisma.section.findMany({
      where: { classId },
      include: {
        academicClass: { select: { id: true, name: true } },
        classTeacher:  { select: { id: true, firstName: true, lastName: true } },
        _count:        { select: { students: true } }
      },
      orderBy: { name: 'asc' }
    });

    const shaped = sections.map(section => ({
      id:               section.id,
      name:             section.name,
      classId:          section.classId,
      className:        section.academicClass.name,
      capacity:         section.capacity,
      homeRoom:         section.homeRoom,
      classTeacherId:   section.classTeacher?.id ?? null,
      classTeacherName: section.classTeacher
        ? `${section.classTeacher.firstName} ${section.classTeacher.lastName}`
        : "Not Assigned",
      studentCount: section._count.students
    }));

    return res.status(200).json({ success: true, data: shaped });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sections.',
      error: error.message
    });
  }
};

export const updateSection = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, homeRoom, capacity, classTeacherId } = req.body;

    const existing = await prisma.section.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }

    const updated = await prisma.section.update({
      where: { id },
      data: {
        ...(name           !== undefined && { name }),
        ...(homeRoom        !== undefined && { homeRoom: homeRoom || null }),
        ...(capacity        !== undefined && { capacity: Number(capacity) }),
        ...(classTeacherId  !== undefined && { classTeacherId: classTeacherId || null }),
      }
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const section = await prisma.section.findUnique({
      where: { id },
      include: { _count: { select: { students: true } } }
    });

    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found." });
    }

    if (section._count.students > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete section. ${section._count.students} student(s) are enrolled. Please reassign them first.`
      });
    }

    await prisma.section.delete({ where: { id } });

    return res.status(200).json({ success: true, message: "Section deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        sections:             { include: { _count: { select: { students: true } } } },
        subjects:             { select: { id: true } },
        scheduledExams:       { select: { id: true } },
        assignments:          { select: { id: true } },
        assessmentComponents: { select: { id: true } },
        feeComponents:        { select: { id: true } }
      }
    });

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    const totalStudents  = cls.sections.reduce((sum, s) => sum + s._count.students, 0);
    const hasSubjects    = cls.subjects.length > 0;
    const hasExams       = cls.scheduledExams.length > 0;
    const hasAssignments = cls.assignments.length > 0;
    const hasFeeComponents = cls.feeComponents.length > 0;

    const reasons: string[] = [];
    if (totalStudents  > 0) reasons.push(`${totalStudents} enrolled student(s)`);
    if (hasSubjects)        reasons.push(`${cls.subjects.length} subject(s)`);
    if (hasExams)           reasons.push(`${cls.scheduledExams.length} scheduled exam(s)`);
    if (hasAssignments)     reasons.push(`${cls.assignments.length} assignment(s)`);
    if (hasFeeComponents)   reasons.push(`${cls.feeComponents.length} fee component(s)`);

    if (reasons.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${cls.name}". It has ${reasons.join(", ")}. Please clear all data first.`
      });
    }

    await prisma.class.delete({ where: { id } });

    return res.status(200).json({ success: true, message: "Class deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query as { classId?: string };

    const subjects = await prisma.subject.findMany({
      ...(classId ? { where: { classId } } : {}),
      include: {
        class: { select: { id: true, name: true } },
      },
      orderBy: { name: "asc" },
    });

    const shaped = subjects.map(subject => ({
      id:        subject.id,
      name:      subject.name,
      code:      subject.code,
      classId:   subject.classId,
      className: subject.class.name,
    }));

    return res.status(200).json({ success: true, data: shaped });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects.",
      error: error.message,
    });
  }
};