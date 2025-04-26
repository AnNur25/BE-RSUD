const { BadRequestError, NotFoundError } = require("../utils/error");
const prisma = require("../prisma/prismaClient");
const imageKit = require("../configs/imagekit-config");

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

    const uploadPromises = files.map(async (file) => {
      const stringImage = file.buffer.toString("base64");
      return await imageKit.upload({
        fileName: file.originalname,
        file: stringImage,
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);
    const bannerData = await Promise.all(
      uploadedImages.map(async (image) => {
        const savedBanner = await prisma.banner.create({
          data: {
            gambar: image.url,
          },
        });

        return {
          id_banner: savedBanner.id_banner,
          gambar: savedBanner.gambar,
        };
      })
    );

    return bannerData;
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
