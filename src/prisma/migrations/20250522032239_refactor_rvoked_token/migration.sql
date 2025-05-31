/*
  Warnings:

  - The primary key for the `RevokedToken` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "RevokedToken" DROP CONSTRAINT "RevokedToken_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RevokedToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RevokedToken_id_seq";
