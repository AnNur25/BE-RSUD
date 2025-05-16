/*
  Warnings:

  - You are about to drop the `MediaSosial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `embed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `komentar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "komentar" DROP CONSTRAINT "komentar_berita_id_fkey";

-- DropForeignKey
ALTER TABLE "komentar" DROP CONSTRAINT "komentar_parentId_fkey";

-- DropForeignKey
ALTER TABLE "komentar" DROP CONSTRAINT "komentar_user_id_fkey";

-- DropTable
DROP TABLE "MediaSosial";

-- DropTable
DROP TABLE "embed";

-- DropTable
DROP TABLE "komentar";

-- CreateTable
CREATE TABLE "EmbedIg" (
    "id_embed" TEXT NOT NULL,
    "link_embed" TEXT NOT NULL,

    CONSTRAINT "EmbedIg_pkey" PRIMARY KEY ("id_embed")
);

-- CreateTable
CREATE TABLE "Komentar" (
    "id_komentar" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "no_wa" TEXT NOT NULL,
    "isi_komentar" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "berita_id" TEXT NOT NULL,
    "user_id" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Komentar_pkey" PRIMARY KEY ("id_komentar")
);

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Komentar"("id_komentar") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_berita_id_fkey" FOREIGN KEY ("berita_id") REFERENCES "Berita"("id_berita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;
