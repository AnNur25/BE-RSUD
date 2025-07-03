/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Dokter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Pelayanan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Dokter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Pelayanan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dokter" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pelayanan" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dokter_slug_key" ON "Dokter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pelayanan_slug_key" ON "Pelayanan"("slug");
