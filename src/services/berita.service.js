const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const imageKit = require("../config/imagekit");
const Pagination = require("../utils/pagination");

class BeritaService {
  static async createBerita(judul, ringkasan, isi, tanggal_terbit, file) {
    if (!file) {
      throw new BadRequestError("File is required");
    }
    if (!tanggal_terbit || isNaN(Date.parse(tanggal_terbit))) {
      throw new BadRequestError("Invalid date format (YYYY-MM-DD)");
    }
    const parsedDate = new Date(tanggal_terbit);
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
        tanggal_terbit: parsedDate,
      },
    });
    return {
      id: beritaBaru.id_berita,
      judul: beritaBaru.judul,
      tanggal_terbit: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(beritaBaru.tanggal_terbit)),
      dibuat_pada_tanggal: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(beritaBaru.createdAt)),
    };
  }
  static async getBerita(page, pageSize) {
    try {
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
        tanggal_terbit: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(berita.tanggal_terbit)),
        dibuat_pada_tanggal: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(berita.createdAt)),
        diupdate_pada_tanggal: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(berita.updateAt)),
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
    } catch (error) {
      throw error;
    }
  }

  static async getBeritaById(id_berita) {
    try {
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
        tanggal_terbit: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(berita.tanggal_terbit)),
        dibuat_pada: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(berita.createdAt)),
        gambar_tambahan: berita.gambar_tambahan.map((gambar) => gambar.url),
      };
    } catch (error) {
      throw error;
    }
  }
  
  static async updateBerita(
    id_berita,
    judul,
    ringkasan,
    isi,
    tanggal_terbit,
    file
  ) {
    try {
      const berita = await prisma.berita.findUnique({
        where: { id_berita },
      });
      if (!berita) {
        throw new NotFoundError("Berita tidak ditemukan");
      }
      if (!tanggal_terbit || isNaN(Date.parse(tanggal_terbit))) {
        throw new BadRequestError("Invalid date format (YYYY-MM-DD)");
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
          tanggal_terbit: tanggal_terbit
            ? new Date(tanggal_terbit)
            : berita.tanggal_terbit,
        },
      });

      return {
        id: updateBerita.id_berita,
        judul: updateBerita.judul,
        tanggal_terbit: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(updateBerita.tanggal_terbit)),
        updateAt: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(updateBerita.updateAt)),
      };
    } catch (error) {
      throw error;
    }
  }
  static async deleteBerita(id_berita) {
    try {
      const berita = await prisma.berita.findUnique({ where: { id_berita } });
      if (!berita) {
        throw new NotFoundError("Berita tidak ditemukan");
      }

      await prisma.berita.delete({
        where: { id_berita },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BeritaService;
