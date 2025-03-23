/*
  Warnings:

  - The primary key for the `ResponAdmin` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ResponAdmin" DROP CONSTRAINT "ResponAdmin_pkey",
ALTER COLUMN "id_respon_admin" DROP DEFAULT,
ALTER COLUMN "id_respon_admin" SET DATA TYPE TEXT,
ADD CONSTRAINT "ResponAdmin_pkey" PRIMARY KEY ("id_respon_admin");
DROP SEQUENCE "ResponAdmin_id_respon_admin_seq";
