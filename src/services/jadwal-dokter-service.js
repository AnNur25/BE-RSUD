const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error-handling-utils");
const Pagination = require("../utils/pagination-utils");
const { mapDokterResponse } = require("../helpers/jadwal-map-helper");

class JadwalDokterService {
  static async createJadwalDokter({ id_dokter, layananList }) {
    const dokter = await prisma.dokter.findUnique({ where: { id_dokter } });

    if (!dokter) {
      throw new NotFoundError(`Dokter dengan ID ${id_dokter} tidak ditemukan.`);
    }

    for (const layanan of layananList) {
      const { id_pelayanan, hariList } = layanan;

      if (!Array.isArray(hariList) || hariList.length === 0) {
        throw new BadRequestError(
          "Setiap layanan harus memiliki daftar hari (hariList) yang valid."
        );
      }

      for (const hariData of hariList) {
        const { hari, jam_mulai, jam_selesai } = hariData;

        if (!hari || !jam_mulai || !jam_selesai) {
          throw new BadRequestError(
            "Setiap jadwal harus memiliki hari, jam_mulai, dan jam_selesai."
          );
        }

        const normalizedHari =
          hari.charAt(0).toUpperCase() + hari.slice(1).toLowerCase();

        const startHour = parseInt(jam_mulai.split(":")[0]);
        const endHour = parseInt(jam_selesai.split(":")[0]);

        let sesi = "";
        if (startHour >= 7 && endHour <= 14) {
          sesi = "Pagi";
        } else if (startHour >= 14 && endHour <= 20) {
          sesi = "Sore";
        } else {
          sesi = "Malam";
        }

        await prisma.jadwalDokter.create({
          data: {
            id_dokter,
            id_pelayanan,
            hari: normalizedHari,
            sesi,
            jam_mulai,
            jam_selesai,
          },
        });
      }
    }

    return {
      id_dokter,
      nama_dokter: dokter.nama,
    };
  }

  static async getAllJadwalDokter(page, pageSize) {
    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);

    const allDokterIds = await prisma.jadwalDokter.findMany({
      distinct: ["id_dokter"],
      select: { id_dokter: true },
    });

    const totalItems = allDokterIds.length;
    const totalPages = Math.ceil(totalItems / currentPageSize);
    const paginatedDokterIds = allDokterIds
      .slice(skip, skip + take)
      .map((dokter) => dokter.id_dokter);
    const jadwalList = await prisma.jadwalDokter.findMany({
      where: {
        id_dokter: {
          in: paginatedDokterIds,
        },
      },
      include: {
        dokter: {
          include: {
            poli: true,
          },
        },
        pelayanan: true,
      },
    });
    if (!jadwalList.length) {
      throw new NotFoundError("Tidak ada jadwal dokter yang ditemukan");
    }

    const formatted = mapDokterResponse(jadwalList);

