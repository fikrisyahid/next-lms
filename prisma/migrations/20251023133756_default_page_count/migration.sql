/*
  Warnings:

  - Made the column `pageCount` on table `Ebook` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ebook" ALTER COLUMN "pageCount" SET NOT NULL,
ALTER COLUMN "pageCount" SET DEFAULT 0;
