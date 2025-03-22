const prisma = require("../prisma/prismaClient");

class JamKerjaController {
  static async createJamKerja(req, res) {
    try {
      const userId = parseInt(req.user.id_user);
      const { jam_mulai, jam_selesai } = req.body;

      if (!jam_mulai || !jam_selesai) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "jam mulai dan jam selesai wajib diisi.",
        });
      }

      const today = new Date();
      const toDateTime = (timeString) => {
        const [hour, minute] = timeString.split(":").map(Number);
        return new Date(today.setHours(hour, minute, 0, 0));
      };

      const newJamKerja = await prisma.jamkerja.create({
        data: {
          jam_mulai: toDateTime(jam_mulai),
          jam_selesai: toDateTime(jam_selesai),
          user: { connect: { id_user: userId } },
        },
      });

      res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Jam kerja berhasil ditambahkan.",
        data: {
          id_Jamkerja: newJamKerja.id_Jamkerja,
          jam_mulai: jam_mulai,
          jam_selesai: jam_selesai,
        },
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
  static async getJamKerja(req, res) {
    try {
      const allJamKerja = await prisma.jamkerja.findMany();
      const formatTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toTimeString().slice(0, 5); //format "HH:mm"
      };
      const formattedData = allJamKerja.map((jamkerja) => ({
        id_Jamkerja: jamkerja.id_Jamkerja,
        jam_mulai: formatTime(jamkerja.jam_mulai),
        jam_selesai: formatTime(jamkerja.jam_selesai),
      }));
      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "berhasil menampilkan jam kerja",
        data: formattedData,
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
  static async updateJamKerja(req, res) {
    try {
      const userId = parseInt(req.user.id_user);
      const id = parseInt(req.params.id);
      const { jam_mulai, jam_selesai } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Format ID tidak valid.",
        });
      }

      const existingData = await prisma.jamkerja.findUnique({
        where: { id_Jamkerja: id },
      });

      if (!existingData) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Jam kerja dengan ID ${id} tidak ditemukan.`,
        });
      }

      const today = new Date();
      const toDateTime = (timeString) => {
        const [hour, minute] = timeString.split(":").map(Number);
        return new Date(today.setHours(hour, minute, 0, 0));
      };

      const updateJamKerja = await prisma.jamkerja.update({
        where: { id_Jamkerja: id },
        data: {
          jam_mulai: toDateTime(jam_mulai),
          jam_selesai: toDateTime(jam_selesai),
          user: { connect: { id_user: userId } },
        },
      });

      res.status(200).json({
        statusCode: 201,
        status: "Success",
        message: "Jam kerja berhasil dirubah.",
        data: {
          id_Jamkerja: updateJamKerja.id_Jamkerja,
          jam_mulai: jam_mulai,
          jam_selesai: jam_selesai,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Jam kerja dengan ID ${req.params.id} tidak ditemukan.`,
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
  static async deleteJamKerja(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Format ID tidak valid.",
        });
      }

      const existingData = await prisma.jamkerja.findUnique({
        where: { id_Jamkerja: id },
      });

      if (!existingData) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Jam kerja dengan ID ${id} tidak ditemukan.`,
        });
      }

      await prisma.jamkerja.delete({
        where: { id_Jamkerja: id },
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Jam kerja berhasil dihapus.",
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Jam kerja dengan ID ${req.params.id} tidak ditemukan.`,
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

module.exports = JamKerjaController;
