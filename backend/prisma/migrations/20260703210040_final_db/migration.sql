/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'PRINCIPAL';
ALTER TYPE "Role" ADD VALUE 'ACCOUNTANT';
ALTER TYPE "Role" ADD VALUE 'FRONT_DESK';

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_gradedById_fkey";

-- DropForeignKey
ALTER TABLE "Timetable" DROP CONSTRAINT "Timetable_teacherId_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "teacherId",
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "homeRoom" TEXT;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "qualification" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "department" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "teacherId",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Theory';

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "score",
ADD COLUMN     "marksObtained" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "TeacherSectionSubject" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherSectionSubject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeacherSectionSubject_teacherId_idx" ON "TeacherSectionSubject"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherSectionSubject_sectionId_idx" ON "TeacherSectionSubject"("sectionId");

-- CreateIndex
CREATE INDEX "TeacherSectionSubject_subjectId_idx" ON "TeacherSectionSubject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSectionSubject_teacherId_sectionId_subjectId_key" ON "TeacherSectionSubject"("teacherId", "sectionId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- AddForeignKey
ALTER TABLE "TeacherSectionSubject" ADD CONSTRAINT "TeacherSectionSubject_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSectionSubject" ADD CONSTRAINT "TeacherSectionSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSectionSubject" ADD CONSTRAINT "TeacherSectionSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
