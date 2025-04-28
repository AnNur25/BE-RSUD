/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `Aduan` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `Aduan` table. All the data in the column will be lost.
  - Added the required column `message` to the `Aduan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Aduan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aduan" DROP COLUMN "deskripsi",
DROP COLUMN "judul",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL;
