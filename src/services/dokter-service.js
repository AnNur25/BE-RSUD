const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const Pagination = require("../utils/pagination");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

class DokterService {
  static async createDokter({
    nama,
    biodata_singkat,
    link_linkedin,
    link_instagram,
    link_facebook,
    id_poli,
    file,
  }) {
    if (!nama || !id_poli || !biodata_singkat) {
      throw new BadRequestError(
        "Nama, id poli, dan biodata_singkat harus diisi"
      );
    }

    let imageUrl = null;

    if (file && file.path) {
      const originalFileSize = fs.statSync(file.path).size;
      console.log("Original file size (bytes):", originalFileSize);

      const resizedFolderPath = path.resolve(file.destination, "resized");

      // Buat folder 'resized' jika belum ada
      if (!fs.existsSync(resizedFolderPath)) {
        fs.mkdirSync(resizedFolderPath, { recursive: true });
      }

      // Ganti ekstensi ke .webp
      const webpFilename = file.filename.replace(
        path.extname(file.filename),
        ".webp"
      );

      const resizedImagePath = path.resolve(resizedFolderPath, webpFilename);

      // Resize dan convert ke .webp
      await sharp(file.path).webp({ quality: 50 }).toFile(resizedImagePath);

      const resizedFileSize = fs.statSync(resizedImagePath).size;
      console.log("Resized file size (bytes):", resizedFileSize);

      // Hapus file sementara hasil upload multer
      fs.unlinkSync(file.path);

      // URL untuk akses gambar dari frontend
      imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${webpFilename}`;
      console.log("Image resized and uploaded to:", imageUrl);
    }

    const addData = await prisma.dokter.create({
      data: {
        nama,
        gambar: imageUrl,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
        poli: {
          connect: { id_poli },
        },
      },
    });

    return {
      id: addData.id_dokter,
      nama: addData.nama,
    };
  }

  static async searchDokter({ page, pageSize, keyword }) {
    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);
    if (!keyword) {
      throw new BadRequestError("Keyword pencarian harus diisi");
    }

    const totalItems = await prisma.dokter.count({
      where: {
        OR: [
          {
            nama: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            poli: {
              nama_poli: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    });
    const result = await prisma.dokter.findMany({
      skip,
      take,
      where: {
        OR: [
          {
            nama: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            poli: {
              nama_poli: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        poli: true,
      },
    });
    if (!result || result.length === 0) {
      throw new NotFoundError("data dokter tidak tersedia");
    }
    const mappedResult = result.map((dokter) => ({
      id_dokter: dokter.id_dokter,
      nama: dokter.nama,
      gambar: dokter.gambar,
      biodata_singkat: dokter.biodata_singkat,
      link_linkedin: dokter.link_linkedin,
      link_instagram: dokter.link_instagram,
      link_facebook: dokter.link_facebook,
      poli: {
        id_poli: dokter.poli.id_poli,
        nama_poli: dokter.poli.nama_poli,
      },
    }));

    const totalPages = Math.ceil(totalItems / currentPageSize);
    return {
      Dokter: mappedResult,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages,
      },
    };
  }
  static async getDokter(page, pageSize) {
    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);

    const totalItems = await prisma.dokter.count();
    const dokter = await prisma.dokter.findMany({
      skip,
      take,
      select: {
        id_dokter: true,
        nama: true,
        gambar: true,
        biodata_singkat: true,
        link_linkedin: true,
        link_instagram: true,
        link_facebook: true,
        poli: {
          select: {
            id_poli: true,
            nama_poli: true,
          },
        },
      },
    });
    if (!dokter || dokter.length === 0) {
      throw new NotFoundError("Data Dokter Kosong");
    }
    const totalPages = Math.ceil(totalItems / currentPageSize);
    return {
      Dokter: dokter,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages,
      },
    };
  }

  static async getDokterById(id_dokter) {
    if (!id_dokter) {
      throw new BadRequestError("ID Dokter harus disertakan");
    }

    const dokter = await prisma.dokter.findUnique({
      where: { id_dokter: id_dokter },
      include: {
        poli: true,
      },
    });

    if (!dokter) {
      throw new NotFoundError(`Dokter dengan ID ${id_dokter} tidak ditemukan`);
    }

    return {
      dokter: {
        id_dokter: dokter.id_dokter,
        nama: dokter.nama,
        gambar: dokter.gambar,
        biodata_singkat: dokter.biodata_singkat,
        link_linkedin: dokter.link_linkedin,
        link_instagram: dokter.link_instagram,
        link_facebook: dokter.link_facebook,
        poli: {
          id_poli: dokter.poli?.id_poli,
          nama_poli: dokter.poli?.nama_poli,
        },
      },
    };
  }

  static async updateDokter({
    id_dokter,
    nama,
    biodata_singkat,
    link_linkedin,
    link_instagram,
    link_facebook,
    id_poli,
    file,
  }) {
    // Validasi data wajib
    if (!id_dokter || !nama || !id_poli || !biodata_singkat) {
      throw new BadRequestError(
        "ID Dokter, biodata_singkat, Nama, dan ID Poli harus diisi"
      );
    }

    // Cek apakah dokter dan poli tersedia
    const dokter = await prisma.dokter.findUnique({ where: { id_dokter } });
    const poli = await prisma.poli.findUnique({ where: { id_poli } });

    if (!dokter || !poli) {
      throw new NotFoundError("Poli atau dokter tidak ditemukan");
    }

    // Gunakan gambar lama jika tidak ada gambar baru
    let imageUrl = dokter.gambar;

    // Proses upload gambar baru
    if (file && file.path) {
      // Hapus gambar lama jika ada
      if (dokter.gambar && dokter.gambar.includes("/uploads/resized/")) {
        const oldImageFilename = path.basename(dokter.gambar);
        const oldImagePath = path.resolve(
          file.destination,
          "resized",
          oldImageFilename
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Logging ukuran file asli
      const originalFileSize = fs.statSync(file.path).size;
      console.log("Original file size (bytes):", originalFileSize);
      // Ganti ekstensi ke .webp
      const newFilename = `${path.parse(file.filename).name}.webp`;

      const resizedImagePath = path.resolve(
        file.destination,
        "resized",
        newFilename
      );

      // Konversi ke .webp
      await sharp(file.path).webp({ quality: 50 }).toFile(resizedImagePath);
      // Logging ukuran file hasil resize
      const resizedFileSize = fs.statSync(resizedImagePath).size;
      console.log("Resized file size (bytes):", resizedFileSize);

      // Hapus file asli
      fs.unlinkSync(file.path);

      // Path yang bisa diakses frontend
      imageUrl = `${process.env.BASE_URL}/uploads/resized/${newFilename}`;
    }

    // Update data dokter
    const updated = await prisma.dokter.update({
      where: { id_dokter },
      data: {
        nama,
        gambar: imageUrl,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
        poli: { connect: { id_poli } },
      },
    });

    return {
      id: updated.id_dokter,
      nama: updated.nama,
    };
  }

  static async deleteDokter({ id_dokter }) {
    // Cek dulu apakah dokter ada
    const dokter = await prisma.dokter.findUnique({ where: { id_dokter } });

    if (!dokter) {
      throw new NotFoundError("Dokter tidak ditemukan");
    }

    // Jika ada gambar yang tersimpan, hapus dari folder lokal
    if (dokter.gambar && dokter.gambar.includes("/uploads/resized/")) {
      const oldImageFilename = path.basename(dokter.gambar); // ambil nama file saja
      const oldImagePath = path.resolve("uploads", "resized", oldImageFilename); // path lokal

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("Gambar berhasil dihapus dari folder:", oldImageFilename);
      } else {
        console.log(
          "Gambar tidak ditemukan di folder lokal:",
          oldImageFilename
        );
      }
    }

    // Hapus data dokter dari database
    await prisma.dokter.delete({ where: { id_dokter } });

    return { message: "Dokter berhasil dihapus" };
  }
}

module.exports = DokterService;
