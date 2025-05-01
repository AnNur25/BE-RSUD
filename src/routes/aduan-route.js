const express = require("express");
const route = express.Router();
const aduanController = require("../controllers/aduan-controller");
const { auth } = require("../middlewares/auth-middleware");
/**
 * @swagger
 * /aduan:
 *   post:
 *     summary: Membuat aduan baru
 *     description: Endpoint untuk membuat aduan baru dengan nama pelapor, pesan aduan, dan nomor WhatsApp.
 *     tags:
 *       - Aduan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Budi Santoso"
 *               message:
 *                 type: string
 *                 example: "Sampah di TPS tidak diangkut selama 3 hari."
 *               no_wa:
 *                 type: string
 *                 example: "081234567890"
 *     responses:
 *       "201":
 *         description: Aduan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aduan berhasil dibuat."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nama:
 *                       type: string
 *                       example: "Budi Santoso"
 *                     message:
 *                       type: string
 *                       example: "Sampah di TPS tidak diangkut selama 3 hari."
 *                     no_wa:
 *                       type: string
 *                       example: "081234567890"
 *                     is_visible:
 *                       type: boolean
 *                       example: true
 *                     dibuat_pada:
 *                       type: string
 *                       example: "29 April 2025"
 *       "400":
 *         description: Data yang dikirim tidak lengkap
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Semua field (nama, message, no_wa) harus diisi."
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.post("/", aduanController.createAduan);
/**
 * @swagger
 * /aduan/all:
 *   get:
 *     summary: Mengambil semua data aduan
 *     description: Endpoint untuk mengambil seluruh data aduan beserta respon admin jika ada.
 *     tags:
 *       - Aduan
 *     responses:
 *       "200":
 *         description: Data aduan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data aduan berhasil diambil."
 *                 data:
 *                   type: object
 *                   properties:
 *                     data_aduan:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nama:
 *                             type: string
 *                             example: "Budi Santoso"
 *                           message:
 *                             type: string
 *                             example: "Sampah di TPS tidak diangkut selama 3 hari."
 *                           no_wa:
 *                             type: string
 *                             example: "081234567890"
 *                           is_visible:
 *                             type: boolean
 *                             example: true
 *                           dibuat_pada:
 *                             type: string
 *                             example: "29 April 2025"
 *                           responAdmin:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 message:
 *                                   type: string
 *                                   example: "Sudah kami tindaklanjuti."
 *                                 dibuat_pada:
 *                                   type: string
 *                                   example: "29 April 2025"
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.get("/all", aduanController.getAllAduan);

/**
 * @swagger
 * /aduan:
 *   get:
 *     summary: Mengambil semua aduan yang terlihat (visible)
 *     description: Endpoint untuk mengambil semua data aduan yang status is_visible = true beserta respon admin.
 *     tags:
 *       - Aduan
 *     responses:
 *       "200":
 *         description: Data aduan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data aduan berhasil diambil."
 *                 data:
 *                   type: object
 *                   properties:
 *                     data_aduan:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           nama:
 *                             type: string
 *                             example: "Siti Nurhaliza"
 *                           message:
 *                             type: string
 *                             example: "Sampah di sekitar komplek belum diangkut."
 *                           no_wa:
 *                             type: string
 *                             example: "082345678901"
 *                           is_visible:
 *                             type: boolean
 *                             example: true
 *                           dibuat_pada:
 *                             type: string
 *                             example: "29 April 2025"
 *                           responAdmin:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 3
 *                                 message:
 *                                   type: string
 *                                   example: "Sudah kami koordinasikan dengan DLH."
 *                                 dibuat_pada:
 *                                   type: string
 *                                   example: "29 April 2025"
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.get("/", aduanController.getAllVisibleAduan);

/**
 * @swagger
 * /aduan/visible/{id}:
 *   patch:
 *     summary: Menampilkan aduan
 *     description: Mengubah status aduan menjadi terlihat (is_visible = true) berdasarkan ID aduan.
 *     tags:
 *       - Aduan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID aduan yang ingin ditampilkan
 *     responses:
 *       "200":
 *         description: Aduan berhasil ditampilkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aduan berhasil ditampilkan."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_aduan:
 *                       type: string
 *                       example: "1"
 *                     nama:
 *                       type: string
 *                       example: "Ahmad Dahlan"
 *                     message:
 *                       type: string
 *                       example: "Sampah sudah menumpuk di jalan."
 *                     no_wa:
 *                       type: string
 *                       example: "081234567890"
 *                     is_visible:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-29T07:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-29T08:00:00.000Z"
 *       "400":
 *         description: ID aduan harus disertakan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID aduan harus disertakan."
 *       "404":
 *         description: Aduan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aduan tidak ditemukan."
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.patch("/visible/:id", auth, aduanController.aduanIsVisible);
// /**
//  * @swagger
//  * /aduan/{id}:
//  *   get:
//  *     summary: Mendapatkan detail aduan berdasarkan ID
//  *     description: Mengambil satu aduan berdasarkan ID.
//  *     tags:
//  *       - Aduan
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID Aduan
//  *     responses:
//  *       "200":
//  *         description: Detail aduan berhasil diambil
//  *       "404":
//  *         description: Aduan tidak ditemukan
//  *       "500":
//  *         description: Terjadi kesalahan server
//  */
// route.get("/:id", aduanController.getAduanById);
// /**
//  * @swagger
//  * /aduan/{id}:
//  *   put:
//  *     summary: Memperbarui aduan
//  *     description: Memperbarui informasi aduan berdasarkan ID.
//  *     tags:
//  *       - Aduan
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID Aduan
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               judul:
//  *                 type: string
//  *               deskripsi:
//  *                 type: string
//  *               no_wa:
//  *                 type: string
//  *     responses:
//  *       "200":
//  *         description: Aduan berhasil diperbarui
//  *       "500":
//  *         description: Terjadi kesalahan server
//  */
// route.put("/:id", aduanController.updateAduan);

