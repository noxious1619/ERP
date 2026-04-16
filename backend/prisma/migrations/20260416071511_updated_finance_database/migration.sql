/*
  Warnings:

  - You are about to drop the column `academicYear` on the `FeeComponent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classId,academicYearId,feeName,applicableMonth]` on the table `FeeComponent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYearId` to the `FeeComponent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FeeComponent_classId_academicYear_feeName_applicableMonth_key";

-- AlterTable
ALTER TABLE "FeeComponent" DROP COLUMN "academicYear",
ADD COLUMN     "academicYearId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FeeComponent_classId_academicYearId_feeName_applicableMonth_key" ON "FeeComponent"("classId", "academicYearId", "feeName", "applicableMonth");

-- AddForeignKey
ALTER TABLE "FeeComponent" ADD CONSTRAINT "FeeComponent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeComponent" ADD CONSTRAINT "FeeComponent_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
