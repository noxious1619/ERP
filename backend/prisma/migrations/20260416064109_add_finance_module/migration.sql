-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'BOUNCED');

-- AlterTable
ALTER TABLE "CalculatedResult" ADD COLUMN     "grade" TEXT;

-- CreateTable
CREATE TABLE "FeeComponent" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "feeName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "applicableMonth" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyFeeRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "status" "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMode" TEXT,
    "referenceNo" TEXT,
    "remarks" TEXT,
    "verifiedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyFeeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeeComponent_classId_academicYear_feeName_applicableMonth_key" ON "FeeComponent"("classId", "academicYear", "feeName", "applicableMonth");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyFeeRecord_studentId_month_year_key" ON "MonthlyFeeRecord"("studentId", "month", "year");

-- AddForeignKey
ALTER TABLE "AssessmentComponent" ADD CONSTRAINT "AssessmentComponent_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentComponent" ADD CONSTRAINT "AssessmentComponent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalculatedResult" ADD CONSTRAINT "CalculatedResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyFeeRecord" ADD CONSTRAINT "MonthlyFeeRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
