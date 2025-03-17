const prisma = require("../prisma/prismaClient");

class PelayananDokterController {
  static async createPelayananDokter(req, res) {
    const { nama_pelayanan, deskripsi } = req.body;
    const userId = req.user.id_user;
    try {
      const pelayananDokter = await prisma.pelayananDokter.create({
        data: {
          nama_pelayanan,
          deskripsi,
          user: {
            connect: { id_user: userId },
          },
        },
      });
      res.json(pelayananDokter);
    } catch (error) {
      res.json({ error: error.message });
    }
  }

  static async getPelayananDokter(req, res) {
    try {
      const pelayananDokter = await prisma.pelayananDokter.findMany({
        select: {
          id_pelayanan_dokter: true,
          nama_pelayanan: true,
          deskripsi: true,
        },
      });
      res.json(pelayananDokter);
    } catch (error) {
      res.json({ error: error.message });
    }
  }

  static async updatePelayananDokter(req, res) {
    const { id } = req.params;
    const { nama_pelayanan, deskripsi } = req.body;
    try {
      const pelayananDokter = await prisma.pelayananDokter.update({
        where: { id_pelayanan_dokter: parseInt(id) },
        data: { nama_pelayanan, deskripsi },
      });
      res.json(pelayananDokter);
    } catch (error) {
      res.json({ error: error.message });
    }
  }

  static async deletePelayananDokter(req, res) {
    const { id } = req.params;
    try {
      const pelayananDokter = await prisma.pelayananDokter.delete({
        where: { id_pelayanan_dokter: parseInt(id) },
      });
      res.json(pelayananDokter);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
}
module.exports = PelayananDokterController;
