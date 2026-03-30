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

    // 🔗 Fetches Section -> Class -> Students in one go
    const sectionInfo = await prisma.section.findUnique({
      where: { id: sectionId as string },
      include: {
        class: true, // This brings in the "Class" name (e.g., "10")
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
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.status(200).json({
      success: true,
      metadata: {
        className: sectionInfo.class.name,
        sectionName: sectionInfo.name,
        fullClass: `${sectionInfo.class.name}-${sectionInfo.name}`
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