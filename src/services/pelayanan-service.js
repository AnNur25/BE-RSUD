const {
  BadRequestError,
  NotFoundError,
} = require("../utils/error-handling-utils");
const Pagination = require("../utils/pagination-utils");
const prisma = require("../prisma/prismaClient");
const generateUniqueSlug = require("../utils/slug-detail-pelayanan-rs");

class PelayananService {
  static async createPelayanan({
    nama_pelayanan,
    Persyaratan,
    Prosedur,
    JangkaWaktu,
    Biaya,
  }) {
    const slug = await generateUniqueSlug(nama_pelayanan);
    if (
      !nama_pelayanan ||
      !Persyaratan ||
      !Prosedur ||
      !JangkaWaktu ||
      Biaya === undefined
    ) {
      throw new BadRequestError("Kolom tidak boleh kosong");
    }

    const pelayanan = await prisma.pelayanan.create({
      data: { nama_pelayanan, Persyaratan, Prosedur, JangkaWaktu, Biaya, slug },
    });

    return {
      id: pelayanan.id_pelayanan,
      nama_pelayanan: pelayanan.nama_pelayanan,
      slug: pelayanan.slug,
    };
  }

  static async getPelayananList() {
    return await prisma.pelayanan.findMany({
      select: {
        id_pelayanan: true,
        nama_pelayanan: true,
        slug: true,
      },
    });
  }
  static async getPelayananBySlug(slug) {
    const pelayanan = await prisma.pelayanan.findUnique({
      where: { slug },
    });

    if (!slug) {
      throw new NotFoundError(
        `Pelayanan dengan slug: ${slug} tidak ditemukan.`
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
    if (
      !nama_pelayanan ||
      !Persyaratan ||
      !Prosedur ||
      !JangkaWaktu ||
      Biaya === undefined
    ) {
      throw new BadRequestError("Kolom tidak boleh kosong");
    }

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
