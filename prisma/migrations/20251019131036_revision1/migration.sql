/*
  Warnings:

  - A unique constraint covering the columns `[ISBN]` on the table `Ebook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ISBN` to the `Ebook` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('UMUM', 'PAUD', 'SD', 'SMP', 'SMA', 'SMK');

-- CreateEnum
CREATE TYPE "ClassLevel" AS ENUM ('NONCLASS', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');

-- CreateEnum
CREATE TYPE "EbookType" AS ENUM ('BSE', 'NONBSE');

-- CreateEnum
CREATE TYPE "Curriculum" AS ENUM ('NONCURRICULUM', 'KBK', 'KTSP', 'K13', 'MERDEKA');

-- AlterTable
ALTER TABLE "Ebook" ADD COLUMN     "ISBN" TEXT NOT NULL,
ADD COLUMN     "classLevel" "ClassLevel" NOT NULL DEFAULT 'NONCLASS',
ADD COLUMN     "curriculum" "Curriculum" NOT NULL DEFAULT 'NONCURRICULUM',
ADD COLUMN     "educationLevel" "EducationLevel" NOT NULL DEFAULT 'UMUM',
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "readCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subjectsId" TEXT,
ADD COLUMN     "type" "EbookType" NOT NULL DEFAULT 'NONBSE';

-- CreateTable
CREATE TABLE "Subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_name_key" ON "Subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ebook_ISBN_key" ON "Ebook"("ISBN");

-- AddForeignKey
ALTER TABLE "Ebook" ADD CONSTRAINT "Ebook_subjectsId_fkey" FOREIGN KEY ("subjectsId") REFERENCES "Subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
