import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const markBulkAttendance = async (req: Request, res: Response) => {
  try {
    const { sectionId, date, students } = req.body; 
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }
    const markedById = user.id;

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const result = await prisma.$transaction(
      students.map((s: any) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: s.studentId,
              date: attendanceDate,
            },
          },
          update: {
            status: s.status,
            markedById,
          },
          create: {
            studentId: s.studentId,
            date: attendanceDate,
            status: s.status,
            sectionId,
            markedById,
          },
        })
      )
    );

    res.status(200).json({
      success: true,
      message: `Attendance marked for ${result.length} students`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSectionAttendance = async (req: Request, res: Response) => {
  try {
    const { sectionId, date } = req.query;

    if (!sectionId || !date) {
      return res.status(400).json({ success: false, message: "sectionId and date are required" });
    }

    const attendanceDate = new Date(date as string);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const sectionInfo = await prisma.section.findUnique({
      where: { id: sectionId as string },
      include: {
        students: {
          select: {
            id: true,
            firstName: true, 
            lastName: true,  
            attendance: {
              where: { date: attendanceDate },
              select: { status: true }
            }
          }
        }
      }
    });

    if (!sectionInfo) {
      return res.status(404).json({ success: false, message: "Section record not found" });
    }

    res.status(200).json({
      success: true,
      metadata: {
        sectionName: sectionInfo.name,
        fullClass: sectionInfo.name
      },
      data: sectionInfo.students.map(s => ({
        studentId: s.id,
        name: `${s.firstName} ${s.lastName}`,
        status: s.attendance[0]?.status || null 
      }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDailyAttendance = async (req: Request, res: Response) => {
  try {
    const { sectionId, date } = req.query;

    if (!sectionId || !date) {
      return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    // 🚀 THE FIX: Strip any time/timezone data sent by the frontend
    const targetDateStr = String(date).split('T')[0] as string; // Guarantees strictly "YYYY-MM-DD"
    
    // Build strict UTC boundaries
    const startOfDay = new Date(`${targetDateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${targetDateStr}T23:59:59.999Z`);

    // Get strictly today's date in YYYY-MM-DD format based on server time
    const todayStr = new Date().toLocaleDateString('en-CA', { 
      timeZone: 'Asia/Kolkata' 
    });

    // 🛡️ RULE 1: BLOCK THE FUTURE
    if (targetDateStr > todayStr) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot view or take attendance for future dates." 
      });
    }

    const existingAttendance = await prisma.attendance.findMany({
      where: {
        sectionId: String(sectionId),
        date: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, rollNumber: true, admissionNumber: true }
        }
      },
      orderBy: { student: { rollNumber: 'asc' } }
    });

    // 🛡️ RULE 2: PAST OR TODAY (DATA EXISTS) -> Return the saved receipt
    if (existingAttendance.length > 0) {
      return res.status(200).json({
        success: true,
        isSaved: true, 
        data: existingAttendance,
      });
    }

    // 🛡️ RULE 3: PAST DATE (NO DATA) -> Return empty array (No Ghost Template!)
    if (targetDateStr < todayStr) {
      return res.status(200).json({
        success: true,
        isSaved: true, // Treat as saved/locked so the UI doesn't try to save an empty list
        data: [],      // Empty array triggers the frontend "No Data" screen
      });
    }

    // 🛡️ RULE 4: TODAY (NO DATA) -> Generate the Ghost Template
    const students = await prisma.student.findMany({
      where: { sectionId: String(sectionId), isActive: true },
      orderBy: { rollNumber: 'asc' }
    });

    const ghostAttendance = students.map((student) => ({
      id: `ghost-${student.id}`, 
      date: startOfDay, // Returns the clean UTC midnight string
      status: "PRESENT", 
      studentId: student.id,
      sectionId: String(sectionId),
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        rollNumber: student.rollNumber,
        admissionNumber: student.admissionNumber
      }
    }));

    return res.status(200).json({
      success: true,
      isSaved: false, 
      data: ghostAttendance,
    });

  } catch (error: any) {
    console.error("[getDailyAttendance] Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const saveDailyAttendance = async (req: Request, res: Response) => {
  try {
    const { sectionId, date, attendanceData } = req.body;

    // We assume your auth middleware attaches the user ID
    const markedById = (req as any).user.id; 

    if (!sectionId || !date || !attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payload. Required: sectionId, date, and attendanceData array." 
      });
    }

    // 🚀 THE FIX: Prevent JavaScript from shifting the timezone
    const strictDateStr = String(date).split('T')[0]; // Guarantees "YYYY-MM-DD"
    const cleanUtcDate = new Date(`${strictDateStr}T00:00:00.000Z`);

    // Strict boundaries for wiping the old data safely
    const startOfDay = new Date(`${strictDateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${strictDateStr}T23:59:59.999Z`);

    // 🚀 THE PRISMA TRANSACTION
    await prisma.$transaction(async (tx) => {
      
      // Step 1: Wipe any existing records for this specific section and date.
      await tx.attendance.deleteMany({
        where: {
          sectionId: String(sectionId),
          date: {
            gte: startOfDay,
            lte: endOfDay,
          }
        }
      });

      // Step 2: Map the frontend array using the clean UTC Date
      const newRecords = attendanceData.map((record: any) => ({
        date: cleanUtcDate, // 🚀 Saves directly as T00:00:00.000Z
        status: record.status, 
        studentId: record.studentId,
        sectionId: String(sectionId),
        markedById: markedById
      }));

      // Step 3: Bulk insert the fresh records
      await tx.attendance.createMany({
        data: newRecords
      });
    });

    return res.status(200).json({
      success: true,
      message: "Attendance successfully saved."
    });

  } catch (error: any) {
    console.error("🔥 saveDailyAttendance Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

export const updateStudentYearlyAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, sectionId, attendanceRecords } = req.body; 
    const markedById = (req as any).user.id;

    if (!studentId || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ success: false, message: "Missing studentId or records array" });
    }

    const result = await prisma.$transaction(
      attendanceRecords.map((record: { date: string; status: any }) => {
        const attendanceDate = new Date(record.date);
        attendanceDate.setUTCHours(0, 0, 0, 0);

        return prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId,
              date: attendanceDate,
            },
          },
          update: { status: record.status, markedById },
          create: {
            studentId,
            date: attendanceDate,
            status: record.status,
            sectionId,
            markedById,
          },
        });
      })
    );

    res.status(200).json({
      success: true,
      message: `Updated ${result.length} calendar records for this student.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//total number of days present, total number of days absent, and the overall attendance percentage for that student within the specified year.
export const getStudentAttendancePercentage = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId as string;
    const { year } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required." });
    }

    // Default to current year if not provided
    const targetYear = year ? parseInt(year as string, 10) : new Date().getFullYear();
    
    // Set absolute date boundaries for the targeted calendar year
    const startOfYear = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${targetYear}-12-31T23:59:59.999Z`);

    // Run primitive count lookups in parallel using Promise.all
    const [presentCount, absentCount] = await Promise.all([
      prisma.attendance.count({
        where: {
          studentId,
          status: 'PRESENT',
          date: { gte: startOfYear, lte: endOfYear }
        }
      }),
      prisma.attendance.count({
        where: {
          studentId,
          status: 'ABSENT',
          date: { gte: startOfYear, lte: endOfYear }
        }
      })
    ]);

    const totalDays = presentCount + absentCount;
    
    // Calculate percentage safely to prevent Division-by-Zero errors if it's a new student
    const attendancePercentage = totalDays > 0 
      ? parseFloat(((presentCount / totalDays) * 100).toFixed(1)) 
      : 0;

    return res.status(200).json({
      success: true,
      studentId,
      year: targetYear,
      aggregates: {
        daysPresent: presentCount,
        daysAbsent: absentCount,
        totalTrackedDays: totalDays,
        attendancePercentage
      }
    });

  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to compile attendance aggregates.", 
      error: error.message 
    });
  }
};

