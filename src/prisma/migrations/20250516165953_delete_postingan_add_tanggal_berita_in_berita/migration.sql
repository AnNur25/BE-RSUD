/*
  Warnings:

  - You are about to drop the `Postingan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tanggal_berita` to the `Berita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Berita" ADD COLUMN     "tanggal_berita" TEXT NOT NULL;

-- DropTable
DROP TABLE "Postingan";
