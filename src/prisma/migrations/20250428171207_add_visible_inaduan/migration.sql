/*
  Warnings:

  - You are about to drop the column `is_read` on the `Aduan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Aduan" DROP COLUMN "is_read",
ADD COLUMN     "is_visible" BOOLEAN NOT NULL DEFAULT false;
