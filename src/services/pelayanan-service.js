const { BadRequestError, NotFoundError } = require("../utils/error-handling-utils");
const Pagination = require("../utils/pagination-utils");
const prisma = require("../prisma/prismaClient");

class PelayananService {
  static async createPelayanan({
    nama_pelayanan,
    Persyaratan,
    Prosedur,
    JangkaWaktu,
    Biaya,
  }) {
    if (
      !nama_pelayanan ||
      !Persyaratan ||
      !Prosedur ||
      !JangkaWaktu ||
      Biaya === undefined
    ) {
      throw new BadRequestError("Semua field wajib diisi");
    }

    const pelayanan = await prisma.pelayanan.create({
      data: { nama_pelayanan, Persyaratan, Prosedur, JangkaWaktu, Biaya },
    });

    return {
      id: pelayanan.id_pelayanan,
      nama_pelayanan: pelayanan.nama_pelayanan,
    };
  }

  static async getPelayananList() {
    return await prisma.pelayanan.findMany({
      select: {
        id_pelayanan: true,
        nama_pelayanan: true,
      },
    });
  }
  static async getPelayananById(id_pelayanan) {
    const pelayanan = await prisma.pelayanan.findUnique({
      where: { id_pelayanan },
    });

    if (!pelayanan) {
      throw new NotFoundError(
        `Pelayanan dengan ID ${id_pelayanan} tidak ditemukan.`
      );
    }

    return pelayanan;
  }

  static async updatePelayanan(
    id_pelayanan,
    { nama_pelayanan, Persyaratan, Prosedur, JangkaWaktu, Biaya }
  ) {
    if (!id_pelayanan) throw new BadRequestError("ID pelayanan diperlukan");

    const existing = await prisma.pelayanan.findUnique({
      where: { id_pelayanan },
    });
    if (!existing)
      throw new NotFoundError(
        `Pelayanan dengan ID ${id_pelayanan} tidak ditemukan`
      );

    const updatedPelayanan = await prisma.pelayanan.update({
      where: { id_pelayanan },
      data: { nama_pelayanan, Persyaratan, Prosedur, JangkaWaktu, Biaya },
    });

    return {
      id: updatedPelayanan.id_pelayanan,
      nama_pelayanan: updatedPelayanan.nama_pelayanan,
    };
  }
}

module.exports = PelayananService;
