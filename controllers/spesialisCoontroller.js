const prisma = require("../prisma/prismaClient");

class SpesialisController {
  static async createSpesialis(req, res) {
    const { nama_spesialis, deskripsi } = req.body;
    try {
      if (!req.user) {
        throw new Error(
          "User tidak ditemukan dalam request. Pastikan sudah login."
        );
      }

      const userId = req.user.id_user;
      const spesialis = await prisma.spesialis.create({
        data: {
          nama_spesialis,
          deskripsi,
          user: {
            connect: { id_user: userId },
          },
        },
      });
      res.json(spesialis);
    } catch (error) {
      res.json({ error: error.message });
    }
  }

  static async getSpesialis(req, res) {
    try {
      const spesialis = await prisma.spesialis.findMany({
        select: {
          id_Spesialis: true,
          nama_spesialis: true,
          deskripsi: true,
        },
      });
      res.json(spesialis);
    } catch (error) {
      res.json({ error: error.message });
    }
  }

  static async updateSpesialis(req, res) {
    const { id } = req.params;
    const { nama_spesialis, deskripsi } = req.body;
    try {
      const spesialis = await prisma.spesialis.update({
        where: { id_Spesialis: parseInt(id) },
        data: { nama_spesialis, deskripsi },
      });
      res.json(spesialis);
    } catch (error) {
      res.json({ error: error.message });
    }
  }

  static async deleteSpesialis(req, res) {
    const { id } = req.params;
    try {
      const spesialis = await prisma.spesialis.delete({
        where: { id_Spesialis : parseInt(id) },
      });
      res.json(spesialis);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
}

module.exports = SpesialisController;
