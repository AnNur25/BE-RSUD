const prisma = require("../prisma/prismaClient");
const {
  BadRequestError,
  NotFoundError,
} = require("../utils/error-handling-utils");
const Pagination = require("../utils//pagination-utils");
const path = require("path"); //salah satu properti dari object file yang menunjuk ke lokasi file di disk/server
const sharp = require("sharp");
const fs = require("fs");
const generateUniqueSlug = require("../utils/slug-judul-berita");

class BeritaService {
  static async createBerita({ judul, ringkasan, isi, file, tanggal_berita }) {
    const slug = await generateUniqueSlug(judul);
    if (!file || !judul || !ringkasan || !isi || !tanggal_berita) {
      // Jika file sudah terupload tapi data tidak lengkap, hapus file supaya gak numpuk
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestError("Kolom tidak boleh kosong");
    }

    console.log("File received:", file);
    let imageUrl = null;
    const resizedFolderPath = path.resolve(file.destination, "resized");

    if (!fs.existsSync(resizedFolderPath)) {
      fs.mkdirSync(resizedFolderPath, { recursive: true });
    }

    try {
      if (file && file.path) {
        const originalFileSize = fs.statSync(file.path).size;
        console.log("Original file size (bytes):", originalFileSize);

        // Buat nama file baru dengan ekstensi .webp
        const extWebpFilename = file.filename.replace(
          path.extname(file.filename),
          ".webp"
        );
        const resizedImagePath = path.resolve(
          file.destination,
          "resized",
          extWebpFilename
        );

        await sharp(file.path).webp({ quality: 50 }).toFile(resizedImagePath);

        const resizedFileSize = fs.statSync(resizedImagePath).size;
        console.log("Resized file size (bytes):", resizedFileSize);

        // Hapus file asli yang belum diresize
        fs.unlinkSync(file.path);

        imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${extWebpFilename}`;
        console.log("Image resized and uploaded to:", imageUrl);
      }

      const beritaBaru = await prisma.berita.create({
        data: {
          judul,
          slug,
          ringkasan,
          isi,
          tanggal_berita,
          gambar_sampul: imageUrl,
        },
      });

      return {
        id: beritaBaru.id_berita,
        judul: beritaBaru.judul,
        slug: beritaBaru.slug,
        tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(beritaBaru.tanggal_berita)),
        tanggal_default: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(beritaBaru.createdAt)),
      };
    } catch (error) {
      // Kalau error, pastikan file yang diupload dihapus biar gak numpuk
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  static async getBerita(page, pageSize) {
    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);

    const totalItems = await prisma.berita.count();

    const berita = await prisma.berita.findMany({
      skip,
      take,
      include: { gambar_tambahan: true },
    });

    if (berita.length === 0) {
      throw new BadRequestError(
        "Oops! Tidak ada berita yang tersedia saat ini"
      );
    }
    const potongKalimat = (kalimat, maxKata) => {
      const kata = kalimat.split(" ");
      if (kata.length <= maxKata) return kalimat;
      return kata.slice(0, maxKata).join(" ") + " ...";
    };

    const beritaData = berita.map((berita) => ({
      id: berita.id_berita,
      judul: potongKalimat(berita.judul, 8),
      slug: berita.slug,
      ringkasan: potongKalimat(berita.ringkasan, 20),
      gambar_sampul: berita.gambar_sampul,
      tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(berita.tanggal_berita)),
      tanggal_default: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(berita.createdAt)),
    }));

    const totalPages = Math.ceil(totalItems / currentPageSize);

    return {
      berita: beritaData,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages,
      },
    };
  }
  static async getBeritaBySlug({ slug }) {
    if (!slug) {
      throw new NotFoundError("slug Berita tidak ditemukan");
    }
    const berita = await prisma.berita.findUnique({
      where: { slug: slug },
      include: { gambar_tambahan: true },
    });
    if (!berita) {
      throw new NotFoundError("Oops! detail berita tidak ditemukan");
    }
    return {
      id: berita.id_berita,
      judul: berita.judul,
      slug: berita.slug,
      ringkasan: berita.ringkasan,
      isi: berita.isi,
      gambar_sampul: berita.gambar_sampul,
      tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(berita.tanggal_berita)),
      tanggal_default: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(berita.createdAt)),
      gambar_tambahan: berita.gambar_tambahan.map((gambar) => gambar.url),
    };
  }
  static async updateBerita({
    id,
    judul,
    ringkasan,
    isi,
    file,
    tanggal_berita,
  }) {
    if (!id || !judul || !ringkasan || !isi || !tanggal_berita) {
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestError("kolom tidak boleh kosong");
    }

    const berita = await prisma.berita.findUnique({
      where: { id_berita: id },
    });
    if (!berita) {
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new NotFoundError("Id Berita tidak ditemukan");
    }

    let imageUrl = berita.gambar_sampul;

    try {
      if (file && file.path) {
        const originalFileSize = fs.statSync(file.path).size;
        console.log("Original file size (bytes):", originalFileSize);

        const extWebpFilename = file.filename.replace(
          path.extname(file.filename),
          ".webp"
        );
        const resizedImagePath = path.resolve(
          file.destination,
          "resized",
          extWebpFilename
        );

        await sharp(file.path).webp({ quality: 50 }).toFile(resizedImagePath);

        const resizedFileSize = fs.statSync(resizedImagePath).size;
        console.log("Resized file size (bytes):", resizedFileSize);

        fs.unlinkSync(file.path);

        // Hapus gambar lama kalau ada
        if (berita.gambar_sampul) {
          const oldImagePath = path.resolve(
            __dirname, // atau path ke folder server kamu sesuai struktur
            "../../uploads/resized",
            path.basename(berita.gambar_sampul)
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("Gambar lama berhasil dihapus:", oldImagePath);
          }
        }

        imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${extWebpFilename}`;
        console.log("Image resized and uploaded to:", imageUrl);
      }

      const updatedBerita = await prisma.berita.update({
        where: { id_berita: id },
        data: {
          judul,
          ringkasan,
          isi,
          tanggal_berita,
          gambar_sampul: imageUrl,
        },
      });

      return {
        id: updatedBerita.id_berita,
        judul: updatedBerita.judul,
        tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(updatedBerita.tanggal_berita)),
        tanggal_default: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(updatedBerita.createdAt)),
      };
    } catch (error) {
      // Jika error, hapus file baru yang sudah diupload (resized)
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  static async deleteBerita({ id }) {
    const berita = await prisma.berita.findUnique({ where: { id_berita: id } });
    if (!berita) {
      throw new NotFoundError("Id Berita tidak ditemukan");
    }

    await prisma.berita.delete({
      where: { id_berita: id },
    });
    return null;
  }
  static async getGambarByBerita({ slug }) {
    if (!slug) {
      throw new BadRequestError("ID Berita tidak ditemukan");
    }
    const gambarList = await prisma.gambar.findMany({
      where: { berita: { slug } },
      select: {
        id: true,
        url: true,
        berita: {
          select: {
            slug: true,
          },
        },
      },
    });
    if (gambarList.length === 0) {
      throw new NotFoundError("Ops, galeri kosong");
    }

    return gambarList;
  }
  static async uploadGambar({ slug, files }) {
    if (!slug) {
      throw new BadRequestError("slug Berita tidak ditemukan");
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestError("Tidak ada file gambar yang diupload");
    }

    console.log("Mencari berita dengan slug:", slug);

    const berita = await prisma.berita.findUnique({
      where: { slug: slug },
    });

    if (!berita) {
      // Hapus semua file yang diupload sebelum error
      files.forEach((file) => {
        if (file && file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      throw new NotFoundError("Berita tidak ditemukan");
    }

    const jumlahGambar = await prisma.gambar.count({
      where: { berita: { slug } },
    });
    const totalGambar = jumlahGambar + files.length;

    if (totalGambar > 4) {
      files.forEach((file) => {
        if (file && file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      throw new BadRequestError(
        `Maksimal 4 gambar per berita. Saat ini sudah ada ${jumlahGambar} gambar.`
      );
    }

    // Pastikan folder resized ada
    const resizedFolderPath = path.resolve(files[0].destination, "resized");
    if (!fs.existsSync(resizedFolderPath)) {
      fs.mkdirSync(resizedFolderPath, { recursive: true });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        try {
          console.log("File received:", file);
          let imageUrl = null;

          if (file && file.path) {
            const originalFileSize = fs.statSync(file.path).size;
            console.log("Original file size (bytes):", originalFileSize);

            // Ganti ekstensi ke .webp
            const webpFilename = file.filename.replace(
              path.extname(file.filename),
              ".webp"
            );

            const resizedImagePath = path.resolve(
              file.destination,
              "resized",
              webpFilename
            );

            // Convert ke webp dengan kualitas 50
            await sharp(file.path)
              .webp({ quality: 50 })
              .toFile(resizedImagePath);

            const resizedFileSize = fs.statSync(resizedImagePath).size;
            console.log("Resized file size (bytes):", resizedFileSize);

            // Hapus file sementara hasil upload multer
            fs.unlinkSync(file.path);

            imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${webpFilename}`;
            console.log("Image resized and uploaded to:", imageUrl);
          }

          const savedGambar = await prisma.gambar.create({
            data: {
              url: imageUrl,
              berita: {
                connect: {
                  slug: berita.slug,
                },
              },
            },
          });

          return {
            id: savedGambar.id,
            url: savedGambar.url,
            slug: berita.slug,
          };
        } catch (err) {
          // Kalau error hapus file upload sementara
          if (file && file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          throw err;
        }
      })
    );

    return uploadedImages;
  }

  static async deleteGambar({ slug, ids }) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError(
        "ID Gambar harus berupa array dan tidak boleh kosong"
      );
    }
    const berita = await prisma.berita.findUnique({
      where: { slug },
    });

    if (!berita) {
      throw new NotFoundError("Berita tidak ditemukan");
    }

    const gambarList = await prisma.gambar.findMany({
      where: {
        id: { in: ids },
        berita: {
          slug: slug,
        },
      },
    });

    if (gambarList.length === 0) {
      throw new NotFoundError("Tidak ada gambar yang ditemukan untuk dihapus");
    }

    const deletedGambar = gambarList.map((gambar) => {
      const fileName = gambar.url.split("/").pop();
      const filePath = path.resolve("uploads", "resized", fileName); // sesuaikan folder ini jika beda

      // Hapus file dari disk jika ada
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        id: gambar.id,
        fileName,
      };
    });

    // Hapus dari database setelah file berhasil dihapus
    await prisma.gambar.deleteMany({
      where: {
        id: { in: ids },
        berita: {
          slug: slug,
        },
      },
    });

    return deletedGambar;
  }
  static async searchBerita({ page, pageSize, keyword }) {
    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);

    const totalItems = await prisma.berita.count({
      where: {
        judul: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    });

    if (!keyword || keyword.trim() === "") {
      throw new BadRequestError("Keyword pencarian diperlukan");
    }

    const result = await prisma.berita.findMany({
      skip,
      take,
      where: {
        judul: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      include: { gambar_tambahan: true },
    });

    if (result.length === 0) {
      throw new NotFoundError("Berita dengan keyword tersebut tidak ditemukan");
    }

    const potongKalimat = (kalimat, maxKata) => {
      const kata = kalimat.split(" ");
      if (kata.length <= maxKata) return kalimat;
      return kata.slice(0, maxKata).join(" ") + " ...";
    };

    const beritaData = result.map((berita) => ({
      id: berita.id_berita,
      judul: potongKalimat(berita.judul, 8),
      ringkasan: potongKalimat(berita.ringkasan, 20),
      gambar_sampul: berita.gambar_sampul,
      tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(berita.tanggal_berita)),
      tanggal_default: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(berita.createdAt)),
    }));

    const totalPages = Math.ceil(totalItems / currentPageSize);
    return {
      berita: beritaData,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages,
      },
    };
  }
}

module.exports = BeritaService;
