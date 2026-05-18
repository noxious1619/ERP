/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "qualification" DROP NOT NULL,
ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "experience" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");