/**
 * @swagger
 * /aduan/{id}:
 *   delete:
 *     summary: Menghapus aduan
 *     description: Admin dapat menghapus aduan berdasarkan ID.
 *     tags:
 *       - Aduan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID aduan yang akan dihapus
 *     responses:
 *       "200":
 *         description: Aduan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aduan berhasil dihapus."
 *                 data:
 *                   type: object
 *                   nullable: true
 *       "400":
 *         description: Request tidak valid (ID tidak disertakan)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID aduan harus disertakan."
 *       "404":
 *         description: Aduan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aduan tidak ditemukan."
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.delete("/:id", auth, aduanController.deleteAduan);
// /**
//  * @swagger
//  * /aduan/{id}:
//  *   patch:
//  *     summary: Menandai aduan sebagai telah dibaca
//  *     description: Mengubah status aduan menjadi telah dibaca.
//  *     tags:
//  *       - Aduan
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID Aduan
//  *     responses:
//  *       "200":
//  *         description: Aduan telah ditandai sebagai dibaca
//  *       "500":
//  *         description: Terjadi kesalahan server
//  */
// route.patch("/:id", auth, aduanController.aduanIsRead);

/**
 * @swagger
 * /aduan/reply/{id}:
 *   post:
 *     summary: Membalas aduan
 *     description: Admin membalas aduan dengan mengirimkan pesan sebagai respon.
 *     tags:
 *       - Aduan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID aduan yang ingin dibalas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Terima kasih atas laporannya, sudah kami tindak lanjuti."
 *     responses:
 *       "201":
 *         description: Respon berhasil dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Respon berhasil dikirim."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_respon_admin:
 *                       type: string
 *                       example: "5"
 *                     message:
 *                       type: string
 *                       example: "Terima kasih atas laporannya, sudah kami tindak lanjuti."
 *                     id_user:
 *                       type: string
 *                       example: "2"
 *                     id_aduan:
 *                       type: string
 *                       example: "10"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-29T09:00:00.000Z"
 *       "400":
 *         description: Request tidak valid (ID tidak disertakan atau pesan kosong)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID aduan harus disertakan."
 *       "403":
 *         description: Akses ditolak (user tidak terautentikasi)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Akses ditolak. User tidak terautentikasi."
 *       "404":
 *         description: Aduan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aduan tidak ditemukan."
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.post("/reply/:id", auth, aduanController.replyAduan);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Masukkan token JWT di sini
 */
module.exports = route;
