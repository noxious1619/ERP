-- CreateEnum
CREATE TYPE "NoticeCategory" AS ENUM ('ANNOUNCEMENT', 'ACADEMIC', 'HOLIDAY', 'EXAM', 'SCHOOL_EVENT');

-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "category" "NoticeCategory" NOT NULL DEFAULT 'ANNOUNCEMENT';