//gives a month wise breakdown of attendance of the student
export const getStudentMonthlyTrends = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId as string;
    const { year } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required." });
    }

    const targetYear = year ? parseInt(year as string, 10) : new Date().getFullYear();
    const startOfYear = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${targetYear}-12-31T23:59:59.999Z`);

    const rawAttendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: startOfYear, lte: endOfYear }
      },
      select: {
        date: true,
        status: true
      }
    });

    const monthlyBuckets = Array.from({ length: 12 }, () => ({ present: 0, total: 0 }));
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    rawAttendanceRecords.forEach(record => {
      const monthIndex = new Date(record.date).getUTCMonth();
      const bucket = monthlyBuckets[monthIndex];
      if (bucket) {
        bucket.total += 1;
        if (record.status === 'PRESENT') {
          bucket.present += 1;
        }
      }
    });

    // Construct an array of objects which plays perfectly with charting data states
    const monthlyOverview = monthNames.map((month, index) => {
      const bucket = monthlyBuckets[index]!;
      const percentage = bucket.total > 0 
        ? parseFloat(((bucket.present / bucket.total) * 100).toFixed(1))
        : 0.0;

      return {
        month,
        present: bucket.present,
        totalDays: bucket.total,
        percentage
      };
    });

    return res.status(200).json({
      success: true,
      studentId,
      year: targetYear,
      monthlyOverview
    });

  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to compile monthly hover trends.", 
      error: error.message 
    });
  }
};

//
export const getStudentWeeklyTrends = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId as string;
    const { month, year } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required." });
    }

    // Default to current system month/year if not explicitly sent by frontend
    const currentSystemDate = new Date();
    const targetYear = year ? parseInt(year as string, 10) : currentSystemDate.getFullYear();
    const targetMonth = month ? parseInt(month as string, 10) : (currentSystemDate.getMonth() + 1); // 1-12

    // Establish exact UTC start and end constraints for that single month
    const startOfMonth = new Date(Date.UTC(targetYear, targetMonth - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999));

    // Fetch only the date and status attributes
    const rawMonthlyRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: startOfMonth, lte: endOfMonth }
      },
      select: {
        date: true,
        status: true
      },
      orderBy: { date: 'asc' }
    });

    const weeklyBuckets = [
      { week: "Week 1", present: 0, totalDays: 0 },
      { week: "Week 2", present: 0, totalDays: 0 },
      { week: "Week 3", present: 0, totalDays: 0 },
      { week: "Week 4", present: 0, totalDays: 0 }
    ];

    // Sort records based on day thresholds
    rawMonthlyRecords.forEach(record => {
      const dayOfMonth = new Date(record.date).getUTCDate();

      let bucketIndex = 3; // Defaults to Week 4 for days 22+
      if (dayOfMonth <= 7) bucketIndex = 0;
      else if (dayOfMonth <= 14) bucketIndex = 1;
      else if (dayOfMonth <= 21) bucketIndex = 2;

      const bucket = weeklyBuckets[bucketIndex];
      if (bucket) {
        bucket.totalDays += 1;
        if (record.status === 'PRESENT') {
          bucket.present += 1;
        }
      }
    });

    // Format final collection with computed percentages for backup UI use
    const weeklyTrends = weeklyBuckets.map(b => ({
      ...b,
      percentage: b.totalDays > 0 ? parseFloat(((b.present / b.totalDays) * 100).toFixed(1)) : 0.0
    }));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return res.status(200).json({
      success: true,
      studentId,
      monthName: monthNames[targetMonth - 1],
      year: targetYear,
      weeklyTrends
    });

  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to compile weekly analytics.", 
      error: error.message 
    });
  }
};

export const getStudentHeatmapGrid = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId as string;
    const { year } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required." });
    }

    const targetYear = year ? parseInt(year as string, 10) : new Date().getFullYear();
    const startOfYear = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${targetYear}-12-31T23:59:59.999Z`);

    // Stream only the essential date and status indicators from PostgreSQL
    const rawRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: startOfYear, lte: endOfYear }
      },
      select: {
        date: true,
        status: true
      }
    });

    // Compress the array into an ultra-lean key-value map object
    const heatmapMap: Record<string, 'P' | 'A'> = {};

    rawRecords.forEach(record => {
      // Extract just the clean YYYY-MM-DD part from the date string
      const ISOStringKey = new Date(record.date).toISOString().split('T')[0]!;
      
      // Compress the status string value down to a single character token
      heatmapMap[ISOStringKey] = record.status === 'PRESENT' ? 'P' : 'A';
    });

    return res.status(200).json({
      success: true,
      studentId,
      year: targetYear,
      totalTrackedRecords: rawRecords.length,
      heatmapMap
    });

  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to compile compressed heatmap data matrix.", 
      error: error.message 
    });
  }
};

