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
}

module.exports = SpesialisController;
