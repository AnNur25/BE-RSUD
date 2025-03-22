/*
  Warnings:

  - You are about to drop the column `id_TanggalKerja` on the `Jamkerja` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Jamkerja" DROP CONSTRAINT "Jamkerja_id_TanggalKerja_fkey";

-- AlterTable
ALTER TABLE "Jamkerja" DROP COLUMN "id_TanggalKerja";
