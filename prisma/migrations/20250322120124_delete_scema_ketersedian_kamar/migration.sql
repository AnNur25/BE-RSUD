/*
  Warnings:

  - You are about to drop the `Fasilitas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kamar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KelasRuanganNONSK` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KelasRuanganSK` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ruangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TempatTidur` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fasilitas" DROP CONSTRAINT "Fasilitas_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Fasilitas" DROP CONSTRAINT "Fasilitas_kelas_ruangan_NON_SK_id_fkey";

-- DropForeignKey
ALTER TABLE "Fasilitas" DROP CONSTRAINT "Fasilitas_kelas_ruangan_SK_id_fkey";

-- DropForeignKey
ALTER TABLE "Kamar" DROP CONSTRAINT "Kamar_id_kelas_ruangan_NON_SK_fkey";

-- DropForeignKey
ALTER TABLE "Kamar" DROP CONSTRAINT "Kamar_id_kelas_ruangan_SK_fkey";

-- DropForeignKey
ALTER TABLE "Kamar" DROP CONSTRAINT "Kamar_id_ruangan_fkey";

-- DropForeignKey
ALTER TABLE "Kamar" DROP CONSTRAINT "Kamar_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "KelasRuanganNONSK" DROP CONSTRAINT "KelasRuanganNONSK_id_user_fkey";

-- DropForeignKey
ALTER TABLE "KelasRuanganSK" DROP CONSTRAINT "KelasRuanganSK_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Ruangan" DROP CONSTRAINT "Ruangan_id_user_fkey";

-- DropForeignKey
ALTER TABLE "TempatTidur" DROP CONSTRAINT "TempatTidur_id_Kamar_fkey";

-- DropForeignKey
ALTER TABLE "TempatTidur" DROP CONSTRAINT "TempatTidur_id_user_PJ_fkey";

-- DropTable
DROP TABLE "Fasilitas";

-- DropTable
DROP TABLE "Kamar";

-- DropTable
DROP TABLE "KelasRuanganNONSK";

-- DropTable
DROP TABLE "KelasRuanganSK";

-- DropTable
DROP TABLE "Ruangan";

-- DropTable
DROP TABLE "TempatTidur";

-- DropEnum
DROP TYPE "JenisKelamin";

-- DropEnum
DROP TYPE "KetersedianTempatTidur";

-- DropEnum
DROP TYPE "lantaiRuangan";
