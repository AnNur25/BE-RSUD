const express = require("express");
const route = express.Router();
const hariSesiController = require("../controllers/hariSesiController");
const { auth } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /sesi:
 *   post:
 *     summary: Menambahkan sesi baru
 *     description: Endpoint ini digunakan untuk menambahkan sesi baru yang terhubung dengan pengguna yang sedang login.
 *     tags:
 *       - Sesi
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sesi:
 *                 type: string
 *                 example: "Sesi Konsultasi Pagi"
 *     responses:
 *       201:
 *         description: Sesi berhasil ditambahkan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "sesi berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_sesi:
 *                       type: integer
 *                       example: 1
 *                     sesi:
 *                       type: string
 *                       example: "Sesi Konsultasi Pagi"
 *                     id_user:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Data sesi tidak diisi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "sesi harus diisi"
 *       401:
 *         description: Pengguna tidak terautentikasi atau tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "User tidak ditemukan. Pastikan sudah login."
 *       500:
 *         description: Kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.post("/sesi", auth, hariSesiController.createSesi);

/**
 * @swagger
 * /sesi:
 *   get:
 *     summary: Mengambil daftar sesi
 *     description: Endpoint ini digunakan untuk mengambil semua sesi yang tersedia.
 *     tags:
 *       - Sesi
 *     responses:
 *       200:
 *         description: Berhasil menampilkan sesi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "berhasil menampilkan sesi"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_Sesi:
 *                         type: integer
 *                         example: 1
 *                       sesi:
 *                         type: string
 *                         example: "Sesi Konsultasi Pagi"
 *       500:
 *         description: Terjadi kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.get("/sesi", hariSesiController.getSesi);

/**
 * @swagger
 * /sesi/{id}:
 *   put:
 *     summary: Memperbarui data sesi berdasarkan ID
 *     description: Endpoint ini digunakan untuk memperbarui informasi sesi berdasarkan ID.
 *     tags:
 *       - Sesi
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sesi yang akan diperbarui
 *       - in: body
 *         name: body
 *         required: true
 *         description: Data sesi yang akan diperbarui
 *         schema:
 *           type: object
 *           properties:
 *             sesi:
 *               type: string
 *               example: "Sesi Pagi"
 *     responses:
 *       200:
 *         description: Berhasil memperbarui sesi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "sesi berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Sesi:
 *                       type: integer
 *                       example: 1
 *                     sesi:
 *                       type: string
 *                       example: "Sesi Pagi"
 *                     id_user:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Format ID tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Format ID sesi tidak valid"
 *       401:
 *         description: Pengguna tidak terautentikasi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "User tidak ditemukan. Pastikan sudah login."
 *       404:
 *         description: Data sesi tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "sesi dengan ID 5 tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.put("/sesi/:id", auth, hariSesiController.updateSesi);

/**
 * @swagger
 * /sesi/{id}:
 *   delete:
 *     summary: Menghapus sesi berdasarkan ID
 *     description: Endpoint ini digunakan untuk menghapus sesi berdasarkan ID yang diberikan.
 *     tags:
 *       - Sesi
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sesi yang akan dihapus
 *     responses:
 *       200:
 *         description: Berhasil menghapus sesi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "sesi berhasil dihapus"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Sesi:
 *                       type: integer
 *                       example: 1
 *                     sesi:
 *                       type: string
 *                       example: "Sesi Pagi"
 *       400:
 *         description: Format ID tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Format ID sesi tidak valid"
 *       404:
 *         description: Data sesi tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "sesi dengan ID 5 tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.delete("/sesi/:id", auth, hariSesiController.deleteSesi);

/**
 * @swagger
 * /hari:
 *   post:
 *     summary: Menambahkan data hari
 *     description: Endpoint ini digunakan untuk menambahkan hari baru ke dalam sistem.
 *     tags:
 *       - Hari
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hari:
 *                 type: string
 *                 example: "Senin"
 *     responses:
 *       201:
 *         description: Hari berhasil ditambahkan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "hari berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Hari:
 *                       type: integer
 *                       example: 1
 *                     hari:
 *                       type: string
 *                       example: "Senin"
 *       400:
 *         description: Input hari tidak boleh kosong.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "hari harus diisi"
 *       401:
 *         description: Pengguna belum login atau tidak memiliki akses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "User tidak ditemukan. Pastikan sudah login."
 *       500:
 *         description: Terjadi kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.post("/hari", auth, hariSesiController.createHari);

/**
 * @swagger
 * /hari:
 *   get:
 *     summary: Mengambil daftar hari
 *     description: Endpoint ini digunakan untuk mengambil semua data hari yang tersedia.
 *     tags:
 *       - Hari
 *     responses:
 *       200:
 *         description: Berhasil menampilkan hari.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "berhasil menampilkan hari"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_Hari:
 *                         type: integer
 *                         example: 1
 *                       hari:
 *                         type: string
 *                         example: "Senin"
 *       500:
 *         description: Terjadi kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.get("/hari", hariSesiController.getHari);

/**
 * @swagger
 * /hari/{id}:
 *   put:
 *     summary: Memperbarui data hari berdasarkan ID
 *     description: Endpoint ini digunakan untuk memperbarui informasi hari berdasarkan ID.
 *     tags:
 *       - Hari
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID hari yang akan diperbarui
 *       - in: body
 *         name: body
 *         required: true
 *         description: Data hari yang akan diperbarui
 *         schema:
 *           type: object
 *           properties:
 *             hari:
 *               type: string
 *               example: "Selasa"
 *     responses:
 *       200:
 *         description: Berhasil memperbarui hari.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "hari berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Hari:
 *                       type: integer
 *                       example: 1
 *                     hari:
 *                       type: string
 *                       example: "Selasa"
 *       400:
 *         description: Format ID tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Format ID hari tidak valid"
 *       404:
 *         description: Data hari tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "hari dengan ID 5 tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.put("/hari/:id", auth, hariSesiController.updateHari);

/**
 * @swagger
 * /hari/{id}:
 *   delete:
 *     summary: Menghapus data hari
 *     description: Endpoint ini digunakan untuk menghapus hari berdasarkan ID yang diberikan.
 *     tags:
 *       - Hari
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID hari yang akan dihapus
 *         example: 1
 *     responses:
 *       200:
 *         description: Hari berhasil dihapus.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "hari berhasil dihapus"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Hari:
 *                       type: integer
 *                       example: 1
 *                     hari:
 *                       type: string
 *                       example: "Senin"
 *       400:
 *         description: Format ID hari tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Format ID hari tidak valid"
 *       404:
 *         description: Hari dengan ID yang diberikan tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "hari dengan ID 1 tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan server internal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
route.delete("/hari/:id", auth, hariSesiController.deleteHari);

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
