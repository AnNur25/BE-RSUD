const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const Pagination = require("../utils/pagination");

class JadwalDokterService {
  static async getDokterByPoli({ id_poli }) {
    try {
      if (!id_poli) {
        throw new BadRequestError("ID Poli wajib diisi");
      }
      const dokter = await prisma.dokter.findMany({
        where: {
          id_poli: id_poli,
        },
        select: {
          id_dokter: true,
          nama: true,
        },
      });
      if (dokter.length === 0) {
        throw new NotFoundError(
          `Tidak ada dokter ditemukan untuk poli tersebut`
        );
      }
      return dokter;
    } catch (error) {
      throw error;
    }
  }

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

    const jadwalDokter = await prisma.jadwalDokter.findMany({
      skip,
      take,
      include: {
        dokter: {
          select: {
            id_dokter: true,
            nama: true,
            poli: {
              select: {
                id_poli: true,
                nama_poli: true,
              },
            },
          },
        },
        pelayanan: {
          select: {
            id_pelayanan: true,
            nama_pelayanan: true,
          },
        },
      },
    });

    if (!jadwalDokter || jadwalDokter.length === 0) {
      throw new NotFoundError("Data jadwal dokter belum tersedia");
    }

    const groupedJadwal = {};

    jadwalDokter.forEach((jadwal) => {
      const { dokter, pelayanan } = jadwal;
      const { id_dokter, nama, poli } = dokter;
      const { id_pelayanan, nama_pelayanan } = pelayanan;

      if (!groupedJadwal[id_dokter]) {
        groupedJadwal[id_dokter] = {
          id_dokter,
          nama_dokter: nama,
          poli: {
            id: poli.id_poli,
            nama: poli.nama_poli,
          },
          layananList: [],
        };
      }

      let layanan = groupedJadwal[id_dokter].layananList.find(
        (l) => l.id_pelayanan === id_pelayanan
      );

      if (!layanan) {
        layanan = {
          id_pelayanan,
          nama_pelayanan,
          hariList: [],
        };
        groupedJadwal[id_dokter].layananList.push(layanan);
      }

      layanan.hariList.push({
        hari: jadwal.hari,
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
      });
    });

    return {
      dokter: Object.values(groupedJadwal),
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

    const paginatedJadwal = await prisma.jadwalDokter.findMany({
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
          select: {
            id_dokter: true,
            nama: true,
            gambar: true,
            poli: {
              select: {
                id_poli: true,
                nama_poli: true,
              },
            },
          },
        },
        pelayanan: {
          select: {
            id_pelayanan: true,
            nama_pelayanan: true,
          },
        },
      },
    });

    const grouped = {};

    paginatedJadwal.forEach((item) => {
      const { dokter, pelayanan } = item;

      if (!grouped[dokter.id_dokter]) {
        grouped[dokter.id_dokter] = {
          id_dokter: dokter.id_dokter,
          nama_dokter: dokter.nama,
          gambar_dokter: dokter.gambar,
          poli: dokter.poli,
          pelayanan: [],
        };
      }

      let layanan = grouped[dokter.id_dokter].pelayanan.find(
        (l) => l.id_pelayanan === pelayanan.id_pelayanan
      );

      if (!layanan) {
        layanan = {
          id_pelayanan: pelayanan.id_pelayanan,
          nama_pelayanan: pelayanan.nama_pelayanan,
          jadwal: [],
        };
        grouped[dokter.id_dokter].pelayanan.push(layanan);
      }

      layanan.jadwal.push({
        hari: item.hari,
        sesi: item.sesi || "-",
        jam_mulai: item.jam_mulai,
        jam_selesai: item.jam_selesai,
      });
    });

    const hasil = Object.values(grouped);

    return {
      dokter: hasil,
      pagination: {
        currentPage,
        pageSize: currentPageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / currentPageSize),
      },
    };
  }
  static async getJadwalDokterById({ id_dokter }) {
    const dokter = await prisma.dokter.findUnique({
      where: { id_dokter },
      select: {
        id_dokter: true,
        nama: true,
        jadwalDokter: {
          select: {
            id_pelayanan: true,
            hari: true,
            jam_mulai: true,
            jam_selesai: true,
          },
        },
      },
    });

    if (!dokter) {
      throw new NotFoundError(`Dokter dengan ID ${id_dokter} tidak ditemukan.`);
    }

    const layananMap = new Map();

    dokter.jadwalDokter.forEach((jadwal) => {
      const key = jadwal.id_pelayanan;
      if (!layananMap.has(key)) {
        layananMap.set(key, []);
      }
      layananMap.get(key).push({
        hari: jadwal.hari,
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
      });
    });

    const layananList = Array.from(layananMap.entries()).map(
      ([id_pelayanan, hariList]) => ({
        id_pelayanan,
        hariList,
      })
    );

    return {
      id_dokter: dokter.id_dokter,
      nama_dokter: dokter.nama,
      layananList,
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
