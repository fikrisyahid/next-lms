/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `Ebook` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Ebook` table. All the data in the column will be lost.
  - Added the required column `thumbnailUrl` to the `Ebook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ebook" DROP COLUMN "publishedAt",
DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;
