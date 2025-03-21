/*
  Warnings:

  - You are about to drop the column `pelayanan_dokter_id` on the `Dokter` table. All the data in the column will be lost.
  - You are about to drop the column `spesialis_id` on the `Dokter` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `id_pelayanan_dokter` to the `Dokter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_spesialis` to the `Dokter` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sesi" AS ENUM ('Pagi', 'Sore', 'Malam');

-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_pelayanan_dokter_id_fkey";

-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_spesialis_id_fkey";

-- AlterTable
ALTER TABLE "Dokter" DROP COLUMN "pelayanan_dokter_id",
DROP COLUMN "spesialis_id",
ADD COLUMN     "id_pelayanan_dokter" INTEGER NOT NULL,
ADD COLUMN     "id_spesialis" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropEnum
DROP TYPE "userRole";

-- CreateTable
CREATE TABLE "JadwalDokter" (
    "id_jadwal_dokter" SERIAL NOT NULL,
    "id_hari_sesi" INTEGER NOT NULL,
    "id_dokter" INTEGER NOT NULL,
    "id_jamkerja" INTEGER NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "JadwalDokter_pkey" PRIMARY KEY ("id_jadwal_dokter")
);

-- CreateTable
CREATE TABLE "HariSesi" (
    "id_HariSesi" SERIAL NOT NULL,
    "hari" TEXT NOT NULL,
    "sesi" "Sesi" NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "HariSesi_pkey" PRIMARY KEY ("id_HariSesi")
);

-- CreateTable
CREATE TABLE "Jamkerja" (
    "id_Jamkerja" SERIAL NOT NULL,
    "jam_mulai" TIMESTAMP(3) NOT NULL,
    "jam_selesai" TIMESTAMP(3) NOT NULL,
    "id_user_admin" INTEGER NOT NULL,
    "id_TanggalKerja" INTEGER NOT NULL,

    CONSTRAINT "Jamkerja_pkey" PRIMARY KEY ("id_Jamkerja")
);

-- CreateTable
CREATE TABLE "TanggalKerja" (
    "id_TanggalKerja" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "TanggalKerja_pkey" PRIMARY KEY ("id_TanggalKerja")
);

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_spesialis_fkey" FOREIGN KEY ("id_spesialis") REFERENCES "Spesialis"("id_Spesialis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_pelayanan_dokter_fkey" FOREIGN KEY ("id_pelayanan_dokter") REFERENCES "PelayananDokter"("id_pelayanan_dokter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_dokter_fkey" FOREIGN KEY ("id_dokter") REFERENCES "Dokter"("id_dokter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_hari_sesi_fkey" FOREIGN KEY ("id_hari_sesi") REFERENCES "HariSesi"("id_HariSesi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_jamkerja_fkey" FOREIGN KEY ("id_jamkerja") REFERENCES "Jamkerja"("id_Jamkerja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HariSesi" ADD CONSTRAINT "HariSesi_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jamkerja" ADD CONSTRAINT "Jamkerja_id_TanggalKerja_fkey" FOREIGN KEY ("id_TanggalKerja") REFERENCES "TanggalKerja"("id_TanggalKerja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jamkerja" ADD CONSTRAINT "Jamkerja_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TanggalKerja" ADD CONSTRAINT "TanggalKerja_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
