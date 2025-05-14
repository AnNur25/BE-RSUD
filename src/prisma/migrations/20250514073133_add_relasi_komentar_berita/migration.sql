-- CreateTable
CREATE TABLE "komentar" (
    "id_komentar" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "no_wa" TEXT NOT NULL,
    "isi_komentar" TEXT NOT NULL,
    "berita_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "komentar_pkey" PRIMARY KEY ("id_komentar")
);

-- AddForeignKey
ALTER TABLE "komentar" ADD CONSTRAINT "komentar_berita_id_fkey" FOREIGN KEY ("berita_id") REFERENCES "Berita"("id_berita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "komentar" ADD CONSTRAINT "komentar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;
