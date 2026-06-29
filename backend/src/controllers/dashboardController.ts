import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAdminDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Total active students
    const totalStudents = await prisma.student.count({
      where: { isActive: true }
    });

    // 2. Total active staff (Teachers + Staff profiles)
    const totalTeachers = await prisma.teacher.count({
      where: { status: 'ACTIVE' }
    });
    const totalStaff = await prisma.staff.count();
    const totalStaffCount = totalTeachers + totalStaff;

    // 3. New Admissions (students created in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newAdmissions = await prisma.student.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
        isActive: true
      }
    });

    // 4. Active Classes
    const activeClasses = await prisma.class.count();

    // 5. Today's Attendance Snapshot (uses latest active date in database if today has no logs)
    let today = new Date();
    
    // Check if we have logs for today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayLogsCount = await prisma.attendance.count({
      where: { date: { gte: startOfToday, lte: endOfToday } }
    });

    if (todayLogsCount === 0) {
      const latestLog = await prisma.attendance.findFirst({
        orderBy: { date: 'desc' },
        select: { date: true }
      });
      if (latestLog) {
        today = new Date(latestLog.date);
      }
    }

    const startOfTargetDay = new Date(today);
    startOfTargetDay.setHours(0, 0, 0, 0);
    const endOfTargetDay = new Date(today);
    endOfTargetDay.setHours(23, 59, 59, 999);

    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfTargetDay,
          lte: endOfTargetDay
        }
      }
    });

    const totalAttendanceCount = todayAttendance.length;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    todayAttendance.forEach((record) => {
      if (record.status === 'PRESENT' || record.status === 'HALF_DAY') {
        presentCount++;
      } else if (record.status === 'ABSENT') {
        absentCount++;
      } else if (record.status === 'LATE') {
        lateCount++;
      }
    });

    // Student Attendance Percentage Today
    let studentAttendanceToday = null;
    if (totalStudents > 0 && totalAttendanceCount > 0) {
      const totalPresentOrLate = presentCount + lateCount;
      studentAttendanceToday = Math.round((totalPresentOrLate / totalStudents) * 100);
    }

    // 6. Pending Fees
    const pendingFeesAggregate = await prisma.monthlyFeeRecord.aggregate({
      where: { status: 'PENDING' },
      _sum: { amountDue: true }
    });
    const pendingFees = pendingFeesAggregate._sum.amountDue; // Returns number | null

    // 7. Recent notices (limit to 3)
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true
      }
    });

    // 8. Weekly Attendance Trend (Last 6 weekdays: Mon - Sat) using the active target week
    const weeklyTrend: number[] = [];
    const targetDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    for (let i = 1; i <= 6; i++) {
      const targetDate = new Date(today);
      const diff = i - (targetDayOfWeek === 0 ? 7 : targetDayOfWeek);
      targetDate.setDate(today.getDate() + diff);
      targetDate.setHours(0, 0, 0, 0);

      const dayStart = new Date(targetDate);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayAttendance = await prisma.attendance.findMany({
        where: {
          date: {
            gte: dayStart,
            lte: dayEnd
          }
        }
      });

      if (dayAttendance.length > 0 && totalStudents > 0) {
        const presentOrLate = dayAttendance.filter(
          (a) => a.status === 'PRESENT' || a.status === 'LATE' || a.status === 'HALF_DAY'
        ).length;
        weeklyTrend.push(Math.round((presentOrLate / totalStudents) * 100));
      } else {
        weeklyTrend.push(0);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalStaff: totalStaffCount,
          studentAttendanceToday,
          newAdmissions,
          activeClasses,
          pendingFees
        },
        attendanceSnapshot: {
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          hasData: totalAttendanceCount > 0
        },
        weeklyTrend,
        notices
      }
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard statistics',
      error: error.message
    });
  }
};
