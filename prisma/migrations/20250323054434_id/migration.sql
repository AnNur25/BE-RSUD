/*
  Warnings:

  - The primary key for the `Aduan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Berita` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Dokter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Hari` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `JadwalDokter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Jamkerja` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PelayananDokter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PelayananRumahSakit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sesi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Spesialis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
ALTER TABLE "Hari" DROP CONSTRAINT "Hari_id_user_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_Hari_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_Sesi_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_dokter_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_jamkerja_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Jamkerja" DROP CONSTRAINT "Jamkerja_id_user_fkey";

-- DropForeignKey
ALTER TABLE "PelayananDokter" DROP CONSTRAINT "PelayananDokter_id_user_fkey";

-- DropForeignKey
ALTER TABLE "PelayananRumahSakit" DROP CONSTRAINT "PelayananRumahSakit_id_user_fkey";

-- DropForeignKey
ALTER TABLE "ResponAdmin" DROP CONSTRAINT "ResponAdmin_id_aduan_fkey";

-- DropForeignKey
ALTER TABLE "ResponAdmin" DROP CONSTRAINT "ResponAdmin_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Sesi" DROP CONSTRAINT "Sesi_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Spesialis" DROP CONSTRAINT "Spesialis_id_user_fkey";

-- AlterTable
ALTER TABLE "Aduan" DROP CONSTRAINT "Aduan_pkey",
ALTER COLUMN "id_aduan" DROP DEFAULT,
ALTER COLUMN "id_aduan" SET DATA TYPE TEXT,
ADD CONSTRAINT "Aduan_pkey" PRIMARY KEY ("id_aduan");
DROP SEQUENCE "Aduan_id_aduan_seq";

-- AlterTable
ALTER TABLE "Berita" DROP CONSTRAINT "Berita_pkey",
ALTER COLUMN "id_berita" DROP DEFAULT,
ALTER COLUMN "id_berita" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "Berita_pkey" PRIMARY KEY ("id_berita");
DROP SEQUENCE "Berita_id_berita_seq";

-- AlterTable
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_pkey",
ALTER COLUMN "id_dokter" DROP DEFAULT,
ALTER COLUMN "id_dokter" SET DATA TYPE TEXT,
ALTER COLUMN "id_pelayanan_dokter" DROP DEFAULT,
ALTER COLUMN "id_pelayanan_dokter" SET DATA TYPE TEXT,
ALTER COLUMN "id_spesialis" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "Dokter_pkey" PRIMARY KEY ("id_dokter");
DROP SEQUENCE "Dokter_id_dokter_seq";

-- AlterTable
ALTER TABLE "Hari" DROP CONSTRAINT "Hari_pkey",
ALTER COLUMN "id_Hari" DROP DEFAULT,
ALTER COLUMN "id_Hari" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "Hari_pkey" PRIMARY KEY ("id_Hari");
DROP SEQUENCE "Hari_id_Hari_seq";

-- AlterTable
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_pkey",
ALTER COLUMN "id_jadwal_dokter" DROP DEFAULT,
ALTER COLUMN "id_jadwal_dokter" SET DATA TYPE TEXT,
ALTER COLUMN "id_dokter" SET DATA TYPE TEXT,
ALTER COLUMN "id_jamkerja" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ALTER COLUMN "id_Hari" SET DATA TYPE TEXT,
ALTER COLUMN "id_Sesi" SET DATA TYPE TEXT,
ADD CONSTRAINT "JadwalDokter_pkey" PRIMARY KEY ("id_jadwal_dokter");
DROP SEQUENCE "JadwalDokter_id_jadwal_dokter_seq";

-- AlterTable
ALTER TABLE "Jamkerja" DROP CONSTRAINT "Jamkerja_pkey",
ALTER COLUMN "id_Jamkerja" DROP DEFAULT,
ALTER COLUMN "id_Jamkerja" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "Jamkerja_pkey" PRIMARY KEY ("id_Jamkerja");
DROP SEQUENCE "Jamkerja_id_Jamkerja_seq";

-- AlterTable
ALTER TABLE "PelayananDokter" DROP CONSTRAINT "PelayananDokter_pkey",
ALTER COLUMN "id_pelayanan_dokter" DROP DEFAULT,
ALTER COLUMN "id_pelayanan_dokter" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "PelayananDokter_pkey" PRIMARY KEY ("id_pelayanan_dokter");
DROP SEQUENCE "PelayananDokter_id_pelayanan_dokter_seq";

-- AlterTable
ALTER TABLE "PelayananRumahSakit" DROP CONSTRAINT "PelayananRumahSakit_pkey",
ALTER COLUMN "id_pelayananRS" DROP DEFAULT,
ALTER COLUMN "id_pelayananRS" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "PelayananRumahSakit_pkey" PRIMARY KEY ("id_pelayananRS");
DROP SEQUENCE "PelayananRumahSakit_id_pelayananRS_seq";

-- AlterTable
ALTER TABLE "ResponAdmin" ALTER COLUMN "id_aduan" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Sesi" DROP CONSTRAINT "Sesi_pkey",
ALTER COLUMN "id_Sesi" DROP DEFAULT,
ALTER COLUMN "id_Sesi" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sesi_pkey" PRIMARY KEY ("id_Sesi");
DROP SEQUENCE "Sesi_id_Sesi_seq";

-- AlterTable
ALTER TABLE "Spesialis" DROP CONSTRAINT "Spesialis_pkey",
ALTER COLUMN "id_Spesialis" DROP DEFAULT,
ALTER COLUMN "id_Spesialis" SET DATA TYPE TEXT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "Spesialis_pkey" PRIMARY KEY ("id_Spesialis");
DROP SEQUENCE "Spesialis_id_Spesialis_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id_user" DROP DEFAULT,
ALTER COLUMN "id_user" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id_user");
DROP SEQUENCE "User_id_user_seq";

-- AddForeignKey
ALTER TABLE "Berita" ADD CONSTRAINT "Berita_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_aduan_fkey" FOREIGN KEY ("id_aduan") REFERENCES "Aduan"("id_aduan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelayananRumahSakit" ADD CONSTRAINT "PelayananRumahSakit_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelayananDokter" ADD CONSTRAINT "PelayananDokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_spesialis_fkey" FOREIGN KEY ("id_spesialis") REFERENCES "Spesialis"("id_Spesialis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_pelayanan_dokter_fkey" FOREIGN KEY ("id_pelayanan_dokter") REFERENCES "PelayananDokter"("id_pelayanan_dokter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spesialis" ADD CONSTRAINT "Spesialis_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_dokter_fkey" FOREIGN KEY ("id_dokter") REFERENCES "Dokter"("id_dokter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_Sesi_fkey" FOREIGN KEY ("id_Sesi") REFERENCES "Sesi"("id_Sesi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_Hari_fkey" FOREIGN KEY ("id_Hari") REFERENCES "Hari"("id_Hari") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_jamkerja_fkey" FOREIGN KEY ("id_jamkerja") REFERENCES "Jamkerja"("id_Jamkerja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesi" ADD CONSTRAINT "Sesi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hari" ADD CONSTRAINT "Hari_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jamkerja" ADD CONSTRAINT "Jamkerja_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
