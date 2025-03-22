/*
  Warnings:

  - You are about to drop the column `id_user_admin` on the `TanggalKerja` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `TanggalKerja` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TanggalKerja" DROP CONSTRAINT "TanggalKerja_id_user_admin_fkey";

-- AlterTable
ALTER TABLE "TanggalKerja" DROP COLUMN "id_user_admin",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TanggalKerja" ADD CONSTRAINT "TanggalKerja_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
