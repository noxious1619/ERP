import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorised" });
    }

    // Fetch User + Staff record together
    const [user, staffRecord] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id:        true,
          name:      true,
          email:     true,
          role:      true,
          isActive:  true,
          createdAt: true,
        },
      }),
      prisma.staff.findUnique({
        where: { userId },
        select: {
          id:          true,
          employeeId:  true,
          firstName:   true,
          lastName:    true,
          gender:      true,
          dateOfBirth: true,
          phone:       true,
          address:     true,
          city:        true,
          state:       true,
          bloodGroup:  true,
          department:  true,
          designation: true,
          joiningDate: true,
          status:      true,
          bio:         true,
        },
      }),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Merge User + Staff data
    return res.status(200).json({
      success: true,
      data: {
        // User fields
        id:        user.id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        isActive:  user.isActive,
        createdAt: user.createdAt,
        // Staff fields (null if no staff record exists)
        staffId:     staffRecord?.id          ?? null,
        employeeId:  staffRecord?.employeeId  ?? null,
        firstName:   staffRecord?.firstName   ?? null,
        lastName:    staffRecord?.lastName    ?? null,
        gender:      staffRecord?.gender      ?? null,
        dateOfBirth: staffRecord?.dateOfBirth ?? null,
        phone:       staffRecord?.phone       ?? null,
        address:     staffRecord?.address     ?? null,
        city:        staffRecord?.city        ?? null,
        state:       staffRecord?.state       ?? null,
        bloodGroup:  staffRecord?.bloodGroup  ?? null,
        department:  staffRecord?.department  ?? null,
        designation: staffRecord?.designation ?? null,
        joiningDate: staffRecord?.joiningDate ?? null,
        status:      staffRecord?.status      ?? null,
        bio:         staffRecord?.bio         ?? null,
      },
    });
  } catch (error: any) {
    console.error("[getAdminProfile] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};