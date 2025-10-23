/*
  Warnings:

  - Added the required column `fileUrl` to the `Ebook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ebook" ADD COLUMN     "fileUrl" TEXT NOT NULL;
