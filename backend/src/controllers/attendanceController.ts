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
    const { studentId } = req.params;
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
    const { studentId } = req.params;
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
      
      monthlyBuckets[monthIndex].total += 1;
      if (record.status === 'PRESENT') {
        monthlyBuckets[monthIndex].present += 1;
      }
    });

    // Construct an array of objects which plays perfectly with charting data states
    const monthlyOverview = monthNames.map((month, index) => {
      const bucket = monthlyBuckets[index];
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

export const getStudentWeeklyTrends = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
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

      weeklyBuckets[bucketIndex].totalDays += 1;
      if (record.status === 'PRESENT') {
        weeklyBuckets[bucketIndex].present += 1;
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
    const { studentId } = req.params;
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
      const ISOStringKey = new Date(record.date).toISOString().split('T')[0];
      
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