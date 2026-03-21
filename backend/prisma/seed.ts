import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
// Ensure this path matches where your 'npx prisma generate' sent the files
import { PrismaClient, Role } from "../generated/prisma/index.js";

// 1. Setup the Native Postgres Driver
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Instantiate Prisma with the Adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting database seed...");

  const adminEmail = "admin@erp.com";

  // Check if Super Admin already exists to avoid duplicates
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("⚠️  Super Admin already exists. Skipping seed.");
    return;
  }

  // Hash the password (Admin@123)
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("Admin@123", saltRounds);

  // Create the Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("✅ Seed successful!");
  console.log(`User Created: ${superAdmin.email}`);
  console.log(`Role: ${superAdmin.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connections properly
    await prisma.$disconnect();
    await pool.end();
  });