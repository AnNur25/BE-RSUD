const { BadRequestError, NotFoundError } = require("../utils/error");
const prisma = require("../prisma/prismaClient");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class BannerService {
  static async createBanner({ files }) {
    if (!files || files.length === 0) {
      throw new BadRequestError("Tidak ada file yang diunggah");
    }

    const jumlahBanner = await prisma.banner.count();
    const totalBanner = jumlahBanner + files.length;

    if (totalBanner > 4) {
      files.forEach((file) => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });

      throw new BadRequestError(
        `Maksimal 4 banner. Saat ini sudah ada ${jumlahBanner} banner.`
      );
    }

    const uploadedImages = [];
    const savedBanners = [];

    try {
      for (const file of files) {
        const originalPath = file.path;
        const fileNameWithoutExt = path.parse(file.filename).name;
        const webpFilename = `${fileNameWithoutExt}.webp`;

        const resizedPath = path.resolve(
          file.destination,
          "resized",
          webpFilename
        );

        // Resize dan konversi ke .webp
        await sharp(originalPath).webp({ quality: 50 }).toFile(resizedPath);

        // Hapus file original
        if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);

        const imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${webpFilename}`;

        const savedBanner = await prisma.banner.create({
          data: {
            gambar: imageUrl,
          },
        });

        uploadedImages.push({
          id_banner: savedBanner.id_banner,
          gambar: savedBanner.gambar,
        });
        savedBanners.push(savedBanner);
      }

      return uploadedImages;
    } catch (error) {
      // Rollback semua: hapus file dan data DB
      files.forEach((file) => {
        const fileNameWithoutExt = path.parse(file.filename).name;
        const webpFilename = `${fileNameWithoutExt}.webp`;

        const resizedPath = path.resolve(
          file.destination,
          "resized",
          webpFilename
        );
        if (fs.existsSync(resizedPath)) fs.unlinkSync(resizedPath);

        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });

      for (const saved of savedBanners) {
        await prisma.banner.delete({
          where: { id_banner: saved.id_banner },
        });
      }

      throw error;
    }
  }

  static async getBanner() {
    const banner = await prisma.banner.findMany({
      select: { id_banner: true, gambar: true },
    });
    if (banner.length === 0) {
      throw new NotFoundError("Ops! daftar banner kosong");
    }
    return banner;
  }

  static async deleteBanner({ ids }) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError("ID banner yang akan dihapus tidak ditemukan");
    }

    const existingBanners = await prisma.banner.findMany({
      where: { id_banner: { in: ids } },
      select: { id_banner: true, gambar: true }, // sesuaikan field
    });

    const existingIds = existingBanners.map((banner) => banner.id_banner);
    const invalidIds = ids.filter((id) => !existingIds.includes(id));
    if (invalidIds.length > 0) {
      files.forEach((file) => {
        if (file && file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      throw new NotFoundError(
        `Banner dengan ID berikut tidak ditemukan: ${invalidIds.join(", ")}`
      );
    }

    // Hapus file gambarnya
    for (const banner of existingBanners) {
      const imageRelativePath = banner.gambar.replace("../../", ""); // jadi 'uploads/resized/namafile.jpg'
      const filePath = path.resolve(imageRelativePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // atau pakai fs.promises.unlink(filePath)
      }
    }

    // Hapus data dari DB
    await prisma.banner.deleteMany({
      where: { id_banner: { in: ids } },
    });

    return { message: `${ids.length} banner berhasil dihapus.` };
  }
}

module.exports = BannerService;
