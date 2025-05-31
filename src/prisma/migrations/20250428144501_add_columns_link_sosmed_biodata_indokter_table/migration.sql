/*
  Warnings:

  - Added the required column `biodata_singkat` to the `Dokter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dokter" ADD COLUMN     "biodata_singkat" TEXT NOT NULL,
ADD COLUMN     "link_facebook" TEXT,
ADD COLUMN     "link_instagram" TEXT,
ADD COLUMN     "link_linkedin" TEXT;
