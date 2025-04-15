const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const imageKit = require("../configs/imagekit-config");
const Pagination = require("../utils/pagination");

class BeritaService {
  static async createBerita({ judul, ringkasan, isi }, file) {
    if (!file || !judul || !ringkasan || !isi) {
      throw new BadRequestError(" Semua field harus diisi");
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
      judul: beritaBaru.judul,
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
    const potongKalimat = (kalimat, maxKata) => {
      const kata = kalimat.split(" ");
      if (kata.length <= maxKata) return kalimat;
      return kata.slice(0, maxKata).join(" ") + " ...";
    };

    const beritaData = berita.map((berita) => ({
      id: berita.id_berita,
      judul: potongKalimat(berita.judul, 8),
      isi: potongKalimat(berita.isi, 20),
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
  static async getBeritaById({ id }) {
    if (!id) {
      throw new NotFoundError("ID Berita tidak ditemukan");
    }
    const berita = await prisma.berita.findUnique({
      where: { id_berita: id },
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
  static async updateBerita({ id }, { judul, ringkasan, isi }, file) {
    if (!id || !judul || !ringkasan || !isi) {
      throw new BadRequestError(" Semua field harus diisi");
    }
    const berita = await prisma.berita.findUnique({
      where: { id_berita: id },
    });
    if (!berita) {
      throw new NotFoundError("Id Berita tidak ditemukan");
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
      where: { id_berita: id },
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
      }).format(new Date(berita.createdAt)),
    };
  }
  static async deleteBerita({ id }) {
    const berita = await prisma.berita.findUnique({ where: { id_berita: id } });
    if (!berita) {
      throw new NotFoundError("Id Berita tidak ditemukan");
    }

    await prisma.berita.delete({
      where: { id_berita: id },
    });
    return null;
  }
  static async getGambarByBerita({ id }) {
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
  static async uploadGambar({ id }, file) {
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
  static async deleteGambar({ beritaId, ids }) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError(
        "ID Gambar harus berupa array dan tidak boleh kosong"
      );
    }

    const gambarList = await prisma.gambar.findMany({
      where: {
        id: { in: ids },
        beritaId: beritaId,
      },
    });

    if (gambarList.length === 0) {
      throw new NotFoundError("Tidak ada gambar yang ditemukan untuk dihapus");
    }

    const deletedGambar = gambarList.map((gambar) => ({
      id: gambar.id,
      fileName: gambar.url.split("/").pop(),
    })); //fa61555b-4f50-4c4f-a42e-675de1567e53 fa61555b-4f50-4c4f-a42e-675de1567e53

    await prisma.gambar.deleteMany({
      where: {
        id: { in: ids },
        beritaId: beritaId,
      },
    });

    return deletedGambar;
  }
  static async searchBerita({ page, pageSize, keyword }) {
    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);

    const totalItems = await prisma.berita.count();
    if (!keyword || keyword.trim() === "") {
      throw new BadRequestError("Keyword pencarian diperlukan");
    }

    const result = await prisma.berita.findMany({
      skip,
      take,
      where: {
        judul: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      include: { gambar_tambahan: true },
    });

    if (result.length === 0) {
      throw new NotFoundError("Berita dengan keyword tersebut tidak ditemukan");
    }

    const potongKalimat = (kalimat, maxKata) => {
      const kata = kalimat.split(" ");
      if (kata.length <= maxKata) return kalimat;
      return kata.slice(0, maxKata).join(" ") + " ...";
    };

    const beritaData = result.map((berita) => ({
      id: berita.id_berita,
      judul: potongKalimat(berita.judul, 8),
      isi: potongKalimat(berita.isi, 20),
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
}

module.exports = BeritaService;
