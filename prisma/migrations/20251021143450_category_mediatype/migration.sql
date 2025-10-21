-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('EBOOK', 'VIDEO', 'AUDIO');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT 'EBOOK';
