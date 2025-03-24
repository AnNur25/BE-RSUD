/*
  Warnings:

  - You are about to drop the column `waktu` on the `Berita` table. All the data in the column will be lost.
  - Added the required column `tanggal_terbit` to the `Berita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Berita" DROP COLUMN "waktu",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tanggal_terbit" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
