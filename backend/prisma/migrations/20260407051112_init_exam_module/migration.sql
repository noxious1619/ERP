-- CreateEnum
CREATE TYPE "DisplayMode" AS ENUM ('PERCENTAGE', 'CGPA', 'GRADE');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('THEORY', 'PRACTICAL', 'INTERNAL', 'VIVA');

-- CreateTable
CREATE TABLE "ExamTerm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentComponent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ComponentType" NOT NULL DEFAULT 'THEORY',
    "maxMarks" DOUBLE PRECISION NOT NULL,
    "weightage" DOUBLE PRECISION NOT NULL,
    "termId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "AssessmentComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mark" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assessmentComponentId" TEXT NOT NULL,
    "marksObtained" DOUBLE PRECISION NOT NULL,
    "isAbsent" BOOLEAN NOT NULL DEFAULT false,
    "teacherId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculatedResult" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "finalPercentage" DOUBLE PRECISION NOT NULL,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalculatedResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingScale" (
    "id" TEXT NOT NULL,
    "minPercent" DOUBLE PRECISION NOT NULL,
    "maxPercent" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "gradePoint" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GradingScale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolConfig" (
    "id" TEXT NOT NULL,
    "reportDisplayMode" "DisplayMode" NOT NULL DEFAULT 'PERCENTAGE',
    "passingPercent" DOUBLE PRECISION NOT NULL DEFAULT 33.0,

    CONSTRAINT "SchoolConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssessmentComponent_termId_subjectId_classId_idx" ON "AssessmentComponent"("termId", "subjectId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "Mark_studentId_assessmentComponentId_key" ON "Mark"("studentId", "assessmentComponentId");

-- CreateIndex
CREATE UNIQUE INDEX "CalculatedResult_studentId_subjectId_termId_key" ON "CalculatedResult"("studentId", "subjectId", "termId");

-- AddForeignKey
ALTER TABLE "AssessmentComponent" ADD CONSTRAINT "AssessmentComponent_termId_fkey" FOREIGN KEY ("termId") REFERENCES "ExamTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_assessmentComponentId_fkey" FOREIGN KEY ("assessmentComponentId") REFERENCES "AssessmentComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalculatedResult" ADD CONSTRAINT "CalculatedResult_termId_fkey" FOREIGN KEY ("termId") REFERENCES "ExamTerm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
