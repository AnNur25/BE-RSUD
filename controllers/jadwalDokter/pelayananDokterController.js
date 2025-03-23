const prisma = require("../../prisma/prismaClient");

class PelayananDokterController {
  static async createPelayananDokter(req, res) {
    try {
      const { nama_pelayanan, deskripsi } = req.body;
      if (!nama_pelayanan || !deskripsi) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Nama pelayanan dan deskripsi wajib diisi.",
        });
      }
      if (!req.user || !req.user.id_user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "User tidak ditemukan. Pastikan sudah login.",
        });
      }
      const userId = req.user.id_user;
      const pelayananDokter = await prisma.pelayananDokter.create({
        data: {
          nama_pelayanan,
          deskripsi,
          user: {
            connect: { id_user: userId },
          },
        },
      });
      return res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Pelayanan Dokter berhasil dibuat.",
        data: pelayananDokter,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
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
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Data pelayanan dokter berhasil diambil.",
        data: pelayananDokter,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async updatePelayananDokter(req, res) {
    try {
      const { id } = req.params;
      const { nama_pelayanan, deskripsi } = req.body;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID pelayanan dokter diperlukan.",
        });
      }

      const pelayananDokter = await prisma.pelayananDokter.update({
        where: { id_pelayanan_dokter: parseInt(id) },
        data: { nama_pelayanan, deskripsi },
      });
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Pelayanan Dokter berhasil diperbarui.",
        data: pelayananDokter,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Pelayanan Dokter tidak ditemukan.",
        });
      }
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async deletePelayananDokter(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID pelayanan dokter diperlukan.",
        });
      }

      await prisma.pelayananDokter.delete({
        where: { id_pelayanan_dokter: parseInt(id) },
      });

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Pelayanan Dokter berhasil dihapus.",
      });
    } catch (error) {
      console.error("Error in deletePelayananDokter:", error);
      if (error.code === "P2025") {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Pelayanan Dokter tidak ditemukan.",
        });
      }
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
}
module.exports = PelayananDokterController;
