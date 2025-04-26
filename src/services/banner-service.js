const { BadRequestError, NotFoundError } = require("../utils/error");
const prisma = require("../prisma/prismaClient");

class BannerService {
  static async createBanner({ banner }) {
    if (!banner) {
      throw new BadRequestError("Banner harus diisi");
    }
    const stringImage = banner.buffer.toString("base64");
    const uploadImage = await imageKit.upload({
      fileName: banner.originalname,
      file: stringImage,
    });

    const addData = await prisma.banner.create({
      data: {
        gambar: uploadImage.url,
      },
    });

    return { id: addData.id_banner, gambar: addData.gambar };
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

  static async deleteBanner({ id }) {
    if (!id) {
      throw new BadRequestError("ID Banner wajib disertakan");
    }

    const bannerList = await prisma.banner.findMany({
      where: { id_banner: id },
    });

    if (!banner) {
      throw new NotFoundError(`Banner dengan ID ${id} tidak ditemukan`);
    }

    const deletedGambar = bannerList.map((gambar) => ({
      id: gambar.id,
      fileName: gambar.url.split("/").pop(),
    }));

    await prisma.banner.deleteMany({
      where: { id_banner: id },
    });

    return deletedGambar;
  }
}

module.exports = BannerService;

/*
}
    const stringImage = file.buffer.toString("base64");
    const uploadImage = await imageKit.upload({
      fileName: file.originalname,
      file: stringImage,
    });

    const addData = await prisma.dokter.create({
      data: {
        nama, //object property shorthand.
        gambar: uploadImage.url,
        poli: { connect: { id_poli } },
      },
    });
    return { id: addData.id_dokter, nama: addData.nama };
  }

   const deletedGambar = gambarList.map((gambar) => ({
      id: gambar.id,
      fileName: gambar.url.split("/").pop(),
    }));

    await prisma.gambar.deleteMany({
      where: {
        id: { in: ids },
        beritaId: beritaId,
      },
    });
*/
