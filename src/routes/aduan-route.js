const express = require("express");
const route = express.Router();
const aduanController = require("../controllers/aduan-controller");
const { auth } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /aduan:
 *   post:
 *     summary: Membuat aduan baru
 *     description: Endpoint untuk membuat aduan baru dengan judul, deskripsi, dan nomor WhatsApp.
 *     tags:
 *       - Aduan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *                 example: "Aduan Sampah Menumpuk"
 *               deskripsi:
 *                 type: string
 *                 example: "Sampah di TPS tidak diangkut selama 3 hari."
 *               no_wa:
 *                 type: string
 *                 example: "081234567890"
 *     responses:
 *       "201":
 *         description: Aduan berhasil dibuat
 *       "500":
 *         description: Terjadi kesalahan server
 */
route.post("/", aduanController.createAduan);
/**
 * @swagger
 * /aduan:
 *   get:
 *     summary: Mendapatkan daftar semua aduan
 *     description: Mengambil semua data aduan yang sudah dibuat.
 *     tags:
 *       - Aduan
 *     responses:
 *       "200":
 *         description: Daftar aduan berhasil diambil
 *       "500":
 *         description: Terjadi kesalahan server
 */
route.get("/", aduanController.getAduan);
/**
 * @swagger
 * /aduan/{id}:
 *   get:
 *     summary: Mendapatkan detail aduan berdasarkan ID
 *     description: Mengambil satu aduan berdasarkan ID.
 *     tags:
 *       - Aduan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Aduan
 *     responses:
 *       "200":
 *         description: Detail aduan berhasil diambil
 *       "404":
 *         description: Aduan tidak ditemukan
 *       "500":
 *         description: Terjadi kesalahan server
 */
route.get("/:id", aduanController.getAduanById);
/**
 * @swagger
 * /aduan/{id}:
 *   put:
 *     summary: Memperbarui aduan
 *     description: Memperbarui informasi aduan berdasarkan ID.
 *     tags:
 *       - Aduan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Aduan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               no_wa:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Aduan berhasil diperbarui
 *       "500":
 *         description: Terjadi kesalahan server
 */
route.put("/:id", aduanController.updateAduan);
/**
 * @swagger
 * /aduan/{id}:
 *   delete:
 *     summary: Menghapus aduan
 *     description: Menghapus aduan berdasarkan ID.
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
 *         description: ID Aduan
 *     responses:
 *       "200":
 *         description: Aduan berhasil dihapus
 *       "500":
 *         description: Terjadi kesalahan server
 */
route.delete("/:id", auth, aduanController.deleteAduan);
/**
 * @swagger
 * /aduan/{id}:
 *   patch:
 *     summary: Menandai aduan sebagai telah dibaca
 *     description: Mengubah status aduan menjadi telah dibaca.
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
 *         description: ID Aduan
 *     responses:
 *       "200":
 *         description: Aduan telah ditandai sebagai dibaca
 *       "500":
 *         description: Terjadi kesalahan server
 */
route.patch("/:id", auth, aduanController.aduanIsRead);
/**
 * @swagger
 * /aduan/{id}:
 *   post:
 *     summary: Memberikan respon terhadap aduan
 *     description: Admin dapat memberikan respon terhadap aduan yang masuk.
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
 *         description: ID Aduan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Terima kasih atas laporannya. Kami akan segera menangani."
 *     responses:
 *       "201":
 *         description: Respon berhasil dikirim
 *       "404":
 *         description: Aduan tidak ditemukan
 *       "500":
 *         description: Terjadi kesalahan server
 */
route.post("/:id/", auth, aduanController.replyAduan);

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
