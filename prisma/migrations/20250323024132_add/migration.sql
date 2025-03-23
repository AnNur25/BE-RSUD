/*
  Warnings:

  - You are about to drop the column `hari` on the `Hari` table. All the data in the column will be lost.
  - Added the required column `hari_mulai` to the `Hari` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hari_selesai` to the `Hari` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hari" DROP COLUMN "hari",
ADD COLUMN     "hari_mulai" TEXT NOT NULL,
ADD COLUMN     "hari_selesai" TEXT NOT NULL;
