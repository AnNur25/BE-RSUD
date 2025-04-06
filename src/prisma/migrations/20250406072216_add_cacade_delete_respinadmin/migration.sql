-- DropForeignKey
ALTER TABLE "ResponAdmin" DROP CONSTRAINT "ResponAdmin_id_aduan_fkey";

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_aduan_fkey" FOREIGN KEY ("id_aduan") REFERENCES "Aduan"("id_aduan") ON DELETE CASCADE ON UPDATE CASCADE;
