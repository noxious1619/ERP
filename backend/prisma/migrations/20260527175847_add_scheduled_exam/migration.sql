-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "icon" TEXT;

-- CreateTable
CREATE TABLE "ScheduledExam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "syllabus" TEXT,
    "examDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "totalMarks" DOUBLE PRECISION DEFAULT 100,
    "termId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledExam_classId_examDate_idx" ON "ScheduledExam"("classId", "examDate");

-- AddForeignKey
ALTER TABLE "ScheduledExam" ADD CONSTRAINT "ScheduledExam_termId_fkey" FOREIGN KEY ("termId") REFERENCES "ExamTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledExam" ADD CONSTRAINT "ScheduledExam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledExam" ADD CONSTRAINT "ScheduledExam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledExam" ADD CONSTRAINT "ScheduledExam_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
