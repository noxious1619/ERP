-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_classId_fkey";

-- AlterTable
ALTER TABLE "ScheduledExam" ADD COLUMN     "instruction" TEXT;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
