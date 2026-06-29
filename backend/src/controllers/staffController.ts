import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import type { Role } from "../../generated/prisma/index.js";

// ── Role mapping ──────────────────────────────────────────────────────────────
// Maps the UI role string to Prisma Role enum + a designation label
const ROLE_MAP: Record<string, { prismaRole: Role; designation: string }> = {
 Principal:    { prismaRole: "PRINCIPAL",   designation: "Principal"        },
  Accountant:   { prismaRole: "ACCOUNTANT",  designation: "Accountant"       },
  "Front Desk": { prismaRole: "FRONT_DESK",  designation: "Front Desk Staff" },
  Finance:      { prismaRole: "FINANCE",     designation: "Finance"          },
  Admin:        { prismaRole: "ADMIN",       designation: "Admin"            },
};

// ── POST /api/staff/onboard ───────────────────────────────────────────────────
export const registerStaff = async (req: Request, res: Response) => {
  const {
    firstName, lastName, email, password,
    employeeId, role,           // role = "Principal" | "Accountant" | "Front Desk"
    gender, dateOfBirth,
    phone, address, city, state,
    bloodGroup, department, joiningDate,
    bio,qualification,
  experience,
  } = req.body;

  try {
    const roleConfig = ROLE_MAP[role];
    if (!roleConfig) {
      return res.status(400).json({
        success: false,
        message: `Invalid role: ${role}. Use Principal, Accountant, or Front Desk`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Email already registered");

       const [existingTeacher, existingStaff] = await Promise.all([
    tx.teacher.findUnique({ where: { employeeId } }),
    tx.staff.findUnique({ where: { employeeId } }),
  ]);
  if (existingTeacher || existingStaff) {
    throw new Error(`Employee ID "${employeeId}" is already in use. Please use a different ID.`);
  }

      const passwordHash = await bcrypt.hash(password ?? "EdaOS@123", 10);

      const user = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`.trim(),
          email,
          passwordHash,
          role: roleConfig.prismaRole,
        },
      });

      const staff = await tx.staff.create({
        data: {
          firstName,
          lastName,
          employeeId,
          gender:      gender      ?? null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          phone:       phone       ?? null,
          email:       email       ?? null,
          address:     address     ?? null,
          city:        city        ?? null,
          state:       state       ?? null,
          bloodGroup:  bloodGroup  ?? null,
          department:  department  ?? null,
          designation: roleConfig.designation,
          joiningDate: new Date(joiningDate),
          bio:         bio         ?? null,
          userId:      user.id,
          qualification: qualification ?? null,
experience: experience ? Number(experience) : null,
        },
      });

      return { user, staff };
    });

    return res.status(201).json({
      success: true,
      message: `${role} onboarded successfully`,
      data: result,
    });
  } catch (error: any) {
  // Check error and its cause (Prisma wraps transaction errors)
  const target = error?.meta?.target?.[0] 
    ?? error?.cause?.meta?.target?.[0]
    ?? ""

  const code = error?.code ?? error?.cause?.code ?? ""

  if (code === "P2002") {
    if (target.includes("employeeId")) {
      return res.status(400).json({
        success: false,
        message: `Employee ID "${employeeId}" is already in use. Please use a different ID.`
      })
    }
    if (target.includes("email")) {
      return res.status(400).json({
        success: false,
        message: `Email "${email}" is already registered. Please use a different email.`
      })
    }
  }

  return res.status(400).json({ success: false, message: error.message })
}
};

// ── GET /api/staff ────────────────────────────────────────────────────────────
// Server-side pagination + search + filter across Teacher + Staff tables
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const page         = Math.max(1, parseInt(req.query.page   as string) || 1);
    const limit        = Math.max(1, parseInt(req.query.limit  as string) || 10);
    const search       = (req.query.search as string)?.trim() || "";
    const roleFilter   = (req.query.role   as string)?.trim() || "";
    const statusFilter = (req.query.status as string)?.trim() || "";
    const skip         = (page - 1) * limit;

    const requestingRole = (req as any).user?.role as string;
const excludeAdmin   = requestingRole === "ADMIN";

    // ── Map UI role to designation ────────────────────────────────────────────
    const designationFilter =
  roleFilter === "Principal"  ? "Principal"        :
  roleFilter === "Accountant" ? "Accountant"       :
  roleFilter === "Front Desk" ? "Front Desk Staff" :
  roleFilter === "Finance"    ? "Finance"          :
  roleFilter === "Admin"      ? "Admin"            : undefined;

    // ── Search condition ──────────────────────────────────────────────────────
    const nameSearch = search
      ? {
          OR: [
            { firstName:  { contains: search, mode: "insensitive" as const } },
            { lastName:   { contains: search, mode: "insensitive" as const } },
            { employeeId: { contains: search, mode: "insensitive" as const } },
            { phone:      { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // ── Status condition ──────────────────────────────────────────────────────
    const statusCondition =
      statusFilter === "Active"   ? { status: "ACTIVE" }    :
      statusFilter === "On Leave" ? { status: "ON_LEAVE" }  : {};

    // ── Fetch Staff only (no Teachers) ────────────────────────────────────────
    const [staffRows, total] = await Promise.all([
      prisma.staff.findMany({
        where: {
          ...nameSearch,
          ...statusCondition,
          ...(designationFilter ? { designation: designationFilter } : {}),
             ...(excludeAdmin ? { designation: { not: "Admin" } } : {}),
        },
        select: {
          id:          true,
          firstName:   true,
          lastName:    true,
          employeeId:  true,
          phone:       true,
          status:      true,
          designation: true,
          qualification: true,
          department:  true,    
          joiningDate: true, 
        },
        orderBy: { employeeId: "asc" },
        skip,
        take: limit,
      }),
      prisma.staff.count({
  where: {
    ...nameSearch,
    ...statusCondition,
    ...(designationFilter ? { designation: designationFilter } : {}),
    ...(excludeAdmin ? { designation: { not: "Admin" } } : {}),
  },
}),
    ]);

    // ── Normalize ─────────────────────────────────────────────────────────────
const normalizeStatus = (s: string) =>
  s === "ACTIVE" ? "Active" : s === "ON_LEAVE" ? "On Leave" : s;

const data = staffRows.map((s) => ({
  id:          s.id,
  employeeId:  s.employeeId,
  name:        `${s.firstName} ${s.lastName}`.trim(),
  role:        s.designation,
  department:  s.department ?? "-",
  joiningDate: s.joiningDate
    ? new Date(s.joiningDate).toLocaleDateString("en-IN", {
        day:   "2-digit",
        month: "2-digit",
        year:  "numeric",
      })
    : "-",
  contact: s.phone ?? "-",
  status:  normalizeStatus(s.status) as "Active" | "On Leave",
}));

    // ── Stats ─────────────────────────────────────────────────────────────────
    const [allStaff, activeCount, onLeaveCount, newThisMonth] = await Promise.all([
      prisma.staff.count(),
      prisma.staff.count({ where: { status: "ACTIVE" } }),
      prisma.staff.count({ where: { status: "ON_LEAVE" } }),
      prisma.staff.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        stats: {
          totalStaff:   allStaff,
          newThisMonth,
          active:       activeCount,
          onLeave:      onLeaveCount,
        },
      },
    });
  } catch (error: any) {
    console.error("[getAllStaff] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/staff/export ─────────────────────────────────────────────────────
// Same filters, no pagination — for CSV export
export const exportStaffCSV = async (req: Request, res: Response) => {
  // Reuse getAllStaff logic but with limit=9999 and return raw array
  req.query.page  = "1";
  req.query.limit = "9999";

  // Temporarily capture the JSON to extract data array
  // Cleaner: extract the fetch logic into a shared service function
  // For now, a simple redirect to the same logic works:
  return getAllStaff(req, res);
};

// ── GET /api/staff/:id ────────────────────────────────────────────────────────
export const getStaffById = async (req: Request, res: Response) => {
  try {
     const id = req.params.id as string; 

    const staff = await prisma.staff.findUnique({
      where: { id },
      select: {
        id:          true,
        firstName:   true,
        lastName:    true,
        employeeId:  true,
        designation: true,
        gender:      true,
        dateOfBirth: true,
        phone:       true,
        email:       true,
        address:     true,
        city:        true,
        state:       true,
        bloodGroup:  true,
        department:  true,
        joiningDate: true,
        status:      true,
        bio:         true,
        qualification: true,
        experience: true,
      },
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    return res.status(200).json({ success: true, data: staff });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PATCH /api/staff/:id ──────────────────────────────────────────────────────
export const updateStaff = async (req: Request, res: Response) => {
  try {
     const id = req.params.id as string; 
    const {
      firstName, lastName, gender, dateOfBirth,
      phone, email, address, city, state,
      bloodGroup, department, joiningDate, bio, status,
      qualification, experience
    } = req.body;

    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Update User name + email if changed
      if (firstName || lastName || email) {
        await tx.user.update({
          where: { id: existing.userId },
          data: {
            ...(firstName || lastName
              ? { name: `${firstName ?? existing.firstName} ${lastName ?? existing.lastName}`.trim() }
              : {}),
            ...(email ? { email } : {}),
          },
        });
      }

      return tx.staff.update({
        where: { id },
        data: {
          ...(firstName   !== undefined && { firstName }),
          ...(lastName    !== undefined && { lastName }),
          ...(gender      !== undefined && { gender }),
          ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
          ...(phone       !== undefined && { phone }),
          ...(email       !== undefined && { email }),
          ...(address     !== undefined && { address }),
          ...(city        !== undefined && { city }),
          ...(state       !== undefined && { state }),
          ...(bloodGroup  !== undefined && { bloodGroup }),
          ...(department  !== undefined && { department }),
          ...(joiningDate !== undefined && { joiningDate: new Date(joiningDate) }),
          ...(bio         !== undefined && { bio }),
          ...(status      !== undefined && { status }),
          ...(qualification !== undefined && { qualification }),

...(experience !== undefined && {
    experience: experience ? Number(experience) : null,
}),
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/staff/:id ─────────────────────────────────────────────────────
export const deleteStaff = async (req: Request, res: Response) => {
  try {
     const id = req.params.id as string; 

    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.staff.delete({ where: { id } });
      await tx.user.delete({ where: { id: existing.userId } });
    });

    return res.status(200).json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};