const { BadRequestError, NotFoundError } = require("../utils/error");
const prisma = require("../prisma/prismaClient");
const { connect } = require("../routes/berita-route");
class komentarService {
  static async addKomentar({ id_berita, nama, no_wa, isi_komentar }) {
    if (!id_berita || !nama || !no_wa || !isi_komentar) {
      throw new BadRequestError("Semua field wajib di isi");
    }

    const dataKomentar = await prisma.komentar.create({
      data: {
        nama,
        no_wa,
        isi_komentar,
        berita: { connect: { id_berita } },
      },
    });
    return dataKomentar;
  }
  //   static async listKomentar({}) {}
  //   static async isVisibleKomentar({}) {}
  //   static async deleteKomentar({}) {}
}

module.exports = komentarService;
