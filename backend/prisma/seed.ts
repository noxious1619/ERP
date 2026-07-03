// backend/prisma/createAdmin.ts
// Creates a single Super Admin user. Safe to run — does NOT delete or touch any existing data.
// Run from backend/ folder:
//   npx tsx prisma/createAdmin.ts

import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../generated/prisma/index.js";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---- Edit these before running ----
const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@edaos.com";
const ADMIN_PASSWORD = "ChangeMe@123";
// ------------------------------------

async function main() {
  console.log("Checking for existing admin...");

  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log(`⚠️  A user with email "${ADMIN_EMAIL}" already exists. No changes made.`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.create({
    data: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("✅ Admin created successfully:");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });