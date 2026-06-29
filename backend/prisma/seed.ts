import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../generated/prisma/index.js";

// Native PostgreSQL Driver adapter configuration
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting database seeding...");

  // 1. Clear any existing records for these test emails to allow re-running seed cleanly
  const testEmails = [
    "test_admin@erp.com",
    "test_teacher@erp.com",
    "test_teacher2@erp.com",
    "test_student@erp.com",
    "test_student_b@erp.com"
  ];

  // Delete notice dependencies first to avoid foreign key violations
  await prisma.noticeView.deleteMany({
    where: {
      OR: [
        { notice: { author: { email: { in: testEmails } } } },
        { user: { email: { in: testEmails } } }
      ]
    }
  });

  await prisma.notice.deleteMany({
    where: { author: { email: { in: testEmails } } }
  });

  // Delete teaching assignments
  await prisma.teacherSectionSubject.deleteMany({});
  await prisma.timetable.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.calculatedResult.deleteMany({});
  await prisma.mark.deleteMany({});
  await prisma.assessmentComponent.deleteMany({});
  await prisma.scheduledExam.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.monthlyFeeRecord.deleteMany({});

  // Delete student/teacher profiles and users
  await prisma.student.deleteMany({
    where: { user: { email: { in: testEmails } } }
  });
  await prisma.teacher.deleteMany({
    where: { user: { email: { in: testEmails } } }
  });
  await prisma.section.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.subject.deleteMany({});
  
  await prisma.user.deleteMany({
    where: { email: { in: testEmails } }
  });

  // Ensure Academic Year exists
  let academicYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true }
  });
  if (!academicYear) {
    academicYear = await prisma.academicYear.create({
      data: {
        name: "2026-2027",
        isCurrent: true
      }
    });
  }

  // Hash Password using bcrypt to allow successful auth logins
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  // 2. Create Class: Grade 10
  const class10 = await prisma.class.create({
    data: {
      name: "Grade 10",
      academicYearId: academicYear.id
    }
  });
  console.log(`Created Class: ${class10.name}`);

  // 3. Create Sections: A and B
  const sectionA = await prisma.section.create({
    data: {
      name: "A",
      classId: class10.id
    }
  });
  const sectionB = await prisma.section.create({
    data: {
      name: "B",
      classId: class10.id
    }
  });
  console.log(`Created Sections: ${sectionA.name}, ${sectionB.name}`);

  // 4. Create Admin User (SUPER_ADMIN)
  const adminUser = await prisma.user.create({
    data: {
      name: "Test Admin",
      email: "test_admin@erp.com",
      passwordHash: passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true
    }
  });
  console.log(`Created Admin: ${adminUser.email}`);

  // 5. Create Teacher 1 (test_teacher@erp.com)
  const teacherUser1 = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "test_teacher@erp.com",
      passwordHash: passwordHash,
      role: Role.TEACHER,
      isActive: true
    }
  });
  const teacher1 = await prisma.teacher.create({
    data: {
      firstName: "Rajesh",
      lastName: "Kumar",
      employeeId: "TCH001",
      joiningDate: new Date(),
      userId: teacherUser1.id,
      email: "test_teacher@erp.com",
      status: "ACTIVE"
    }
  });
  console.log(`Created Teacher 1: ${teacher1.firstName} ${teacher1.lastName}`);

  // 6. Create Teacher 2 (test_teacher2@erp.com)
  const teacherUser2 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "test_teacher2@erp.com",
      passwordHash: passwordHash,
      role: Role.TEACHER,
      isActive: true
    }
  });
  const teacher2 = await prisma.teacher.create({
    data: {
      firstName: "Priya",
      lastName: "Sharma",
      employeeId: "TCH002",
      joiningDate: new Date(),
      userId: teacherUser2.id,
      email: "test_teacher2@erp.com",
      status: "ACTIVE"
    }
  });
  console.log(`Created Teacher 2: ${teacher2.firstName} ${teacher2.lastName}`);

  // 7. Create Student 1 (test_student@erp.com) in Section A
  const studentUser1 = await prisma.user.create({
    data: {
      name: "Amit Sharma",
      email: "test_student@erp.com",
      passwordHash: passwordHash,
      role: Role.STUDENT,
      isActive: true
    }
  });
  const student1 = await prisma.student.create({
    data: {
      firstName: "Amit",
      lastName: "Sharma",
      admissionNumber: "STD001",
      rollNumber: "1",
      dateOfBirth: new Date("2012-05-15"),
      gender: "Male",
      userId: studentUser1.id,
      sectionId: sectionA.id,
      isActive: true
    }
  });
  console.log(`Created Student 1: ${student1.firstName} ${student1.lastName} (Section A)`);

  // 8. Create Student 2 (test_student_b@erp.com) in Section B
  const studentUser2 = await prisma.user.create({
    data: {
      name: "Rahul Verma",
      email: "test_student_b@erp.com",
      passwordHash: passwordHash,
      role: Role.STUDENT,
      isActive: true
    }
  });
  const student2 = await prisma.student.create({
    data: {
      firstName: "Rahul",
      lastName: "Verma",
      admissionNumber: "STD002",
      rollNumber: "2",
      dateOfBirth: new Date("2012-09-20"),
      gender: "Male",
      userId: studentUser2.id,
      sectionId: sectionB.id,
      isActive: true
    }
  });
  console.log(`Created Student 2: ${student2.firstName} ${student2.lastName} (Section B)`);

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });