const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const responseHelper = require("../helpers/response-helper");
const prisma = require("../prisma/prismaClient");
const {
  BadRequestError,
  NotFoundError,
} = require("../utils/error-handling-utils");
class LayananUnggulanController {
  static async updateLayananUnggulan(req, res) {
    const { id } = req.params;
    const { judul, deskripsi, existingImages, gambarCaption } = req.body;
    const files = req.files;
    const resizedFiles = [];

    try {
      // VALIDASI DATA DASAR
      if (!judul || !deskripsi) {
        throw new BadRequestError("Judul dan deskripsi harus diisi");
      }

      const layanan = await prisma.layananUnggulan.findUnique({
        where: { id_layanan_unggulan: id },
        include: { gambarCaptions: true },
      });

      if (!layanan) {
        throw new NotFoundError("Layanan tidak ditemukan");
      }

      const jumlahGambarSaatIni = layanan.gambarCaptions.length;
      const jumlahFileBaru = files?.length || 0;
      const totalGambar = jumlahGambarSaatIni + jumlahFileBaru;

      if (totalGambar > 4) {
        throw new BadRequestError(
          `Maksimal 4 gambar-caption untuk setiap layanan. Saat ini sudah ada ${jumlahGambarSaatIni} gambar-caption dan Anda mencoba menambah ${jumlahFileBaru}.`
        );
      }

      // PARSING EXISTING IMAGES
      let parsedExistingImages = [];
      try {
        parsedExistingImages = JSON.parse(existingImages);
      } catch (error) {
        throw new BadRequestError("Format existingImages tidak valid");
      }

      const existingIds = parsedExistingImages.map((img) => img.id);
      const totalGambarSetelahUpdate = existingIds.length + jumlahFileBaru;

      if (totalGambarSetelahUpdate < 1) {
        throw new BadRequestError(
          "Layanan harus memiliki minimal 1 gambar-caption."
        );
      }

      // PARSING CAPTIONS
      let parsedGambarCaptions = [];
      if (gambarCaption) {
        try {
          parsedGambarCaptions = JSON.parse(gambarCaption);
        } catch (error) {
          throw new BadRequestError("Format gambarCaption tidak valid");
        }
      }

      // PROSES GAMBAR hanya setelah validasi lolos
      let uploadedImages = [];

      if (files && files.length > 0) {
        const resizedFolder = path.resolve(files[0].destination, "resized");
        if (!fs.existsSync(resizedFolder)) {
          fs.mkdirSync(resizedFolder, { recursive: true });
        }

        const uploadPromises = files.map(async (file, index) => {
          const fileNameWithoutExt = path.parse(file.filename).name;
          const webpFilename = `${fileNameWithoutExt}.webp`;
          const resizedImagePath = path.resolve(resizedFolder, webpFilename);

          try {
            // resize hanya dilakukan jika validasi di atas sudah lolos
            await sharp(file.path)
              .webp({ quality: 50 })
              .toFile(resizedImagePath);

            resizedFiles.push(resizedImagePath);

            // Hapus file asli yang belum diubah
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

            const imageUrl = `${process.env.FRONTEND_URL}/uploads/resized/${webpFilename}`;
            return {
              url: imageUrl,
              originalName: file.originalname,
            };
          } catch (err) {
            // Jika resize gagal, hapus file asli dan lempar error
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            throw new Error(`Gagal memproses gambar: ${file.originalname}`);
          }
        });

        uploadedImages = await Promise.all(uploadPromises);
      }

      // TRANSAKSI DIMULAI HANYA JIKA VALIDASI DAN PROSES FILE LANCAR
      await prisma.$transaction(async (tx) => {
        await tx.layananUnggulan.update({
          where: { id_layanan_unggulan: id },
          data: { judul, deskripsi },
        });

        const gambarToDelete = await tx.gambarCaption.findMany({
          where: {
            layananId: id,
            id: { notIn: existingIds },
          },
        });

        await tx.gambarCaption.deleteMany({
          where: {
            layananId: id,
            id: { notIn: existingIds },
          },
        });

        // Hapus file lokal dari gambar yang dihapus dari DB
        gambarToDelete.forEach((gambar) => {
          const fileName = path.basename(gambar.gambar);
          const filePath = path.resolve("uploads/resized", fileName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });

        // Update caption existing
        const updatePromises = parsedExistingImages.map((img) =>
          tx.gambarCaption.update({
            where: { id: img.id },
            data: { caption: img.caption },
          })
        );
        await Promise.all(updatePromises);

        // Tambah gambar baru
        if (uploadedImages.length > 0) {
          await tx.gambarCaption.createMany({
            data: uploadedImages.map((img, index) => ({
              layananId: id,
              gambar: img.url,
              nama_file: img.originalName,
              caption: parsedGambarCaptions?.[index]?.caption || "",
            })),
          });
        }
      });

      // Jika semua sukses
      responseHelper.success(res, null, "Perubahan berhasil disimpan");
    } catch (error) {
      // Jika ada error, bersihkan SEMUA FILE (resized maupun raw)
      [...resizedFiles, ...(files?.map((f) => f.path) || [])].forEach(
        (filePath) => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      );

      responseHelper.error(res, error);
    }
  }

  static async getAllLayananUnggulan(req, res) {
    try {
      const layananUnggulanList = await prisma.layananUnggulan.findMany({
        include: {
          gambarCaptions: true,
        },
      });

      const formattedResponse = layananUnggulanList.map((layanan) => ({
        id_layanan_unggulan: layanan.id_layanan_unggulan,
        judul: layanan.judul,
        deskripsi: layanan.deskripsi,
        gambar_captions: layanan.gambarCaptions.map((caption) => ({
          id: caption.id,
          gambar: caption.gambar,
          nama_file: caption.nama_file,
          caption: caption.caption,
          layananId: caption.layananId,
        })),
      }));

      const responseData =
        formattedResponse.length === 1
          ? formattedResponse[0]
          : formattedResponse;

      responseHelper.success(
        res,
        responseData,
        "Berhasil mendapatkan semua layanan unggulan"
      );
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
}

module.exports = LayananUnggulanController;
