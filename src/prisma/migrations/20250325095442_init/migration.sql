-- CreateEnum
CREATE TYPE "Hari" AS ENUM ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id_berita" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "ringkasan" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "gambar_sampul" TEXT NOT NULL,
    "tanggal_terbit" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id_berita")
);

-- CreateTable
CREATE TABLE "Gambar" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "beritaId" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Gambar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aduan" (
    "id_aduan" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "no_wa" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Aduan_pkey" PRIMARY KEY ("id_aduan")
);

-- CreateTable
CREATE TABLE "ResponAdmin" (
    "id_respon_admin" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" TEXT NOT NULL,
    "id_aduan" TEXT NOT NULL,

    CONSTRAINT "ResponAdmin_pkey" PRIMARY KEY ("id_respon_admin")
);

-- CreateTable
CREATE TABLE "PelayananRumahSakit" (
    "id_pelayananRS" TEXT NOT NULL,
    "Persyaratan" TEXT NOT NULL,
    "Prosedur" TEXT NOT NULL,
    "JangkaWaktu" TEXT NOT NULL,
    "Biaya" DOUBLE PRECISION NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "PelayananRumahSakit_pkey" PRIMARY KEY ("id_pelayananRS")
);

-- CreateTable
CREATE TABLE "PelayananDokter" (
    "id_pelayanan_dokter" TEXT NOT NULL,
    "nama_pelayanan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "PelayananDokter_pkey" PRIMARY KEY ("id_pelayanan_dokter")
);

-- CreateTable
CREATE TABLE "Dokter" (
    "id_dokter" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_spesialis" TEXT NOT NULL,
    "id_pelayanan_dokter" TEXT NOT NULL,

    CONSTRAINT "Dokter_pkey" PRIMARY KEY ("id_dokter")
);

-- CreateTable
CREATE TABLE "Spesialis" (
    "id_Spesialis" TEXT NOT NULL,
    "nama_spesialis" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Spesialis_pkey" PRIMARY KEY ("id_Spesialis")
);

-- CreateTable
CREATE TABLE "JadwalDokter" (
    "id_jadwal_dokter" TEXT NOT NULL,
    "id_dokter" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "hari" "Hari" NOT NULL,
    "sesi" TEXT NOT NULL,
    "jam_mulai" TEXT NOT NULL,
    "jam_selesai" TEXT NOT NULL,

    CONSTRAINT "JadwalDokter_pkey" PRIMARY KEY ("id_jadwal_dokter")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Berita" ADD CONSTRAINT "Berita_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gambar" ADD CONSTRAINT "Gambar_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gambar" ADD CONSTRAINT "Gambar_beritaId_fkey" FOREIGN KEY ("beritaId") REFERENCES "Berita"("id_berita") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_aduan_fkey" FOREIGN KEY ("id_aduan") REFERENCES "Aduan"("id_aduan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelayananRumahSakit" ADD CONSTRAINT "PelayananRumahSakit_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelayananDokter" ADD CONSTRAINT "PelayananDokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_spesialis_fkey" FOREIGN KEY ("id_spesialis") REFERENCES "Spesialis"("id_Spesialis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_pelayanan_dokter_fkey" FOREIGN KEY ("id_pelayanan_dokter") REFERENCES "PelayananDokter"("id_pelayanan_dokter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spesialis" ADD CONSTRAINT "Spesialis_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_dokter_fkey" FOREIGN KEY ("id_dokter") REFERENCES "Dokter"("id_dokter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
