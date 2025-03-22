const express = require("express");
const route = express.Router();
const pelayananRS = require("../controllers/pelayananRSController");
const { auth } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /pelayanan-rs:
 *   post:
 *     summary: Menambahkan data Pelayanan Rumah Sakit
 *     description: Endpoint ini digunakan untuk menambahkan data baru mengenai pelayanan rumah sakit.
 *     tags:
 *       - Pelayanan Rumah Sakit
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Persyaratan:
 *                 type: string
 *                 example: "Fotokopi KTP, Kartu BPJS"
 *               Prosedur:
 *                 type: string
 *                 example: "Datang ke loket, Mengisi formulir, Menunggu antrian"
 *               JangkaWaktu:
 *                 type: string
 *                 example: "2 hari kerja"
 *               Biaya:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       201:
 *         description: Pelayanan Rumah Sakit berhasil ditambahkan.
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
 *                   example: "Pelayanan Rumah Sakit berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     Persyaratan:
 *                       type: string
 *                       example: "Fotokopi KTP, Kartu BPJS"
 *                     Prosedur:
 *                       type: string
 *                       example: "Datang ke loket, Mengisi formulir, Menunggu antrian"
 *                     JangkaWaktu:
 *                       type: string
 *                       example: "2 hari kerja"
 *                     Biaya:
 *                       type: number
 *                       example: 50000
 *       401:
 *         description: User tidak ditemukan atau belum login.
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
 *                   example: "User tidak ditemukan. Pastikan sudah login"
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
route.post("/", auth, pelayananRS.createPelayananRS);

/**
 * @swagger
 * /pelayanan-rs:
 *   get:
 *     summary: Mendapatkan daftar pelayanan rumah sakit
 *     description: Endpoint ini digunakan untuk mendapatkan semua data pelayanan rumah sakit.
 *     tags:
 *       - Pelayanan Rumah Sakit
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data pelayanan rumah sakit.
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
 *                   example: "Berhasil mendapatkan data pelayanan"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       Persyaratan:
 *                         type: string
 *                         example: "Fotokopi KTP, Kartu BPJS"
 *                       Prosedur:
 *                         type: string
 *                         example: "Datang ke loket, Mengisi formulir, Menunggu antrian"
 *                       JangkaWaktu:
 *                         type: string
 *                         example: "2 hari kerja"
 *                       Biaya:
 *                         type: number
 *                         example: 50000
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
route.get("/", pelayananRS.getPelayananRS);

/**
 * @swagger
 * /pelayanan-rs/{id}:
 *   put:
 *     summary: Memperbarui data pelayanan rumah sakit
 *     description: Endpoint ini digunakan untuk memperbarui informasi pelayanan rumah sakit berdasarkan ID.
 *     tags:
 *       - Pelayanan Rumah Sakit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pelayanan rumah sakit yang akan diperbarui.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token Bearer untuk autentikasi.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Persyaratan:
 *                 type: string
 *                 example: "Fotokopi KTP, Kartu BPJS"
 *               Prosedur:
 *                 type: string
 *                 example: "Datang ke loket, Mengisi formulir, Menunggu antrian"
 *               JangkaWaktu:
 *                 type: string
 *                 example: "2 hari kerja"
 *               Biaya:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       200:
 *         description: Data berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Data berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pelayananRS:
 *                       type: integer
 *                       example: 1
 *                     Persyaratan:
 *                       type: string
 *                       example: "Fotokopi KTP, Kartu BPJS"
 *                     Prosedur:
 *                       type: string
 *                       example: "Datang ke loket, Mengisi formulir, Menunggu antrian"
 *                     JangkaWaktu:
 *                       type: string
 *                       example: "2 hari kerja"
 *                     Biaya:
 *                       type: number
 *                       example: 50000
 *       400:
 *         description: Permintaan tidak valid atau data tidak lengkap.
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
 *                   example: "Format ID pelayanan tidak valid."
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
 *                   example: "Unauthorized. Silakan login terlebih dahulu."
 *       404:
 *         description: Data pelayanan tidak ditemukan.
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
 *                   example: "Pelayanan Rumah Sakit dengan ID {id} tidak ditemukan."
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
route.put("/:id", auth, pelayananRS.updatePelayananRS);

/**
 * @swagger
 * /pelayanan-rs/{id}:
 *   delete:
 *     summary: Menghapus data pelayanan rumah sakit
 *     description: Endpoint ini digunakan untuk menghapus informasi pelayanan rumah sakit berdasarkan ID.
 *     tags:
 *       - Pelayanan Rumah Sakit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pelayanan rumah sakit yang akan dihapus.
 *     responses:
 *       200:
 *         description: Data berhasil dihapus.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "Data berhasil dihapus"
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
 *                   example: "Format ID pelayanan tidak valid."
 *       404:
 *         description: Data pelayanan tidak ditemukan.
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
 *                   example: "Pelayanan Rumah Sakit dengan ID {id} tidak ditemukan."
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
route.delete("/:id", auth, pelayananRS.deletePelayananRS);

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
