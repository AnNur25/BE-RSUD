const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const imageKit = require("../configs/imagekit-config");
const Pagination = require("../utils/pagination");

class BeritaService {
  static async createBerita({ judul, ringkasan, isi }, file) {
    if (!file) {
      throw new BadRequestError("File is required");
    }

    const stringImage = file.buffer.toString("base64");
    const uploadImage = await imageKit.upload({
      fileName: file.originalname,
      file: stringImage,
    });
    const beritaBaru = await prisma.berita.create({
      data: {
        judul,
        ringkasan,
        isi,
        gambar_sampul: uploadImage.url,
      },
    });
    return {
      id: beritaBaru.id_berita,
      tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(beritaBaru.createdAt)),
    };
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

    const beritaData = berita.map((berita) => ({
      id: berita.id_berita,
      judul: berita.judul,
      ringkasan: berita.ringkasan,
      gambar_sampul: berita.gambar_sampul,
      tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
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

  static async getBeritaById({ id_berita }) {
    if (!id_berita) {
      throw new NotFoundError("ID Berita tidak ditemukan");
    }
    const berita = await prisma.berita.findUnique({
      where: { id_berita },
      include: { gambar_tambahan: true },
    });
    if (!berita) {
      throw new NotFoundError("Oops! detail berita tidak ditemukan");
    }
    return {
      id: berita.id_berita,
      judul: berita.judul,
      ringkasan: berita.ringkasan,
      isi: berita.isi,
      gambar_sampul: berita.gambar_sampul,
      tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(berita.createdAt)),
      gambar_tambahan: berita.gambar_tambahan.map((gambar) => gambar.url),
    };
  }

  static async updateBerita({ id_berita }, { judul, ringkasan, isi }, file) {
    const berita = await prisma.berita.findUnique({
      where: { id_berita },
    });
    if (!berita) {
      throw new NotFoundError("Berita tidak ditemukan");
    }
    let gambar_sampul = berita.gambar_sampul;
    if (file) {
      console.log("Received file:", file);
      const stringImage = file.buffer.toString("base64");
      const uploadImage = await imageKit.upload({
        fileName: file.originalname,
        file: stringImage,
      });
      console.log("Image uploaded to ImageKit:", uploadImage);
      gambar_sampul = uploadImage.url;
    }

    const updateBerita = await prisma.berita.update({
      where: { id_berita: id_berita },
      data: {
        judul: judul || berita.judul,
        ringkasan: ringkasan || berita.ringkasan,
        isi: isi || berita.isi,
        gambar_sampul,
      },
    });

    return {
      id: updateBerita.id_berita,
      judul: updateBerita.judul,
      tanggal_dibuat: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
      }).format(new Date(berita.createdAt)),
    };
  }
  static async deleteBerita({ id_berita }) {
    const berita = await prisma.berita.findUnique({ where: { id_berita } });
    if (!berita) {
      throw new NotFoundError("Berita tidak ditemukan");
    }

    await prisma.berita.delete({
      where: { id_berita },
    });
  }
}

module.exports = BeritaService;
