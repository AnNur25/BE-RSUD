const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const imageKit = require("../configs/imagekit-config");
const Pagination = require("../utils/pagination");

class DokterService {
  static async createDokter({ nama, id_poli }, file) {
    if (!nama || !id_poli || !file) {
      throw new BadRequestError("Nama, id poli, dan file harus diisi");
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

  static async searchDokter({ keyword }) {
    if (!keyword) {
      throw new BadRequestError("Keyword pencarian harus diisi");
    }
    const result = await prisma.dokter.findMany({
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
    return result;
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
        poli: {
          select: {
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

  static async updateDokter({ id_dokter }, { nama, id_poli }, file) {
    console.log("Update dokter with ID:", id_dokter);

    if (!id_dokter || !nama || !id_poli || !file) {
      throw new BadRequestError(
        "ID Dokter, Nama, ID Poli, dan Gambar harus diisi"
      );
    }

    const dokter = await prisma.dokter.findUnique({
      where: { id_dokter },
    });
    const poli = await prisma.poli.findUnique({
      where: { id_poli },
    });
    if (!poli || !dokter)
      throw new NotFoundError("Poli atau dokter tidak ditemukan");

    const base64Image = file.buffer.toString("base64");
    const uploaded = await imageKit.upload({
      fileName: file.originalname,
      file: base64Image,
    });

    const updated = await prisma.dokter.update({
      where: { id_dokter },
      data: {
        nama,
        gambar: uploaded.url,
        poli: {
          connect: { id_poli },
        },
      },
    });

    return {
      id: updated.id_dokter,
      nama: updated.nama,
    };
  }

  static async deleteDokter({ id_dokter }) {
    const dokterExists = await prisma.dokter.findUnique({
      where: { id_dokter: id_dokter },
    });

    if (!dokterExists) {
      throw new NotFoundError(`Dokter dengan ID ${id_dokter} tidak ditemukan`);
    }
    await prisma.dokter.delete({
      where: { id_dokter },
    });

    return null;
  }
}

module.exports = DokterService;
