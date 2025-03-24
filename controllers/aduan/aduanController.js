const prisma = require("../../prisma/prismaClient");
class AduanController {
  static async createAduan(req, res) {
    try {
      const { judul, deskripsi, no_wa } = req.body;

      if (!judul || !deskripsi || !no_wa) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Semua field (judul, deskripsi, no_wa) harus diisi.",
        });
      }

      const newAduan = await prisma.aduan.create({
        data: { judul, deskripsi, no_wa, is_read: false },
      });

      res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Aduan berhasil dibuat.",
        data: newAduan,
      });
    } catch (error) {
      console.error("Error creating aduan:", error);

      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async getAduan(req, res) {
    try {
      const aduanList = await prisma.aduan.findMany({
        include: { responAdmin: true },
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Data aduan berhasil diambil.",
        data: aduanList,
      });
    } catch (error) {
      console.error("Error fetching aduan:", error);

      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async getAduanById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID aduan harus disertakan.",
        });
      }

      const aduan = await prisma.aduan.findUnique({
        where: { id_aduan: id },
        include: { responAdmin: true },
      });

      if (!aduan) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Aduan tidak ditemukan.",
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Data aduan berhasil ditemukan.",
        data: aduan,
      });
    } catch (error) {
      console.error("Error fetching aduan by ID:", error);

      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async updateAduan(req, res) {
    try {
      const { id } = req.params;
      const { judul, deskripsi, no_wa } = req.body;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID aduan harus disertakan.",
        });
      }

      if (!judul && !deskripsi && !no_wa) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message:
            "Minimal satu field (judul, deskripsi, atau no_wa) harus diperbarui.",
        });
      }

      const existingAduan = await prisma.aduan.findUnique({
        where: { id_aduan: id },
      });

      if (!existingAduan) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Aduan tidak ditemukan.",
        });
      }

      const updatedAduan = await prisma.aduan.update({
        where: { id_aduan: id },
        data: { judul, deskripsi, no_wa },
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Aduan berhasil diperbarui.",
        data: updatedAduan,
      });
    } catch (error) {
      console.error("Error updating aduan:", error);

      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async deleteAduan(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID aduan harus disertakan.",
        });
      }

      const existingAduan = await prisma.aduan.findUnique({
        where: { id_aduan: id },
      });

      if (!existingAduan) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Aduan tidak ditemukan.",
        });
      }

      await prisma.aduan.delete({
        where: { id_aduan: id },
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Aduan berhasil dihapus.",
      });
    } catch (error) {
      console.error("Error deleting aduan:", error);

      if (error.code === "P2025") {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Aduan tidak ditemukan atau sudah dihapus.",
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

  static async aduanIsRead(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID aduan harus disertakan.",
        });
      }

      const existingAduan = await prisma.aduan.findUnique({
        where: { id_aduan: id },
      });

      if (!existingAduan) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Aduan tidak ditemukan.",
        });
      }

      if (existingAduan.is_read) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Aduan sudah ditandai sebagai dibaca.",
        });
      }

      const updatedAduan = await prisma.aduan.update({
        where: { id_aduan: id },
        data: { is_read: true },
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Aduan telah ditandai sebagai dibaca.",
        data: updatedAduan,
      });
    } catch (error) {
      console.error("Error updating aduan is_read status:", error);

      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async replyAduan(req, res) {
    try {
      const { id } = req.params;
      const id_user = req.user?.id_user;
      const { message } = req.body;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID aduan harus disertakan.",
        });
      }

      if (!id_user) {
        return res.status(403).json({
          statusCode: 403,
          status: "Failed",
          message: "Akses ditolak. User tidak terautentikasi.",
        });
      }

      if (!message || message.trim() === "") {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Pesan tidak boleh kosong.",
        });
      }

      const aduan = await prisma.aduan.findUnique({ where: { id_aduan: id } });

      if (!aduan) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Aduan tidak ditemukan.",
        });
      }

      const response = await prisma.responAdmin.create({
        data: { message, id_user, id_aduan: id },
      });

      await prisma.aduan.update({
        where: { id_aduan: id },
        data: { is_read: true },
      });

      res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Respon berhasil dikirim.",
        data: response,
      });
    } catch (error) {
      console.error("Error replying to aduan:", error);

      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
}

module.exports = AduanController;
