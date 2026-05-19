/*
  Warnings:

  - You are about to drop the column `address` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyPhone` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `fatherOccupation` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `motherOccupation` on the `Parent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "address",
DROP COLUMN "emergencyPhone",
DROP COLUMN "fatherOccupation",
DROP COLUMN "motherOccupation",
ADD COLUMN     "email" TEXT;
