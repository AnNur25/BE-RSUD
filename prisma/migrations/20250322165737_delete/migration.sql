/*
  Warnings:

  - You are about to drop the `TanggalKerja` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TanggalKerja" DROP CONSTRAINT "TanggalKerja_id_user_fkey";

-- DropTable
DROP TABLE "TanggalKerja";
