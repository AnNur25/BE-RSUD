const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const imageKit = require("../configs/imagekit-config");
const Pagination = require("../utils/pagination");

class DokterService {
  static async createDokter(nama, id_poli, file) {
    if (!nama || !id_poli) {
      throw new BadRequestError("Nama dan id poli harus diisi");
    }

    if (!file) {
      throw new BadRequestError("File gambar harus diisi");
    }

    const stringImage = file.buffer.toString("base64");
    const uploadImage = await imageKit.upload({
      fileName: file.originalname,
      file: stringImage,
    });

    const addData = await prisma.dokter.create({
      data: {
        nama,
        gambar: uploadImage.url,
        poli: { id_poli },
      },
    });

    return addData;
  }
}

module.exports = DokterService;
