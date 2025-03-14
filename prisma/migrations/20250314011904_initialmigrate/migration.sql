-- CreateEnum
CREATE TYPE "KetersedianTempatTidur" AS ENUM ('Tersedia', 'Rusak', 'Terpakai');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('P', 'L');

-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('ADMIN', 'PJ');

-- CreateEnum
CREATE TYPE "lantaiRuangan" AS ENUM ('lantai_1', 'lantai_2', 'lantai_3');

-- CreateTable
CREATE TABLE "Kamar" (
    "id_Kamar" SERIAL NOT NULL,
    "Total_tempat_tidur" INTEGER NOT NULL,
    "biaya" DOUBLE PRECISION NOT NULL,
    "total_bad_laki_laki" INTEGER NOT NULL,
    "total_bad_perempuan" INTEGER NOT NULL,
    "total_bad_umum" INTEGER NOT NULL,
    "jumlah_tersedia_tempat_tidur" INTEGER NOT NULL DEFAULT 0,
    "id_ruangan" INTEGER NOT NULL,
    "id_kelas_ruangan_SK" INTEGER NOT NULL,
    "id_kelas_ruangan_NON_SK" INTEGER NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "Kamar_pkey" PRIMARY KEY ("id_Kamar")
);

-- CreateTable
CREATE TABLE "TempatTidur" (
    "id_TempatTidur" SERIAL NOT NULL,
    "status" "KetersedianTempatTidur" NOT NULL,
    "no_tempat_tidur" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "id_Kamar" INTEGER NOT NULL,
    "id_user_PJ" INTEGER NOT NULL,

    CONSTRAINT "TempatTidur_pkey" PRIMARY KEY ("id_TempatTidur")
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "userRole" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "KelasRuanganSK" (
    "id_kelas_ruangan_SK" SERIAL NOT NULL,
    "nama_kelas" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "KelasRuanganSK_pkey" PRIMARY KEY ("id_kelas_ruangan_SK")
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id_ruangan" SERIAL NOT NULL,
    "nama_ruangan" TEXT NOT NULL,
    "lantai" "lantaiRuangan" NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id_ruangan")
);

-- CreateTable
CREATE TABLE "KelasRuanganNONSK" (
    "id_kelas_ruangan_NON_SK" SERIAL NOT NULL,
    "nama_kelas" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "KelasRuanganNONSK_pkey" PRIMARY KEY ("id_kelas_ruangan_NON_SK")
);

-- CreateTable
CREATE TABLE "Fasilitas" (
    "id_fasilitas" SERIAL NOT NULL,
    "TV" BOOLEAN NOT NULL,
    "AC" BOOLEAN NOT NULL,
    "kamar_mandi_dalam" BOOLEAN NOT NULL,
    "wifi" BOOLEAN NOT NULL,
    "meja_kursi" BOOLEAN NOT NULL,
    "lemari" BOOLEAN NOT NULL,
    "kipas_angin" BOOLEAN NOT NULL,
    "kelas_ruangan_SK_id" INTEGER NOT NULL,
    "kelas_ruangan_NON_SK_id" INTEGER NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "Fasilitas_pkey" PRIMARY KEY ("id_fasilitas")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id_berita" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id_berita")
);

-- CreateTable
CREATE TABLE "Aduan" (
    "id_aduan" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "no_wa" TEXT NOT NULL,

    CONSTRAINT "Aduan_pkey" PRIMARY KEY ("id_aduan")
);

-- CreateTable
CREATE TABLE "ResponAdmin" (
    "id_respon_admin" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user_admin" INTEGER NOT NULL,
    "id_aduan" INTEGER NOT NULL,

    CONSTRAINT "ResponAdmin_pkey" PRIMARY KEY ("id_respon_admin")
);

-- CreateTable
CREATE TABLE "PelayananDokter" (
    "id_pelayanan_dokter" SERIAL NOT NULL,
    "nama_pelayanan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "PelayananDokter_pkey" PRIMARY KEY ("id_pelayanan_dokter")
);

-- CreateTable
CREATE TABLE "Dokter" (
    "id_dokter" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "id_user_admin" INTEGER NOT NULL,
    "spesialis_id" INTEGER NOT NULL,
    "pelayanan_dokter_id" INTEGER NOT NULL,

    CONSTRAINT "Dokter_pkey" PRIMARY KEY ("id_dokter")
);

-- CreateTable
CREATE TABLE "Spesialis" (
    "id_Spesialis" SERIAL NOT NULL,
    "nama_spesialis" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "id_user_admin" INTEGER NOT NULL,

    CONSTRAINT "Spesialis_pkey" PRIMARY KEY ("id_Spesialis")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Kamar" ADD CONSTRAINT "Kamar_id_ruangan_fkey" FOREIGN KEY ("id_ruangan") REFERENCES "Ruangan"("id_ruangan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kamar" ADD CONSTRAINT "Kamar_id_kelas_ruangan_SK_fkey" FOREIGN KEY ("id_kelas_ruangan_SK") REFERENCES "KelasRuanganSK"("id_kelas_ruangan_SK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kamar" ADD CONSTRAINT "Kamar_id_kelas_ruangan_NON_SK_fkey" FOREIGN KEY ("id_kelas_ruangan_NON_SK") REFERENCES "KelasRuanganNONSK"("id_kelas_ruangan_NON_SK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kamar" ADD CONSTRAINT "Kamar_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempatTidur" ADD CONSTRAINT "TempatTidur_id_Kamar_fkey" FOREIGN KEY ("id_Kamar") REFERENCES "Kamar"("id_Kamar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempatTidur" ADD CONSTRAINT "TempatTidur_id_user_PJ_fkey" FOREIGN KEY ("id_user_PJ") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelasRuanganSK" ADD CONSTRAINT "KelasRuanganSK_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KelasRuanganNONSK" ADD CONSTRAINT "KelasRuanganNONSK_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fasilitas" ADD CONSTRAINT "Fasilitas_kelas_ruangan_SK_id_fkey" FOREIGN KEY ("kelas_ruangan_SK_id") REFERENCES "KelasRuanganSK"("id_kelas_ruangan_SK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fasilitas" ADD CONSTRAINT "Fasilitas_kelas_ruangan_NON_SK_id_fkey" FOREIGN KEY ("kelas_ruangan_NON_SK_id") REFERENCES "KelasRuanganNONSK"("id_kelas_ruangan_NON_SK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fasilitas" ADD CONSTRAINT "Fasilitas_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Berita" ADD CONSTRAINT "Berita_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_aduan_fkey" FOREIGN KEY ("id_aduan") REFERENCES "Aduan"("id_aduan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponAdmin" ADD CONSTRAINT "ResponAdmin_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PelayananDokter" ADD CONSTRAINT "PelayananDokter_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_spesialis_id_fkey" FOREIGN KEY ("spesialis_id") REFERENCES "Spesialis"("id_Spesialis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_pelayanan_dokter_id_fkey" FOREIGN KEY ("pelayanan_dokter_id") REFERENCES "PelayananDokter"("id_pelayanan_dokter") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokter" ADD CONSTRAINT "Dokter_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spesialis" ADD CONSTRAINT "Spesialis_id_user_admin_fkey" FOREIGN KEY ("id_user_admin") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
