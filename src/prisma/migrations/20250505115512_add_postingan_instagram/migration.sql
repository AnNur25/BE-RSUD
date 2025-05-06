-- AlterTable
ALTER TABLE "GambarCaption" ALTER COLUMN "nama_file" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Postingan" (
    "id" SERIAL NOT NULL,
    "caption" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "post_to_instagram" BOOLEAN NOT NULL DEFAULT false,
    "instagram_post_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Postingan_pkey" PRIMARY KEY ("id")
);
