const prisma = require("../prisma/prismaClient");
const imageKit = require("../config/imagekit");

class DokterController {
  static async createDokter(req, res) {
    try {
      console.log("Request Body:", req.body);
      const userId = req.user.id_user;
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      console.log("Received file:", req.file);

      const stringImage = req.file.buffer.toString("base64");
      const uploadImage = await imageKit.upload({
        fileName: req.file.originalname,
        file: stringImage,
      });

      console.log("Image uploaded to ImageKit:", uploadImage);
      const addData = await prisma.dokter.create({
        data: {
          nama: req.body.nama,
          kontak: req.body.kontak,
          gambar: uploadImage.url,
          user: {
            connect: { id_user: userId },
          },
          spesialis: {
            connect: { id_Spesialis: parseInt(req.body.id_Spesialis) },
          },
          pelayananDokter: {
            connect: {
              id_pelayanan_dokter: parseInt(req.body.id_pelayanan_dokter),
            },
          },
        },
      });

      return res.status(201).json({
        status: 201,
        message: "Successfully added uploaded file",
        data: addData,
      });
    } catch (error) {
      console.error("Error in addFile method:", error);
      return res.status(500).json({
        status: 500,
        message: "Failed to add uploaded file",
        error: error.message,
      });
    }
  }
  static async getDokter(req, res) {
    try {
      const dokter = await prisma.dokter.findMany({
        select: {
          id_dokter: true,
          nama: true,
          kontak: true,
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
      res.json(dokter);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
  static async updateDokter(req, res) {
    console.log("Request Body:", req.body);
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
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
          kontak: req.body.kontak,
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
        status: 200,
        message: "Successfully updated file",
        data: updatedFile,
      });
    } catch (error) {
      console.error("Error in updateFile method:", error);
      return res.status(500).json({
        status: 500,
        message: "Failed to update file",
        error: error.message,
      });
    }
  }

  static async deleteDokter(req, res) {
    const { id } = req.params;
    console.log("Received fileUpload ID:", id);
    try {
      const fileUploadExists = await prisma.dokter.findUnique({
        where: { id },
        include: { image: true },
      });

      if (!fileUploadExists) {
        return res.status(404).json({
          status: 404,
          message: `FileUpload with ID ${id} not found`,
        });
      }

      const result = await prisma.$transaction([
        prisma.fileUpload.delete({
          where: { id },
        }),
      ]);

      res.status(200).json({
        status: 200,
        message: "Successfully deleted fileUpload and its associated image",
        data: result,
      });
    } catch (error) {
      console.error(error, "Error while deleting fileUpload and image");
      return res.status(500).json({
        status: 500,
        message: "Failed to delete fileUpload and associated image",
        error: error.message,
      });
    }
  }
}

module.exports = DokterController;
