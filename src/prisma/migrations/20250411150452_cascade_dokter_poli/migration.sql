-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_id_poli_fkey";

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_poli_fkey" FOREIGN KEY ("id_poli") REFERENCES "Poli"("id_poli") ON DELETE CASCADE ON UPDATE CASCADE;