// 6. GET ADMIN ATTENDANCE SUMMARY
export const getAdminAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const {
      classId,
      sectionId,
      startDate,
      endDate,
      search = "",
      page = "1",
      limit = "6",
    } = req.query;

    const currentPage = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const skip = (currentPage - 1) * pageSize;

    // Build the query date filters
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(`${startDate}T00:00:00.000Z`),
          lte: new Date(`${endDate}T23:59:59.999Z`),
        },
      };
    }

    // Build base where clause for students based on Class and Section
    const studentWhereClause: any = {
      AND: [
        classId
          ? {
              section: {
                classId: String(classId),
              },
            }
          : {},
        sectionId
          ? {
              sectionId: String(sectionId),
            }
          : {},
        search
          ? {
              OR: [
                {
                  firstName: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  rollNumber: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
      ],
    };

    // Get matching students
    const totalStudents = await prisma.student.count({
      where: studentWhereClause,
    });

    const students = await prisma.student.findMany({
      where: studentWhereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rollNumber: true,
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
        attendance: {
          where: dateFilter,
          select: {
            status: true,
          },
        },
      },
      orderBy: [
        { rollNumber: "asc" },
        { firstName: "asc" }
      ],
    });

    // Compute attendance percentage for each student, and gather totals
    const rows = students.map((s) => {
      const attendanceList = s.attendance;
      const totalDays = attendanceList.length;
      const presentCount = attendanceList.filter((a) => a.status === "PRESENT").length;
      const lateCount = attendanceList.filter((a) => a.status === "LATE").length;
      const halfDayCount = attendanceList.filter((a) => a.status === "HALF_DAY").length;
      const activePresent = presentCount + lateCount;
      const percentage = totalDays > 0 ? parseFloat(((activePresent / totalDays) * 100).toFixed(1)) : null;

      return {
        id: s.id,
        rollNumber: s.rollNumber ?? "—",
        name: `${s.firstName} ${s.lastName}`,
        className: s.section?.academicClass?.name ?? "—",
        sectionName: s.section?.name ?? "—",
        percentage, // number or null
      };
    });

    // Compute the global metrics for the active set of students and date range
    const studentIds = students.map(s => s.id);
    const attendanceStatsWhere: any = {
      studentId: { in: studentIds },
      ...dateFilter
    };

    const statusCounts = await prisma.attendance.groupBy({
      by: ['status'],
      where: attendanceStatsWhere,
      _count: {
        status: true
      }
    });

    let totalAbsent = 0;
    let lateEntries = 0;
    let totalPresent = 0;
    let totalHalfDay = 0;

    statusCounts.forEach(sc => {
      if (sc.status === 'PRESENT') {
        totalPresent = sc._count.status;
      } else if (sc.status === 'ABSENT') {
        totalAbsent = sc._count.status;
      } else if (sc.status === 'LATE') {
        lateEntries = sc._count.status;
      } else if (sc.status === 'HALF_DAY') {
        totalHalfDay = sc._count.status;
      }
    });

    const totalAttendanceRecords = totalPresent + totalAbsent + lateEntries + totalHalfDay;
    const attendanceRate = totalAttendanceRecords > 0 
      ? `${Math.round(((totalPresent + lateEntries + totalHalfDay) / totalAttendanceRecords) * 100)}.0%` 
      : "100.0%"; // default if no data

    // Defaulters: count of students in filtered list who have attendance percentage < 75%
    const defaultersCount = rows.filter(r => r.percentage !== null && r.percentage < 75).length;

    // Apply pagination on rows
    const paginatedRows = rows.slice(skip, skip + pageSize);

    // Fetch all sections to do section-wise aggregation for charts
    const sectionWhere: any = {};
    if (classId) {
      sectionWhere.classId = String(classId);
    }
    const allSections = await prisma.section.findMany({
      where: sectionWhere,
      select: {
        id: true,
        name: true,
        academicClass: {
          select: {
            name: true
          }
        }
      }
    });

    // Donut breakdown calculation
    let presentPct = 0;
    let absentPct = 0;
    let latePct = 0;

    if (totalAttendanceRecords > 0) {
      presentPct = Math.round((totalPresent / totalAttendanceRecords) * 100);
      absentPct = Math.round((totalAbsent / totalAttendanceRecords) * 100);
      latePct = 100 - presentPct - absentPct;
    } else {
      presentPct = 100;
    }
    const avgPct = presentPct + latePct;

    // Section stats (Bar chart & Defaulters)
    const sectionChartsData = [];
    const sectionDefaultersData = [];

    // Define date range array for trends (default to the 1 week of seeded logs if dates are not specified)
    let trendDates = [
      new Date("2026-06-08T00:00:00.000Z"),
      new Date("2026-06-09T00:00:00.000Z"),
      new Date("2026-06-10T00:00:00.000Z"),
      new Date("2026-06-11T00:00:00.000Z"),
      new Date("2026-06-12T00:00:00.000Z"),
      new Date("2026-06-13T00:00:00.000Z"),
      new Date("2026-06-14T00:00:00.000Z"),
    ];

    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      const tempDates = [];
      const current = new Date(start);
      let limitDays = 0;
      while (current <= end && limitDays < 7) {
        tempDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
        limitDays++;
      }
      if (tempDates.length > 0) {
        trendDates = tempDates;
      }
    }

    const trendLabels = trendDates.map(d => d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }));
    const trendSections = [];

    for (const sec of allSections) {
      // Find all students in this section
      const secStudents = await prisma.student.findMany({
        where: { sectionId: sec.id },
        select: {
          id: true,
          attendance: {
            where: dateFilter,
            select: {
              status: true,
              date: true
            }
          }
        }
      });

      let secTotal = 0;
      let secPresent = 0;
      let secDefaulters = 0;

      secStudents.forEach(st => {
        const total = st.attendance.length;
        const present = st.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const pct = total > 0 ? (present / total) * 100 : null;
        if (pct !== null && pct < 75) {
          secDefaulters++;
        }
        secTotal += total;
        secPresent += present;
      });

      const secPct = secTotal > 0 ? Math.round((secPresent / secTotal) * 100) : 100;
      const labelName = classId ? `Sec ${sec.name}` : `${sec.academicClass?.name} - ${sec.name}`;

      sectionChartsData.push({
        name: labelName,
        percentage: secPct
      });

      sectionDefaultersData.push({
        name: labelName,
        count: secDefaulters
      });

      // Compute trends for this section across the trend dates
      const sectionDataTrends = [];
      for (const d of trendDates) {
        const dStart = new Date(d);
        dStart.setUTCHours(0, 0, 0, 0);
        const dEnd = new Date(d);
        dEnd.setUTCHours(23, 59, 59, 999);

        const dayLogs = await prisma.attendance.findMany({
          where: {
            sectionId: sec.id,
            date: { gte: dStart, lte: dEnd }
          },
          select: {
            status: true
          }
        });

        const totalDayLogs = dayLogs.length;
        const presentDayLogs = dayLogs.filter(l => l.status === 'PRESENT' || l.status === 'LATE').length;
        const dayPct = totalDayLogs > 0 ? Math.round((presentDayLogs / totalDayLogs) * 100) : 100;
        sectionDataTrends.push(dayPct);
      }

      trendSections.push({
        name: labelName,
        data: sectionDataTrends
      });
    }

    return res.status(200).json({
      success: true,
      data: paginatedRows,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total: totalStudents,
        totalPages: Math.ceil(totalStudents / pageSize),
      },
      stats: {
        attendanceRate,
        totalAbsent,
        lateEntries,
        defaulters: defaultersCount
      },
      charts: {
        breakdown: {
          present: presentPct,
          absent: absentPct,
          late: latePct,
          average: avgPct
        },
        trends: {
          labels: trendLabels,
          sections: trendSections
        },
        sections: sectionChartsData,
        defaulters: sectionDefaultersData
      }
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance summary",
      error: error.message,
    });
  }
};