    return {
      dokter: formatted,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages,
      },
    };
  }

  static async searchJadwalDokter({ id_poli, tanggal, page, pageSize }) {
    if (!id_poli || !tanggal) {
      throw new BadRequestError("ID Poli dan tanggal wajib diisi");
    }

    const tanggalObjek = new Date(tanggal);
    if (isNaN(tanggalObjek)) {
      throw new BadRequestError("Format tanggal tidak valid");
    }

    const hariEnum = tanggalObjek.toLocaleDateString("id-ID", {
      weekday: "long",
    });
    const hariFormatted =
      hariEnum.charAt(0).toUpperCase() + hariEnum.slice(1).toLowerCase();

    const totalItems = await prisma.jadwalDokter.count({
      where: {
        hari: hariFormatted,
        dokter: {
          id_poli,
        },
      },
    });

    if (totalItems === 0) {
      throw new NotFoundError(
        `Tidak ada jadwal dokter pada hari ${hariFormatted} (${tanggal}).`
      );
    }

    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);

    const jadwalList = await prisma.jadwalDokter.findMany({
      where: {
        hari: hariFormatted,
        dokter: {
          id_poli,
        },
      },
      skip,
      take,
      include: {
        dokter: {
          include: {
            poli: true,
          },
        },
        pelayanan: true,
      },
    });

    if (!jadwalList.length) {
      throw new NotFoundError(`Tidak ada jadwal dokter pada hari ${hari}`);
    }

    const formatted = mapDokterResponse(jadwalList);

    return {
      dokter: formatted,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / currentPageSize),
      },
    };
  }
  static async searchJadwalDokterByName({ nama, page, pageSize }) {
    if (!nama) {
      throw new BadRequestError("Nama dokter wajib diisi");
    }

    const {
      skip,
      take,
      page: currentPage,
      pageSize: currentPageSize,
    } = Pagination.paginate(page, pageSize);

    const totalItems = await prisma.jadwalDokter.count({
      where: {
        dokter: {
          nama: {
            contains: nama,
            mode: "insensitive", // agar tidak case sensitive
          },
        },
      },
    });

    if (totalItems === 0) {
      throw new NotFoundError(`Tidak ditemukan dokter dengan nama '${nama}'`);
    }

    const jadwalList = await prisma.jadwalDokter.findMany({
      where: {
        dokter: {
          nama: {
            contains: nama,
            mode: "insensitive",
          },
        },
      },
      skip,
      take,
      include: {
        dokter: {
          include: {
            poli: true,
          },
        },
        pelayanan: true,
      },
    });

    const formatted = mapDokterResponse(jadwalList);

    return {
      dokter: formatted,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / currentPageSize),
      },
    };
  }

  static async updateJadwalDokter({ id_dokter }, { layananList }) {
    const dokter = await prisma.dokter.findUnique({
      where: { id_dokter },
    });
    if (!dokter) {
      throw new NotFoundError(`Dokter dengan ID ${id_dokter} tidak ditemukan.`);
    }

    if (!Array.isArray(layananList) || layananList.length === 0) {
      throw new BadRequestError(
        "Data layananList harus berupa array dan tidak boleh kosong."
      );
    }

    await prisma.jadwalDokter.deleteMany({ where: { id_dokter } });

    for (const layanan of layananList) {
      const { id_pelayanan, hariList } = layanan;
      if (!Array.isArray(hariList) || hariList.length === 0) {
        throw new BadRequestError(
          "Setiap layanan harus memiliki daftar hari (hariList) yang valid."
        );
      }
      const pelayanan = await prisma.pelayanan.findUnique({
        where: { id_pelayanan },
      });

      if (!pelayanan) {
        throw new NotFoundError(
          `Pelayanan dengan ID ${id_pelayanan} tidak ditemukan.`
        );
      }

      for (const hariData of hariList) {
        const { hari, jam_mulai, jam_selesai } = hariData;

        if (!hari || !jam_mulai || !jam_selesai) {
          throw new BadRequestError(
            "Setiap jadwal harus memiliki hari, jam_mulai, dan jam_selesai."
          );
        }

        const normalizedHari =
          hari.charAt(0).toUpperCase() + hari.slice(1).toLowerCase();

        const startHour = parseInt(jam_mulai.split(":")[0]);
        const endHour = parseInt(jam_selesai.split(":")[0]);

        const sesi =
          startHour >= 7 && endHour <= 14
            ? "Pagi"
            : startHour >= 14 && endHour <= 20
            ? "Sore"
            : "Malam";

        await prisma.jadwalDokter.create({
          data: {
            id_dokter,
            id_pelayanan,
            hari: normalizedHari,
            sesi,
            jam_mulai,
            jam_selesai,
          },
        });
      }
    }

    return {
      id_dokter: dokter.id_dokter,
      nama_dokter: dokter.nama,
    };
  }

  static async deleteJadwalByDokterId({ id_dokter }) {
    const dokter = await prisma.dokter.findUnique({ where: { id_dokter } });
    if (!dokter) {
      throw new NotFoundError(`Dokter dengan ID ${id_dokter} tidak ditemukan.`);
    }

    await prisma.jadwalDokter.deleteMany({
      where: { id_dokter },
    });

    return {
      nama_dokter: dokter.nama,
    };
  }
}

module.exports = JadwalDokterService;
