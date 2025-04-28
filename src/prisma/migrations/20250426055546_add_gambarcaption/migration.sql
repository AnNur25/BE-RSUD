/*
  Warnings:

  - You are about to drop the column `caption` on the `LayananUnggulan` table. All the data in the column will be lost.
  - You are about to drop the column `gambar` on the `LayananUnggulan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LayananUnggulan" DROP COLUMN "caption",
DROP COLUMN "gambar";

-- CreateTable
CREATE TABLE "GambarCaption" (
    "id" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "layananId" TEXT NOT NULL,

    CONSTRAINT "GambarCaption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GambarCaption" ADD CONSTRAINT "GambarCaption_layananId_fkey" FOREIGN KEY ("layananId") REFERENCES "LayananUnggulan"("id_layanan_unggulan") ON DELETE RESTRICT ON UPDATE CASCADE;
