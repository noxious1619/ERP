// import "dotenv/config";
// import pg from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/prisma/index.js";

// const connectionString = `${process.env.DATABASE_URL}`;
// const pool = new pg.Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   // Clear any existing assignments to avoid duplicates/messy states
//   await prisma.submission.deleteMany({});
//   await prisma.assignment.deleteMany({});

//   const teacher = await prisma.teacher.findFirst({
//     where: { email: "test_teacher@erp.com" }
//   });
//   if (!teacher) throw new Error("Teacher Rajesh Kumar not found.");

//   const section = await prisma.section.findFirst({
//     where: { name: "A" }
//   });
//   if (!section) throw new Error("Section A not found.");

//   const subject = await prisma.subject.findFirst({
//     where: { name: "Mathematics" }
//   });
//   if (!subject) throw new Error("Mathematics subject not found.");

//   const dummyAssignments = [
//     { title: "Algebra Basics Quiz", content: "Solve equations on page 42-45.", dueDate: new Date(Date.now() + 86400000 * 2) },
//     { title: "Quadratic Equations Homework", content: "Complete problems 1 to 10.", dueDate: new Date(Date.now() + 86400000 * 4) },
//     { title: "Calculus Worksheet 1", content: "Find the limits for given functions.", dueDate: new Date(Date.now() - 86400000 * 2) },
//     { title: "Trigonometric Identities Practice", content: "Prove identities on sheet.", dueDate: new Date(Date.now() + 86400000 * 5) },
//     { title: "Probability Distribution Lab", content: "Submit coin tossing report.", dueDate: new Date(Date.now() + 86400000 * 7) },
//     { title: "Geometry Proofs Assignment", content: "Prove theorems 3 and 4.", dueDate: new Date(Date.now() - 86400000 * 5) },
//     { title: "Matrices & Determinants Test", content: "Solve inverse matrices.", dueDate: new Date(Date.now() + 86400000 * 1) },
//     { title: "Vector Algebra Assignment", content: "Find dot and cross products.", dueDate: new Date(Date.now() + 86400000 * 9) },
//     { title: "Complex Numbers Quiz", content: "Simplify complex expressions.", dueDate: new Date(Date.now() - 86400000 * 1) },
//     { title: "Statistics Project - Final", content: "Analyse dataset and submit graph.", dueDate: new Date(Date.now() + 86400000 * 10) },
//   ];

//   for (const entry of dummyAssignments) {
//     const created = await prisma.assignment.create({
//       data: {
//         title: entry.title,
//         content: entry.content,
//         dueDate: entry.dueDate,
//         maxScore: 100,
//         subjectId: subject.id,
//         classId: section.classId,
//         sectionId: section.id,
//         teacherId: teacher.id,
//       }
//     });
//     console.log(`Created Assignment: ${created.title}`);
//   }
//   console.log("Seeding completed successfully.");
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//     await pool.end();
//   });