export const getSectionWeeklyTrends = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { month, year } = req.query;

    if (!sectionId) {
      return res.status(400).json({ success: false, message: "Section ID is required." });
    }

    // Default to current system month/year if not explicitly sent by frontend
    const currentSystemDate = new Date();
    const targetYear = year ? parseInt(year as string, 10) : currentSystemDate.getFullYear();
    const targetMonth = month ? parseInt(month as string, 10) : (currentSystemDate.getMonth() + 1); // 1-12

    // Establish exact UTC start and end constraints for that single month
    const startOfMonth = new Date(Date.UTC(targetYear, targetMonth - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999));

    // Fetch records for ALL students that belong to this section
    const rawMonthlyRecords = await prisma.attendance.findMany({
      where: {
        student: {
          sectionId: sectionId // Cross-relational filter!
        },
        date: { gte: startOfMonth, lte: endOfMonth }
      },
      select: {
        date: true,
        status: true
      },
      orderBy: { date: 'asc' }
    });

    const weeklyBuckets = [
      { week: "Week 1", present: 0, totalDays: 0 },
      { week: "Week 2", present: 0, totalDays: 0 },
      { week: "Week 3", present: 0, totalDays: 0 },
      { week: "Week 4", present: 0, totalDays: 0 }
    ];

    // Sort all class records into the correct week buckets
    rawMonthlyRecords.forEach(record => {
      const dayOfMonth = new Date(record.date).getUTCDate();

      let bucketIndex = 3; // Defaults to Week 4 for days 22+
      if (dayOfMonth <= 7) bucketIndex = 0;
      else if (dayOfMonth <= 14) bucketIndex = 1;
      else if (dayOfMonth <= 21) bucketIndex = 2;

      weeklyBuckets[bucketIndex].totalDays += 1;
      
      // Assuming you only count 'PRESENT' as a positive metric
      if (record.status === 'PRESENT') {
        weeklyBuckets[bucketIndex].present += 1;
      }
    });

    // Format final collection with computed percentages for the UI
    const weeklyTrends = weeklyBuckets.map(b => ({
      ...b,
      percentage: b.totalDays > 0 ? parseFloat(((b.present / b.totalDays) * 100).toFixed(1)) : 0.0
    }));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return res.status(200).json({
      success: true,
      sectionId,
      monthName: monthNames[targetMonth - 1],
      year: targetYear,
      totalRecordsProcessed: rawMonthlyRecords.length,
      weeklyTrends
    });

  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to compile section weekly analytics.", 
      error: error.message 
    });
  }
};