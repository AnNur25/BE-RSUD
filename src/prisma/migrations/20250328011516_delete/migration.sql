/*
  Warnings:

  - You are about to drop the column `id_pelayanan_dokter` on the `Dokter` table. All the data in the column will be lost.
  - You are about to drop the column `id_spesialis` on the `Dokter` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `Dokter` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `JadwalDokter` table. All the data in the column will be lost.
  - You are about to drop the `PelayananDokter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PelayananRumahSakit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Spesialis` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_poli` to the `Dokter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_pelayanan` to the `JadwalDokter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Berita" DROP CONSTRAINT "Berita_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_id_pelayanan_dokter_fkey";

-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_id_spesialis_fkey";

-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Gambar" DROP CONSTRAINT "Gambar_id_user_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_user_fkey";

-- DropForeignKey
ALTER TABLE "PelayananDokter" DROP CONSTRAINT "PelayananDokter_id_user_fkey";

-- DropForeignKey
ALTER TABLE "PelayananRumahSakit" DROP CONSTRAINT "PelayananRumahSakit_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Spesialis" DROP CONSTRAINT "Spesialis_id_user_fkey";

-- AlterTable
ALTER TABLE "Dokter" DROP COLUMN "id_pelayanan_dokter",
DROP COLUMN "id_spesialis",
DROP COLUMN "id_user",
ADD COLUMN     "id_poli" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JadwalDokter" DROP COLUMN "id_user",
ADD COLUMN     "id_pelayanan" TEXT NOT NULL;

-- DropTable
DROP TABLE "PelayananDokter";

-- DropTable
DROP TABLE "PelayananRumahSakit";

-- DropTable
DROP TABLE "Spesialis";

-- CreateTable
CREATE TABLE "Pelayanan" (
    "id_pelayanan" TEXT NOT NULL,
    "nama_pelayanan" TEXT NOT NULL,
    "Persyaratan" TEXT NOT NULL,
    "Prosedur" TEXT NOT NULL,
    "JangkaWaktu" TEXT NOT NULL,
    "Biaya" DOUBLE PRECISION NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Pelayanan_pkey" PRIMARY KEY ("id_pelayanan")
);

-- CreateTable
CREATE TABLE "Poli" (
    "id_poli" TEXT NOT NULL,
    "nama_poli" TEXT NOT NULL,

    CONSTRAINT "Poli_pkey" PRIMARY KEY ("id_poli")
);

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_poli_fkey" FOREIGN KEY ("id_poli") REFERENCES "Poli"("id_poli") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_pelayanan_fkey" FOREIGN KEY ("id_pelayanan") REFERENCES "Pelayanan"("id_pelayanan") ON DELETE RESTRICT ON UPDATE CASCADE;
