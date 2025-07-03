/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Berita` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Berita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Berita" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");
