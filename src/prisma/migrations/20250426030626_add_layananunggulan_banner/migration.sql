-- CreateTable
CREATE TABLE "Banner" (
    "id_banner" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id_banner")
);

-- CreateTable
CREATE TABLE "LayananUnggulan" (
    "id_layanan_unggulan" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "caption" TEXT NOT NULL,

    CONSTRAINT "LayananUnggulan_pkey" PRIMARY KEY ("id_layanan_unggulan")
);
