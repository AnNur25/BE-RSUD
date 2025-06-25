const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error-handling-utils");

class PoliService {
  static async createPoli({ nama_poli }) {
    if (!nama_poli) {
      throw new BadRequestError("Kolom tidak boleh kosong");
    }
    const poliName = nama_poli.trim().toLowerCase();
    if (!poliName) {
      throw new BadRequestError(
        "Kolom tidak boleh kosong"
      );
    }

    let formattedNamaPoli;
    if (poliName === "umum") {
      formattedNamaPoli = "Poli Umum";
    } else if (poliName === "vct") {
      formattedNamaPoli = "Poli VCT";
    } else if (poliName === "gigi") {
      formattedNamaPoli = "Poli Gigi";
    } else {
      formattedNamaPoli = `Poli Spesialis ${nama_poli
        .trim()
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`;
    }

    const poli = await prisma.poli.create({
      data: {
        nama_poli: formattedNamaPoli,
      },
    });

    return poli;
  }

  static async getPoli() {
    const poli = await prisma.poli.findMany({
      select: { id_poli: true, nama_poli: true },
    });

    if (poli.length === 0) {
      throw new NotFoundError("Ops! daftar poli kosong");
    }
    return poli;
  }
  static async getPoliById({ id_poli }) {
    if (!id_poli) {
      throw new BadRequestError("ID Poli wajib disertakan");
    }

    const poli = await prisma.poli.findUnique({
      where: { id_poli },
    });

    if (!poli) {
      throw new NotFoundError(`Poli dengan ID ${id_poli} tidak ditemukan`);
    }

    return poli;
  }
  static async getDokterByPoli({ id_poli }) {
    try {
      if (!id_poli) {
        throw new BadRequestError("ID Poli wajib diisi");
      }

      const poli = await prisma.poli.findUnique({
        where: { id_poli },
      });
      if (!poli) {
        throw new NotFoundError("Poli tidak ditemukan");
      }
      const dokter = await prisma.dokter.findMany({
        where: { id_poli },
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
  static async updatePoli({ id_poli }, { nama_poli }) {
    if (!id_poli || !nama_poli) {
      throw new BadRequestError("Kolom tidak boleh kosong");
    }
    const poliExist = await prisma.poli.findUnique({
      where: { id_poli },
    });
    if (!poliExist) {
      throw new NotFoundError(`Poli dengan ID ${id_poli} tidak ditemukan`);
    }

    let formattedNamaPoli;
    const poliName = nama_poli.trim().toLowerCase();
    if (poliName === "umum") {
      formattedNamaPoli = "Poli Umum";
    } else if (poliName === "vct") {
      formattedNamaPoli = "Poli VCT";
    } else if (poliName === "gigi") {
      formattedNamaPoli = "Poli Gigi";
    } else {
      formattedNamaPoli = `Poli Spesialis ${nama_poli
        .trim()
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`;
    }
    await prisma.poli.update({
      where: { id_poli },
      data: { nama_poli: formattedNamaPoli },
    });
    return formattedNamaPoli;
  }
}

module.exports = PoliService;
