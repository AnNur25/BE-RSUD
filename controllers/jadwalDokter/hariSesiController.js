// const prisma = require("../../prisma/prismaClient");

// class HariSesi {
//   static async createSesi(req, res) {
//     try {
//       const { sesi } = req.body;
//       const userId = req.user.id_user;
//       if (!sesi) {
//         return res.status(400).json({
//           statusCode: 400,
//           status: "Failed",
//           message: "sesi harus diisi",
//         });
//       }
//       if (!userId) {
//         return res.status(401).json({
//           statusCode: 401,
//           status: "Failed",
//           message: "User tidak ditemukan. Pastikan sudah login.",
//         });
//       }
//       const data = await prisma.sesi.create({
//         data: {
//           sesi,
//           user: {
//             connect: { id_user: userId },
//           },
//         },
//       });
//       res.status(201).json({
//         statusCode: 201,
//         status: "Success",
//         message: "sesi berhasil ditambahkan",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }
//   static async createHari(req, res) {
//     try {
//       const { hari_mulai, hari_selesai } = req.body;
//       const userId = parseInt(req.user.id_user);
//       if (!hari_mulai || !hari_selesai) {
//         return res.status(400).json({
//           statusCode: 400,
//           status: "Failed",
//           message: "hari harus diisi",
//         });
//       }
//       if (!userId) {
//         return res.status(401).json({
//           statusCode: 401,
//           status: "Failed",
//           message: "User tidak ditemukan. Pastikan sudah login.",
//         });
//       }
//       const data = await prisma.hari.create({
//         data: {
//           hari_mulai,
//           hari_selesai,
//           user: {
//             connect: { id_user: userId },
//           },
//         },
//       });
//       res.status(201).json({
//         statusCode: 201,
//         status: "Success",
//         message: "hari berhasil ditambahkan",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }

//   static async getSesi(req, res) {
//     try {
//       const data = await prisma.sesi.findMany({
//         select: {
//           id_Sesi: true,
//           sesi: true,
//         },
//       });

//       return res.status(200).json({
//         statusCode: 200,
//         status: "Success",
//         message: "berhasil menampilkan sesi",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }
//   static async getHari(req, res) {
//     try {
//       const data = await prisma.hari.findMany({
//         select: {
//           id_Hari: true,
//           hari_mulai: true,
//           hari_selesai: true,
//         },
//       });

//       return res.status(200).json({
//         statusCode: 200,
//         status: "Success",
//         message: "berhasil menampilkan hari",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }

//   static async updateHari(req, res) {
//     try {
//       const id_hari = parseInt(req.params.id);
//       const userId = parseInt(req.user.id_user);
//       const { hari_mulai, hari_selesai } = req.body;
//       if (isNaN(id_hari)) {
//         return res.status(400).json({
//           statusCode: 400,
//           status: "Failed",
//           message: "Format ID hari tidak valid",
//         });
//       }
//       if (!userId) {
//         return res.status(401).json({
//           statusCode: 401,
//           status: "Failed",
//           message: "User tidak ditemukan. Pastikan sudah login.",
//         });
//       }
//       if (!hari_mulai || !hari_selesai) {
//         return res.status(400).json({
//           statusCode: 400,
//           status: "Failed",
//           message: "hari harus diisi",
//         });
//       }

//       const harisesiExists = await prisma.hari.findUnique({
//         where: { id_Hari: id_hari },
//       });

//       if (!harisesiExists) {
//         return res.status(404).json({
//           statusCode: 404,
//           status: "Failed",
//           message: `hari dengan ID ${id_hari} tidak ditemukan`,
//         });
//       }

//       const data = await prisma.hari.update({
//         where: { id_Hari: id_hari },
//         data: {
//           hari_mulai,
//           hari_selesai,
//           user: {
//             connect: { id_user: userId },
//           },
//         },
//       });

//       return res.status(200).json({
//         statusCode: 200,
//         status: "Success",
//         message: "hari berhasil diperbarui",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }
//   static async updateSesi(req, res) {
//     try {
//       const id_Sesi = parseInt(req.params.id);
//       const userId = parseInt(req.user.id_user);
//       const { sesi } = req.body;
//       if (isNaN(id_Sesi)) {
//         return res.status(400).json({
//           statusCode: 400,
//           status: "Failed",
//           message: "Format ID sesi tidak valid",
//         });
//       }

//       const sesiExists = await prisma.sesi.findUnique({
//         where: { id_Sesi: id_Sesi },
//       });

//       if (!sesiExists) {
//         return res.status(404).json({
//           statusCode: 404,
//           status: "Failed",
//           message: `sesi dengan ID ${id_Sesi} tidak ditemukan`,
//         });
//       }

//       const data = await prisma.sesi.update({
//         where: { id_Sesi: id_Sesi },
//         data: { sesi, id_user: userId },
//       });

//       return res.status(200).json({
//         statusCode: 200,
//         status: "Success",
//         message: "sesi berhasil diperbarui",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }

//   static async deleteHari(req, res) {
//     try {
//       const id_hari = parseInt(req.params.id);
//       if (isNaN(id_hari)) {
//         return res.status(400).json({
//           statusCode: 400,
//           status: "Failed",
//           message: "Format ID hari tidak valid",
//         });
//       }
//       const hariExists = await prisma.hari.findUnique({
//         where: { id_Hari: id_hari },
//       });
//       if (!hariExists) {
//         return res.status(404).json({
//           statusCode: 404,
//           status: "Failed",
//           message: `hari dengan ID ${id_hari} tidak ditemukan`,
//         });
//       }
//       const data = await prisma.hari.delete({
//         where: { id_Hari: id_hari },
//       });
//       return res.status(200).json({
//         statusCode: 200,
//         status: "Success",
//         message: "hari berhasil dihapus",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }
//   static async deleteSesi(req, res) {
//     try {
//       const id_sesi = parseInt(req.params.id);
//       if (isNaN(id_sesi)) {
//         return res.status(400).json({
//           statusCode: 400,
//           status: "Failed",
//           message: "Format ID hari tidak valid",
//         });
//       }
//       const hariExists = await prisma.sesi.findUnique({
//         where: { id_Sesi: id_sesi },
//       });
//       if (!hariExists) {
//         return res.status(404).json({
//           statusCode: 404,
//           status: "Failed",
//           message: `sesi dengan ID ${id_sesi} tidak ditemukan`,
//         });
//       }
//       const data = await prisma.sesi.delete({
//         where: { id_Sesi: id_sesi },
//       });
//       return res.status(200).json({
//         statusCode: 200,
//         status: "Success",
//         message: "hari berhasil dihapus",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         statusCode: 500,
//         status: "Failed",
//         message: "Internal Server Error.",
//         error: error.message,
//       });
//     }
//   }
// }

// module.exports = HariSesi;
