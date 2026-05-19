/*
  Warnings:

  - You are about to drop the `_StudentToParent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StudentToParent" DROP CONSTRAINT "_StudentToParent_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToParent" DROP CONSTRAINT "_StudentToParent_B_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "parentId" TEXT;

-- DropTable
DROP TABLE "_StudentToParent";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
