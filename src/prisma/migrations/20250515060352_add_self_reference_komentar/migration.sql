-- AlterTable
ALTER TABLE "komentar" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "komentar" ADD CONSTRAINT "komentar_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "komentar"("id_komentar") ON DELETE SET NULL ON UPDATE CASCADE;
