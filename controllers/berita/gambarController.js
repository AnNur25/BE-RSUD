const prisma = require("../../prisma/prismaClient");
const imageKit = require("../../config/imagekit");
class GambarTambahan {
  static async uploadGambar(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id_user;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "No files uploaded",
        });
      }

      console.log("Received files:", req.files);

      if (req.files.length > 4) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Maksimal 4 gambar diperbolehkan",
        });
      }

      const uploadPromises = req.files.map(async (file) => {
        const stringImage = file.buffer.toString("base64");
        return await imageKit.upload({
          fileName: file.originalname,
          file: stringImage,
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);

      const gambarData = uploadedImages.map((image) => ({
        url: image.url,
        beritaId: id,
        id_user: userId,
      }));

      await prisma.gambar.createMany({ data: gambarData });

      res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Gambar tambahan berhasil diunggah",
        data: gambarData,
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

  static async getGambarByBerita(req, res) {
    try {
      const { id } = req.params;

      const gambarList = await prisma.gambar.findMany({
        where: { beritaId: id },
        select: { id: true, url: true },
      });

      if (gambarList.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Tidak ada gambar untuk berita ini",
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Gambar berhasil ditemukan",
        gambar: gambarList,
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

  static async deleteGambar(req, res) {
    try {
      const { id } = req.params;

      const gambar = await prisma.gambar.findUnique({
        where: { id_gambar: id },
      });

      if (!gambar) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Gambar tidak ditemukan",
        });
      }

      await prisma.gambar.delete({
        where: { id_gambar: id },
      });

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Gambar berhasil dihapus",
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
}

module.exports = GambarTambahan;
