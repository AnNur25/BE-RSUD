/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `Berita` table. All the data in the column will be lost.
  - You are about to drop the column `gambar` on the `Berita` table. All the data in the column will be lost.
  - Added the required column `gambar_sampul` to the `Berita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isi` to the `Berita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ringkasan` to the `Berita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Berita" DROP COLUMN "deskripsi",
DROP COLUMN "gambar",
ADD COLUMN     "gambar_sampul" TEXT NOT NULL,
ADD COLUMN     "isi" TEXT NOT NULL,
ADD COLUMN     "ringkasan" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Gambar" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "beritaId" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Gambar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gambar" ADD CONSTRAINT "Gambar_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gambar" ADD CONSTRAINT "Gambar_beritaId_fkey" FOREIGN KEY ("beritaId") REFERENCES "Berita"("id_berita") ON DELETE CASCADE ON UPDATE CASCADE;
