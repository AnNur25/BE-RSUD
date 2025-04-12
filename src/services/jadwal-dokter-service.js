const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");

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

  static async getAllJadwalDokter() {
    const jadwalDokter = await prisma.jadwalDokter.findMany({
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
    };
  }

  static async searchJadwalDokter({ id_poli, tanggal }) {
    if (!id_poli || !tanggal) {
      throw new BadRequestError("ID Poli dan tanggal wajib diisi");
    }
    const namaHari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const tanggalObjek = new Date(tanggal);
    const namaHariSekarang = namaHari[tanggalObjek.getDay()];

    const daftarJadwal = await prisma.jadwalDokter.findMany({
      where: {
        hari: namaHariSekarang,
        dokter: {
          id_poli: id_poli,
        },
      },
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

    if (daftarJadwal.length === 0) {
      throw new NotFoundError(
        `Tidak ada jadwal dokter pada hari ${namaHariSekarang} (${tanggal}).`
      );
    }

    const hasilGroupJadwal = {};

    for (const itemJadwal of daftarJadwal) {
      const { dokter, pelayanan } = itemJadwal;

      if (!hasilGroupJadwal[dokter.id_dokter]) {
        hasilGroupJadwal[dokter.id_dokter] = {
          id_dokter: dokter.id_dokter,
          nama_dokter: dokter.nama,
          poli: dokter.poli,
          layananList: [],
        };
      }

      const layananYangSama = hasilGroupJadwal[
        dokter.id_dokter
      ].layananList.find(
        (layanan) => layanan.id_pelayanan === pelayanan.id_pelayanan
      );

      if (layananYangSama) {
        layananYangSama.hariList.push({
          hari: itemJadwal.hari,
          jam_mulai: itemJadwal.jam_mulai,
          jam_selesai: itemJadwal.jam_selesai,
        });
      } else {
        hasilGroupJadwal[dokter.id_dokter].layananList.push({
          id_pelayanan: pelayanan.id_pelayanan,
          nama_pelayanan: pelayanan.nama_pelayanan,
          hariList: [
            {
              hari: itemJadwal.hari,
              jam_mulai: itemJadwal.jam_mulai,
              jam_selesai: itemJadwal.jam_selesai,
            },
          ],
        });
      }
    }

    const daftarDokter = Object.values(hasilGroupJadwal);

    return {
      hari: namaHariSekarang,
      dokter: daftarDokter,
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
