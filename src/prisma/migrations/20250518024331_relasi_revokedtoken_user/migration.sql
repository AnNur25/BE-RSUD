/*
  Warnings:

  - Added the required column `user_id` to the `RevokedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RevokedToken" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RevokedToken" ADD CONSTRAINT "RevokedToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
