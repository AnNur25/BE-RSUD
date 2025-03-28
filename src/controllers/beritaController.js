const prisma = require("../prisma/prismaClient");
const imageKit = require("../config/imagekit");
class Berita {
  static async createBerita(req, res) {
    try {
      if (!req.user.id_user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "Unauthorized: User ID not found",
        });
      }

      const userId = req.user.id_user;

      if (!req.file) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "No file uploaded",
        });
      }

      const { judul, ringkasan, isi, tanggal_terbit } = req.body;

      if (!tanggal_terbit || isNaN(Date.parse(tanggal_terbit))) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      const parsedDate = new Date(tanggal_terbit);

      console.log("Received file:", req.file);

      const stringImage = req.file.buffer.toString("base64");
      const uploadImage = await imageKit.upload({
        fileName: req.file.originalname,
        file: stringImage,
      });

      console.log("Image uploaded to ImageKit:", uploadImage);

      const beritaBaru = await prisma.berita.create({
        data: {
          judul,
          ringkasan,
          isi,
          gambar_sampul: uploadImage.url,
          tanggal_terbit: parsedDate,
          id_user: userId,
        },
      });

      const formattedDate = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(beritaBaru.tanggal_terbit));

      return res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Berita berhasil dibuat",
        berita: {
          id: beritaBaru.id_berita,
          judul: beritaBaru.judul,
          ringkasan: beritaBaru.ringkasan,
          isi: beritaBaru.isi,
          gambar_sampul: beritaBaru.gambar_sampul,
          tanggal_terbit: formattedDate,
          dibuat_pada: new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(beritaBaru.createdAt)),
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

  static async getBerita(req, res) {
    try {
      const berita = await prisma.berita.findMany({
        include: { gambar_tambahan: true, user: true },
      });
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "berhasil menampilkan berita",
        data: berita,
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

  static async updateBerita(req, res) {
    try {
      if (!req.user.id_user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "Unauthorized: User ID not found",
        });
      }

      const userId = req.user.id_user;
      const id_berita = req.params.id;

      if (!id_berita) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "ID Berita is required",
        });
      }

      const { judul, ringkasan, isi, tanggal_terbit } = req.body;
      let gambar_sampul = null;

      if (tanggal_terbit && isNaN(Date.parse(tanggal_terbit))) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      const berita = await prisma.berita.findUnique({
        where: { id_berita: id_berita },
      });

      if (!berita) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Berita not found",
        });
      }

      if (berita.id_user !== userId) {
        return res.status(403).json({
          statusCode: 403,
          status: "Failed",
          message:
            "Forbidden: You do not have permission to update this berita",
        });
      }

      if (req.file) {
        console.log("Received file:", req.file);
        const stringImage = req.file.buffer.toString("base64");
        const uploadImage = await imageKit.upload({
          fileName: req.file.originalname,
          file: stringImage,
        });
        console.log("Image uploaded to ImageKit:", uploadImage);
        gambar_sampul = uploadImage.url;
      }

      const updatedBerita = await prisma.berita.update({
        where: { id_berita: id_berita },
        data: {
          judul: judul || berita.judul,
          ringkasan: ringkasan || berita.ringkasan,
          isi: isi || berita.isi,
          gambar_sampul: gambar_sampul || berita.gambar_sampul,
          tanggal_terbit: tanggal_terbit
            ? new Date(tanggal_terbit)
            : berita.tanggal_terbit,
        },
      });

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Berita berhasil diperbarui",
        berita: updatedBerita,
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

  static async deleteBerita(req, res) {
    try {
      const { id } = req.params;

      const berita = await prisma.berita.findUnique({
        where: { id_berita: id },
      });

      if (!berita) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "Berita tidak ditemukan",
        });
      }

      await prisma.berita.delete({
        where: { id_berita: id },
      });

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Berita berhasil dihapus",
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

module.exports = Berita;
