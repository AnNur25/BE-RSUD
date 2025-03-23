const prisma = require("../../prisma/prismaClient");

class SpesialisController {
  static async createSpesialis(req, res) {
    try {
      const { nama_spesialis, deskripsi } = req.body;
      if (!nama_spesialis || !deskripsi) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Nama spesialis dan deskripsi harus diisi",
        });
      }
      if (!req.user.id_user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "User tidak ditemukan. Pastikan sudah login.",
        });
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
      return res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Spesialis berhasil ditambahkan",
        data: spesialis,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
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
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Data spesialis berhasil diambil",
        data: spesialis,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async updateSpesialis(req, res) {
    try {
      const spesialisId = parseInt(req.params.id);
      const { nama_spesialis, deskripsi } = req.body;
      if (isNaN(spesialisId)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Format ID spesialis tidak valid",
        });
      }

      const spesialisExists = await prisma.spesialis.findUnique({
        where: { id_Spesialis: spesialisId },
      });

      if (!spesialisExists) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Spesialis dengan ID ${spesialisId} tidak ditemukan`,
        });
      }

      const spesialis = await prisma.spesialis.update({
        where: { id_Spesialis: spesialisId },
        data: { nama_spesialis, deskripsi },
      });
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Spesialis berhasil diperbarui",
        data: spesialis,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async deleteSpesialis(req, res) {
    try {
      const spesialisId = parseInt(req.params.id);
      if (isNaN(spesialisId)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Format ID spesialis tidak valid",
        });
      }
      const spesialisExists = await prisma.spesialis.findUnique({
        where: { id_Spesialis: spesialisId },
      });
      if (!spesialisExists) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Spesialis dengan ID ${spesialisId} tidak ditemukan`,
        });
      }
      const spesialis = await prisma.spesialis.delete({
        where: { id_Spesialis: spesialisId },
      });
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Spesialis berhasil dihapus",
        data: spesialis,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
}

module.exports = SpesialisController;
