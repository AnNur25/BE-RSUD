/*
  Warnings:

  - You are about to drop the column `id_hari_sesi` on the `JadwalDokter` table. All the data in the column will be lost.
  - You are about to drop the `HariSesi` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_Hari` to the `JadwalDokter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_Sesi` to the `JadwalDokter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HariSesi" DROP CONSTRAINT "HariSesi_id_user_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_hari_sesi_fkey";

-- AlterTable
ALTER TABLE "JadwalDokter" DROP COLUMN "id_hari_sesi",
ADD COLUMN     "id_Hari" INTEGER NOT NULL,
ADD COLUMN     "id_Sesi" INTEGER NOT NULL;

-- DropTable
DROP TABLE "HariSesi";

-- DropEnum
DROP TYPE "Sesi";

-- CreateTable
CREATE TABLE "Sesi" (
    "id_Sesi" SERIAL NOT NULL,
    "sesi" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "Sesi_pkey" PRIMARY KEY ("id_Sesi")
);

-- CreateTable
CREATE TABLE "Hari" (
    "id_Hari" SERIAL NOT NULL,
    "hari" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "Hari_pkey" PRIMARY KEY ("id_Hari")
);

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_Sesi_fkey" FOREIGN KEY ("id_Sesi") REFERENCES "Sesi"("id_Sesi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_Hari_fkey" FOREIGN KEY ("id_Hari") REFERENCES "Hari"("id_Hari") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesi" ADD CONSTRAINT "Sesi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hari" ADD CONSTRAINT "Hari_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
