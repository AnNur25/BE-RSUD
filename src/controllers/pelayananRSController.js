const prisma = require("../prisma/prismaClient");

class PelayananRSController {
  static async createPelayananRS(req, res) {
    try {
      if (!req.user || !req.user.id_user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "User tidak ditemukan. Pastikan sudah login",
        });
      }

      const { Persyaratan, Prosedur, JangkaWaktu, Biaya } = req.body;
      const userId = req.user.id_user;

      const newPelayanan = await prisma.pelayananRumahSakit.create({
        data: {
          Persyaratan,
          Prosedur,
          JangkaWaktu,
          Biaya,
          user: { connect: { id_user: userId } },
        },
      });

      res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Pelayanan Rumah Sakit berhasil ditambahkan",
        data: newPelayanan,
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

  static async getPelayananRS(req, res) {
    try {
      const data = await prisma.pelayananRumahSakit.findMany();
      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Berhasil mendapatkan data pelayanan",
        data,
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

  static async updatePelayananRS(req, res) {
    try {
      if (!req.user || !req.user.id_user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "Unauthorized. Silakan login terlebih dahulu.",
        });
      }
      const userId = parseInt(req.user.id_user);
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Format ID pelayanan tidak valid.",
        });
      }
      const { Persyaratan, Prosedur, JangkaWaktu, Biaya } = req.body;
      if (!Persyaratan || !Prosedur || !JangkaWaktu || Biaya === undefined) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message:
            "Semua field (Persyaratan, Prosedur, JangkaWaktu, Biaya) harus diisi.",
        });
      }

      const existingData = await prisma.pelayananRumahSakit.findUnique({
        where: { id_pelayananRS: id },
      });

      if (!existingData) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Pelayanan Rumah Sakit dengan ID ${id} tidak ditemukan.`,
        });
      }
      const updatedData = await prisma.pelayananRumahSakit.update({
        where: { id_pelayananRS: id },
        data: {
          Persyaratan,
          Prosedur,
          JangkaWaktu,
          Biaya,
          user: { connect: { id_user: userId } },
        },
      });

      res.status(200).json({
        status: "Success",
        message: "Data berhasil diperbarui",
        data: updatedData,
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

  static async deletePelayananRS(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Format ID pelayanan tidak valid.",
        });
      }
      const existingData = await prisma.pelayananRumahSakit.findUnique({
        where: { id_pelayananRS: id },
      });

      if (!existingData) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Pelayanan Rumah Sakit dengan ID ${id} tidak ditemukan.`,
        });
      }
      await prisma.pelayananRumahSakit.delete({
        where: { id_pelayananRS: id },
      });
      res
        .status(200)
        .json({ status: "Success", message: "Data berhasil dihapus" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Pelayanan Rumah Sakit dengan ID ${req.params.id} tidak ditemukan.`,
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
}

module.exports = PelayananRSController;
