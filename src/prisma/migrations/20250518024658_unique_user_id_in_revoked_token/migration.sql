/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `RevokedToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RevokedToken_user_id_key" ON "RevokedToken"("user_id");
