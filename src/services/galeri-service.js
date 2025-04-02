const prisma = require("../prisma/prismaClient");
const imageKit = require("../configs/imagekit-config");
const { BadRequestError, NotFoundError } = require("../utils/error");
const Pagination = require("../utils/pagination");

class GaleriService {
  static async uploadGambar(id, file) {
    if (!id) {
      throw new BadRequestError("ID Berita tidak ditemukan");
    }

    console.log("Mencari berita dengan ID:", id);

    const berita = await prisma.berita.findUnique({
      where: { id_berita: id },
    });

    if (!berita) {
      throw new NotFoundError("Berita tidak ditemukan");
    }

    const jumlahGambar = await prisma.gambar.count({
      where: { beritaId: id },
    });

    if (jumlahGambar + file.length > 4) {
      throw new BadRequestError(
        `Maksimal 4 gambar diperbolehkan. Saat ini sudah ada ${jumlahGambar} gambar.`
      );
    }

    const uploadPromises = file.map(async (file) => {
      const stringImage = file.buffer.toString("base64");
      return await imageKit.upload({
        fileName: file.originalname,
        file: stringImage,
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    const gambarData = uploadedImages.map((image) => ({
      url: image.url,
      beritaId: id,
    }));

    await prisma.gambar.createMany({ data: gambarData });

    return gambarData;
  }
  static async getGambarByBerita(id) {
    if (!id) {
      throw new BadRequestError("ID Berita tidak ditemukan");
    }
    const gambarList = await prisma.gambar.findMany({
      where: { beritaId: id },
      select: { id: true, url: true },
    });
    if (gambarList.length === 0) {
      throw new NotFoundError("Ops, galeri kosong");
    }

    const gambar = await prisma.gambar.findMany({
      where: { beritaId: id },
    });

    return gambarList;
  }
  static async deleteGambar(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError(
        "ID Gambar harus berupa array dan tidak boleh kosong"
      );
    }

    const gambarList = await prisma.gambar.findMany({
      where: { id: { in: ids } },
      include: { berita: true },
    });

    if (gambarList.length === 0) {
      throw new NotFoundError("Tidak ada gambar yang ditemukan untuk dihapus");
    }

    const deletedGambar = gambarList.map((gambar) => ({
      id: gambar.id,
      fileName: gambar.url.split("/").pop(),
    }));

    await prisma.gambar.deleteMany({
      where: { id: { in: ids } },
    });

    return deletedGambar;
  }
}

module.exports = GaleriService;
