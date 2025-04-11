-- DropForeignKey
ALTER TABLE "Dokter" DROP CONSTRAINT "Dokter_id_poli_fkey";

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_id_dokter_fkey";

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_poli_fkey" FOREIGN KEY ("id_poli") REFERENCES "Poli"("id_poli") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_dokter_fkey" FOREIGN KEY ("id_dokter") REFERENCES "Dokter"("id_dokter") ON DELETE CASCADE ON UPDATE CASCADE;
