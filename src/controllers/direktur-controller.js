const path = require("path");
const fs = require("fs");
const response = require("../helpers/response-helper");
const prisma = require("../prisma/prismaClient");
class DirekturController {
  static async createDirektur(req, res) {
    try {
      const file = req.file;

      let imageUrl = null;

      if (file) {
        const sharp = require("sharp");
        const path = require("path");
        const fs = require("fs");

        const fileNameWithoutExt = path.parse(file.filename).name;
        const webpFilename = `${fileNameWithoutExt}.webp`;
        const resizedFolder = path.resolve(file.destination, "resized");

        if (!fs.existsSync(resizedFolder)) {
          fs.mkdirSync(resizedFolder, { recursive: true });
        }

        const resizedImagePath = path.resolve(resizedFolder, webpFilename);

        await sharp(file.path).webp({ quality: 50 }).toFile(resizedImagePath);

        fs.unlinkSync(file.path);

        imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${webpFilename}`;
      }

      const data = await prisma.direktur.create({
        data: {
          gambar: imageUrl,
        },
      });

      return response.success(res, data, "Data direktur berhasil ditambahkan");
    } catch (error) {
      return response.error(res, error);
    }
  }

  static async updateDirektur(req, res) {
    const file = req.file;
    const { id_direktur } = req.params;

    // Variabel untuk tracking path file baru (untuk cleanup jika gagal)
    let resizedImagePath = null;
    let originalUploadPath = null;

    try {
      const direktur = await prisma.direktur.findUnique({
        where: { id_direktur },
      });

      if (!direktur) {
        throw new Error("Data direktur tidak ditemukan");
      }

      let imageUrl = direktur.gambar;

      if (file) {
        const sharp = require("sharp");

        // Simpan path file asli untuk dihapus nanti
        originalUploadPath = file.path;

        // Siapkan path folder dan filename webp
        const fileNameWithoutExt = path.parse(file.filename).name;
        const webpFilename = `${fileNameWithoutExt}.webp`;

        const resizedFolder = path.resolve(file.destination, "resized");
        if (!fs.existsSync(resizedFolder)) {
          fs.mkdirSync(resizedFolder, { recursive: true });
        }

        resizedImagePath = path.resolve(resizedFolder, webpFilename);

        // Proses resize dan simpan ke folder resized
        await sharp(file.path).webp({ quality: 50 }).toFile(resizedImagePath);

        // Hapus file mentah setelah resize berhasil
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
          originalUploadPath = null; // supaya tidak dihapus lagi kalau sukses
        }
        if (!file && !direktur.gambar) {
          throw new BadRequestError("Gambar direktur harus ada.");
        }

        // Hapus gambar lama dari direktur jika ada
        if (direktur.gambar) {
          const oldFilename = path.basename(direktur.gambar);
          const oldFilePath = path.resolve("uploads/resized", oldFilename);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        // Set imageUrl baru untuk disimpan di DB
        imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${webpFilename}`;
      }

      const updated = await prisma.direktur.update({
        where: { id_direktur },
        data: { gambar: imageUrl },
      });

      return response.success(
        res,
        updated,
        "Data direktur berhasil diperbarui"
      );
    } catch (error) {
      // Cleanup jika gagal (baik file asli atau file resize)
      if (originalUploadPath && fs.existsSync(originalUploadPath)) {
        fs.unlinkSync(originalUploadPath);
      }
      if (resizedImagePath && fs.existsSync(resizedImagePath)) {
        fs.unlinkSync(resizedImagePath);
      }

      return response.error(res, error);
    }
  }

  static async getDirektur(req, res) {
    try {
      const data = await prisma.direktur.findMany({});

      if (!data) {
        return response.notFound(res, "Data direktur tidak ditemukan");
      }

      return response.success(res, data, "Data direktur berhasil diambil");
    } catch (error) {
      return response.error(res, error);
    }
  }
}

module.exports = DirekturController;
