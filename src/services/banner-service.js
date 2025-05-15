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
      throw new BadRequestError(
        `Maksimal 4 banner. Saat ini sudah ada ${jumlahBanner} banner.`
      );
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
      console.log("File received:", file);
      let imageUrl = null;
      if (file && file.path) {
        const originalFileSize = fs.statSync(file.path).size;
        console.log("Original file size (bytes):", originalFileSize);

        const resizedImagePath = path.resolve(
        file.destination,
        "resized",
        file.filename
        );
        await sharp(file.path)
        .jpeg({ quality: 50 })
        .png({ quality: 50 })
        .toFile(resizedImagePath);

        const resizedFileSize = fs.statSync(resizedImagePath).size;
        console.log("Resized file size (bytes):", resizedFileSize);

        fs.unlinkSync(file.path);
        imageUrl = `../../uploads/resized/${file.filename}`;
        console.log("Image resized and uploaded to:", imageUrl);
      }
      console.log("Image uploaded to:", imageUrl);

      const savedBanner = await prisma.banner.create({
        data: {
        gambar: imageUrl,
        },
      });

      return {
        id_banner: savedBanner.id_banner,
        gambar: savedBanner.gambar,
      };
      })
    );

    return uploadedImages;
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
    console.log("ID yang dikirim:", ids);

    const existingBanners = await prisma.banner.findMany({
      where: { id_banner: { in: ids } },
      select: { id_banner: true },
    });

    console.log(
      "ID yang ditemukan:",
      existingBanners.map((b) => b.id_banner)
    );

    const existingIds = existingBanners.map((banner) => banner.id_banner);

    const invalidIds = ids.filter((id) => !existingIds.includes(id));
    if (invalidIds.length > 0) {
      throw new NotFoundError(
        `Banner dengan ID berikut tidak ditemukan: ${invalidIds.join(", ")}`
      );
    }

    await prisma.banner.deleteMany({
      where: { id_banner: { in: ids } },
    });

    return { message: `${ids.length} banner berhasil dihapus.` };
  }
}

module.exports = BannerService;
