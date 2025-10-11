/*
  Warnings:

  - You are about to drop the column `userId` on the `Ebook` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Ebook" DROP CONSTRAINT "Ebook_userId_fkey";

-- DropIndex
DROP INDEX "public"."Ebook_userId_idx";

-- AlterTable
ALTER TABLE "Ebook" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_EbookToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EbookToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EbookToUser_B_index" ON "_EbookToUser"("B");

-- AddForeignKey
ALTER TABLE "_EbookToUser" ADD CONSTRAINT "_EbookToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Ebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EbookToUser" ADD CONSTRAINT "_EbookToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
