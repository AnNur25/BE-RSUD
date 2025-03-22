/*
  Warnings:

  - You are about to drop the column `id_user_admin` on the `Berita` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `Dokter` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `Fasilitas` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `HariSesi` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `JadwalDokter` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `Jamkerja` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `KelasRuanganNONSK` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `KelasRuanganSK` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `PelayananDokter` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `ResponAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `Ruangan` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_admin` on the `Spesialis` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `Berita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Dokter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Fasilitas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `HariSesi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `JadwalDokter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Jamkerja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `KelasRuanganNONSK` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `KelasRuanganSK` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `PelayananDokter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `ResponAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Ruangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Spesialis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Berita" DROP CONSTRAINT "Berita_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "Fasilitas" DROP CONSTRAINT "Fasilitas_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "HariSesi" DROP CONSTRAINT "HariSesi_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "Jamkerja" DROP CONSTRAINT "Jamkerja_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "KelasRuanganNONSK" DROP CONSTRAINT "KelasRuanganNONSK_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "KelasRuanganSK" DROP CONSTRAINT "KelasRuanganSK_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "PelayananDokter" DROP CONSTRAINT "PelayananDokter_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "ResponAdmin" DROP CONSTRAINT "ResponAdmin_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "Ruangan" DROP CONSTRAINT "Ruangan_id_user_admin_fkey";

-- DropForeignKey
ALTER TABLE "Spesialis" DROP CONSTRAINT "Spesialis_id_user_admin_fkey";

-- AlterTable
ALTER TABLE "Berita" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Dokter" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL,
ALTER COLUMN "id_pelayanan_dokter" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Fasilitas" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HariSesi" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "JadwalDokter" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Jamkerja" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "KelasRuanganNONSK" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "KelasRuanganSK" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PelayananDokter" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ResponAdmin" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ruangan" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Spesialis" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "KelasRuanganSK" ADD CONSTRAINT "KelasRuanganSK_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelasRuanganNONSK" ADD CONSTRAINT "KelasRuanganNONSK_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fasilitas" ADD CONSTRAINT "Fasilitas_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Berita" ADD CONSTRAINT "Berita_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelayananDokter" ADD CONSTRAINT "PelayananDokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spesialis" ADD CONSTRAINT "Spesialis_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HariSesi" ADD CONSTRAINT "HariSesi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jamkerja" ADD CONSTRAINT "Jamkerja_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
