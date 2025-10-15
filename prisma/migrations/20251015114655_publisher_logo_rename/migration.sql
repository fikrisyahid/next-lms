/*
  Warnings:

  - You are about to drop the column `logo` on the `Publisher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Publisher" DROP COLUMN "logo",
ADD COLUMN     "logoUrl" TEXT;
