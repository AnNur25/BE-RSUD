const layananUnggulanService = require("../services/layanan-unggulan-service");
const prisma = require("../prisma/prismaClient");
const imageKit = require("../configs/imagekit-config");
const responseHelper = require("../utils/response");
const { BadRequestError } = require("../utils/error");
class LayananUnggulanController {
  static async createLayananUnggulan(req, res) {
    try {
      const { judul, deskripsi } = req.body;
      const files = req.files;

      // Validasi input
      if (!judul || !deskripsi) {
        throw new BadRequestError("Judul dan deskripsi harus diisi");
      }

      if (!files || files.length === 0) {
        throw new BadRequestError("Minimal 1 gambar harus diupload");
      }

      if (files.length > 4) {
        throw new BadRequestError("Maksimal 4 gambar yang dapat diupload");
      }

      const uploadPromises = files.map(async (file) => {
        const stringImage = file.buffer.toString("base64");
        const uploadedImage = await imageKit.upload({
          fileName: file.originalname,
          file: stringImage,
        });
        return {
          url: uploadedImage.url,
          originalName: file.originalname,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      let gambarCaptionsData = [];
      try {
        gambarCaptionsData = JSON.parse(req.body.gambarCaption);

        if (!Array.isArray(gambarCaptionsData)) {
          throw new Error("Format caption harus berupa array");
        }

        if (gambarCaptionsData.length !== files.length) {
          throw new Error("Jumlah caption harus sama dengan jumlah gambar");
        }

        gambarCaptionsData.forEach((item, index) => {
          if (!item.caption || item.caption.trim() === "") {
            throw new Error(
              `Caption untuk gambar ke-${index + 1} tidak boleh kosong`
            );
          }
        });
      } catch (error) {
        throw new BadRequestError(
          "Format gambarCaption tidak valid: " + error.message
        );
      }

      const layananUnggulan = await prisma.layananUnggulan.create({
        data: {
          judul,
          deskripsi,
          gambarCaptions: {
            create: uploadedImages.map((image, index) => ({
              gambar: image.url,
              nama_file: image.originalName,
              caption: gambarCaptionsData[index].caption, //?.caption || ""
            })),
          },
        },
        include: {
          gambarCaptions: true,
        },
      });

      responseHelper.created(
        res,
        layananUnggulan,
        "Layanan Unggulan berhasil dibuat."
      );
    } catch (error) {
      responseHelper.error(res, error);
    }
  }
  static async updateLayananUnggulan(req, res) {
    try {
      const { id } = req.params;
      const { judul, deskripsi, existingImages } = req.body;
      const files = req.files; // gambar baru yang diupload

      // Validasi input
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

      // Parse existingImages dari frontend (harus JSON array of {id, caption})
      let parsedExistingImages = [];
      try {
        parsedExistingImages = JSON.parse(existingImages);
      } catch (error) {
        throw new BadRequestError("Format existingImages tidak valid");
      }

      const existingIds = parsedExistingImages.map((img) => img.id);

      await prisma.$transaction(async (tx) => {
        // 1. Update layanan
        await tx.layananUnggulan.update({
          where: { id_layanan_unggulan: id },
          data: {
            judul,
            deskripsi,
          },
        });

        // 2. Delete gambar yang tidak ada di existingImages
        await tx.gambarCaption.deleteMany({
          where: {
            layananId: id,
            id: {
              notIn: existingIds,
            },
          },
        });

        // 3. Update caption gambar yang masih ada
        const updatePromises = parsedExistingImages.map((img) =>
          tx.gambarCaption.update({
            where: { id: img.id },
            data: { caption: img.caption },
          })
        );
        await Promise.all(updatePromises);

        // 4. Upload gambar baru kalau ada
        if (files && files.length > 0) {
          const uploadPromises = files.map(async (file) => {
            const stringImage = file.buffer.toString("base64");
            const uploadedImage = await imageKit.upload({
              fileName: file.originalname,
              file: stringImage,
            });
            return {
              url: uploadedImage.url,
              originalName: file.originalname,
            };
          });

          const uploadedImages = await Promise.all(uploadPromises);

          await tx.gambarCaptions.createMany({
            data: uploadedImages.map((img, index) => ({
              layananUnggulanId: id,
              gambar: img.url,
              nama_file: img.originalName,
              caption: req.body[`captions[${index}]`] || "",
            })),
          });
        }
      });

      responseHelper.success(res, null, "Layanan Unggulan berhasil diupdate.");
    } catch (error) {
      responseHelper.error(res, error);
    }
  }

  static async getAllLayananUnggulan(req, res) {
    try {
      // Ambil semua layanan unggulan beserta gambarCaptions
      const layananUnggulanList = await prisma.layananUnggulan.findMany({
        include: {
          gambarCaptions: true,
        },
        // orderBy: {
        //   // Contoh pengurutan berdasarkan judul A-Z
        //   judul: "asc",
        // },
      });

      // Format response sesuai kebutuhan
      const formattedResponse = layananUnggulanList.map((layanan) => ({
        id_layanan_unggulan: layanan.id_layanan_unggulan,
        judul: layanan.judul,
        deskripsi: layanan.deskripsi,
        gambarCaptions: layanan.gambarCaptions.map((caption) => ({
          id: caption.id,
          gambar: caption.gambar,
          nama_file: caption.nama_file,
          caption: caption.caption,
          layananId: caption.layananId,
        })),
      }));

      // Jika ingin response tanpa array (langsung object) ketika hanya 1 data
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

  //   static async updateLayananUnggulan(req, res) {
  //     try {
  //       console.log("Uploaded file:", req.file); // Debugging
  //       console.log("=== DEBUG START ===");
  //       console.log("Request headers:", req.headers);
  //       console.log("Request body keys:", Object.keys(req.body));
  //       console.log("Request file:", req.file);
  //       console.log("=== DEBUG END ===");
  //       const { id } = req.params;

  //       // Pastikan menggunakan req.body untuk form-data
  //       const { judul, deskripsi, caption } = req.body;
  //       const file = req.file;

  //       // Validasi Input (dengan penanganan string kosong)
  //       if (!id) throw new BadRequestError("ID layanan harus disertakan");
  //       if (!judul || judul.trim() === "")
  //         throw new BadRequestError("Judul wajib diisi");
  //       if (!deskripsi || deskripsi.trim() === "")
  //         throw new BadRequestError("Deskripsi wajib diisi");
  //       if (!file) {
  //         console.log("File details:", {
  //           receivedFile: req.file,
  //           filesInRequest: req.files,
  //           rawHeaders: req.rawHeaders,
  //         });
  //         throw new BadRequestError("Gambar wajib diupload");
  //       }
  //       if (!caption || caption.trim() === "")
  //         throw new BadRequestError("Caption wajib diisi");

  //       // 2. Cek Data Existing
  //       const existingData = await prisma.layananUnggulan.findUnique({
  //         where: { id_layanan_unggulan: id },
  //         include: { gambarCaptions: true },
  //       });

  //       if (!existingData) throw new NotFoundError("Layanan tidak ditemukan");

  //       // Jika ada gambar caption yang sudah ada, ambil ID pertama (atau sesuaikan dengan logika kamu)
  //       const existingId =
  //         existingData.gambarCaptions && existingData.gambarCaptions.length > 0
  //           ? existingData.gambarCaptions[0].id
  //           : null;

  //       // 3. Upload Gambar Baru
  //       const stringImage = file.buffer.toString("base64");
  //       const uploadedImage = await imageKit.upload({
  //         fileName: file.originalname,
  //         file: stringImage,
  //       });

  //       // 4. Update Data
  //       const updatedData = await prisma.layananUnggulan.update({
  //         where: { id_layanan_unggulan: id },
  //         data: {
  //           judul,
  //           deskripsi,
  //           gambarCaptions: {
  //             upsert: {
  //               where: { id: existingId },
  //               create: {
  //                 gambar: uploadedImage.url,
  //                 nama_file: file.originalname,
  //                 caption,
  //               },
  //               update: {
  //                 gambar: uploadedImage.url,
  //                 nama_file: file.originalname,
  //                 caption,
  //               },
  //             },
  //           },
  //         },
  //         include: {
  //           gambarCaptions: true,
  //         },
  //       });

  //       // Setelah update, set gambar dan caption lainnya menjadi null jika tidak diupdate
  //       await prisma.gambarCaption.updateMany({
  //         where: {
  //           layananUnggulanId: id,
  //           NOT: {
  //             id: existingId, // Jangan set null untuk yang baru diupdate
  //           },
  //         },
  //         data: {
  //           gambar: null,
  //           caption: null,
  //         },
  //       });

  //       responseHelper.success(
  //         res,
  //         updatedData,
  //         "Layanan unggulan berhasil diperbarui"
  //       );
  //     } catch (error) {
  //       console.error("Error details:", {
  //         message: error.message,
  //         stack: error.stack,
  //       });
  //       responseHelper.error(res, error);
  //     }
  //   }
}

module.exports = LayananUnggulanController;
