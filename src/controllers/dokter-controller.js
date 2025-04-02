const responseHelper = require("../utils/response");
const dokterService = require("../services/dokter-service");

class DokterController {
  static async createDokter(req, res) {
    try {
      const { nama, id_poli } = req.body;
      const file = req.file;
      const dokter = await dokterService.createDokter(nama, id_poli, file);

      return responseHelper.created(res, dokter, "Dokter berhasil ditambahkan");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async getDokter(req, res) {
    try {
      const dokter = await prisma.dokter.findMany({
        select: {
          id_dokter: true,
          nama: true,
          gambar: true,
          spesialis: {
            select: {
              nama_spesialis: true,
            },
          },
          pelayananDokter: {
            select: {
              nama_pelayanan: true,
            },
          },
        },
      });
      if (!dokter || dokter.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Data dokter tidak ditemukan",
          data: [],
        });
      }

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Data dokter berhasil diambil",
        data: dokter,
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
  static async updateDokter(req, res) {
    try {
      const existingDokter = await prisma.dokter.findUnique({
        where: { id_dokter: dokterId },
      });

      if (!existingDokter) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Dokter not found",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "No file uploaded",
        });
      }
      console.log("Received file:", req.file);

      const stringImage = req.file.buffer.toString("base64");
      const uploadImage = await imageKit.upload({
        fileName: req.file.originalname,
        file: stringImage,
      });

      console.log("Image uploaded to ImageKit:", uploadImage);

      const updatedFile = await prisma.fileUpload.update({
        where: { id: parseInt(req.params.id) },
        data: {
          nama: req.body.nama,
          gambar: uploadImage.url,
          spesialis: {
            update: {
              id_Spesialis: true,
            },
          },
          pelayananDokter: {
            update: {
              id_pelayanan_dokter: true,
            },
          },
        },
      });
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Dokter berhasil diperbarui",
        data: updatedFile,
      });
    } catch (error) {
      console.error("Error in updateFile method:", error);
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async deleteDokter(req, res) {
    try {
      const dokterId = parseInt(req.params.id);

      if (isNaN(dokterId)) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Invalid dokter ID format",
        });
      }

      console.log("Received dokter ID:", dokterId);

      const dokterExists = await prisma.dokter.findUnique({
        where: { id_dokter: dokterId },
      });

      if (!dokterExists) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: `Dokter dengan ID ${dokterId} tidak ditemukan`,
        });
      }

      let deleteResult;
      try {
        deleteResult = await prisma.dokter.delete({
          where: { id_dokter: dokterId },
        });
      } catch (prismaError) {
        console.error("Database error:", prismaError);
        return res.status(500).json({
          statusCode: 500,
          status: "Failed",
          message: "Database error: Unable to delete dokter",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Dokter berhasil dihapus",
        data: deleteResult,
      });
    } catch (error) {
      console.error("Unexpected error in deleteDokter method:", error);
      return res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  }
}

module.exports = DokterController;
