const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const Pagination = require("../utils/pagination");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

class DokterService {
  static async createDokter({
    nama,
    biodata_singkat,
    link_linkedin,
    link_instagram,
    link_facebook,
    id_poli,
    file,
  }) {
    if (!nama || !id_poli || !biodata_singkat) {
      throw new BadRequestError(
        "Nama, id poli, dan biodata_singkat harus diisi"
      );
    }
    console.log("File received:", file);
    let imageUrl = null;
    if (file && file.path) {
      const originalFileSize = fs.statSync(file.path).size;
      console.log("Original file size (bytes):", originalFileSize);

      const resizedImagePath = path.resolve(
        file.destination,
        "resized",
        file.filename
      );
      await sharp(file.path)
        .jpeg({ quality: 50 })
        .png({ quality: 50 })
        .toFile(resizedImagePath);

      const resizedFileSize = fs.statSync(resizedImagePath).size;
      console.log("Resized file size (bytes):", resizedFileSize);

      fs.unlinkSync(file.path);
      imageUrl = `../../uploads/resized/${file.filename}`;
      console.log("Image resized and uploaded to:", imageUrl);
    }
    console.log("Image uploaded to:", imageUrl);

    const addData = await prisma.dokter.create({
      data: {
        nama, //object property shorthand.
        gambar: imageUrl,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
        poli: { connect: { id_poli } },
      },
    });
    return { id: addData.id_dokter, nama: addData.nama };
  }

  static async searchDokter({ page, pageSize, keyword }) {
    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);
    if (!keyword) {
      throw new BadRequestError("Keyword pencarian harus diisi");
    }

    const totalItems = await prisma.dokter.count({
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
    });
    const result = await prisma.dokter.findMany({
      skip,
      take,
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
    const mappedResult = result.map((dokter) => ({
      id_dokter: dokter.id_dokter,
      nama: dokter.nama,
      gambar: dokter.gambar,
      biodata_singkat: dokter.biodata_singkat,
      link_linkedin: dokter.link_linkedin,
      link_instagram: dokter.link_instagram,
      link_facebook: dokter.link_facebook,
      poli: {
        id_poli: dokter.poli.id_poli,
        nama_poli: dokter.poli.nama_poli,
      },
    }));

    const totalPages = Math.ceil(totalItems / currentPageSize);
    return {
      Dokter: mappedResult,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages,
      },
    };
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
        biodata_singkat: true,
        link_linkedin: true,
        link_instagram: true,
        link_facebook: true,
        poli: {
          select: {
            id_poli: true,
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

  static async getDokterById(id_dokter) {
    if (!id_dokter) {
      throw new BadRequestError("ID Dokter harus disertakan");
    }

    const dokter = await prisma.dokter.findUnique({
      where: { id_dokter: id_dokter },
      include: {
        poli: true,
      },
    });

    if (!dokter) {
      throw new NotFoundError(`Dokter dengan ID ${id_dokter} tidak ditemukan`);
    }

    return {
      dokter: {
        id_dokter: dokter.id_dokter,
        nama: dokter.nama,
        gambar: dokter.gambar,
        biodata_singkat: dokter.biodata_singkat,
        link_linkedin: dokter.link_linkedin,
        link_instagram: dokter.link_instagram,
        link_facebook: dokter.link_facebook,
        poli: {
          id_poli: dokter.poli?.id_poli,
          nama_poli: dokter.poli?.nama_poli,
        },
      },
    };
  }

  static async updateDokter({
    id_dokter,
    nama,
    biodata_singkat,
    link_linkedin,
    link_instagram,
    link_facebook,
    id_poli,
    file,
  }) {
    if (!id_dokter || !nama || !id_poli || !biodata_singkat) {
      throw new BadRequestError(
        "ID Dokter, biodata_singkat, Nama, dan ID Poli harus diisi"
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

    let imageUrl = dokter.gambar;
    if (file && file.path) {
      const originalFileSize = fs.statSync(file.path).size;
      console.log("Original file size (bytes):", originalFileSize);

      const resizedImagePath = path.resolve(
        file.destination,
        "resized",
        file.filename
      );
      await sharp(file.path)
        .jpeg({ quality: 50 })
        .png({ quality: 50 })
        .toFile(resizedImagePath);

      const resizedFileSize = fs.statSync(resizedImagePath).size;
      console.log("Resized file size (bytes):", resizedFileSize);

      fs.unlinkSync(file.path);
      imageUrl = `../../uploads/resized/${file.filename}`;
      console.log("Image resized and uploaded to:", imageUrl);
    }
    console.log("Image uploaded to:", imageUrl);

    const updated = await prisma.dokter.update({
      where: { id_dokter },
      data: {
        nama,
        gambar: imageUrl,
        biodata_singkat,
        link_linkedin,
        link_instagram,
        link_facebook,
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
