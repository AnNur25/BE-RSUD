const express = require("express");
const Route = express.Router();
const poliController = require("../controllers/poli-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /poli:
 *   post:
 *     summary: Menambahkan poli baru
 *     description: Endpoint ini digunakan untuk menambahkan poli baru ke dalam sistem.
 *     tags:
 *       - Poli
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_poli:
 *                 type: string
 *                 example: "Bedah"
 *     responses:
 *       201:
 *         description: Spesialis berhasil ditambahkan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Spesialis berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id_poli:
 *                           type: string
 *                           example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                         nama_poli:
 *                           type: string
 *                           example: "spesialis baru 1"
 *       400:
 *         description: Nama Poli.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Nama spesialis harus diisi."
 *       401:
 *         description: Pengguna tidak memiliki otorisasi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Authorization tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
Route.post("/", auth, authorizeRole("ADMIN"), poliController.createPoli);

/**
 * @swagger
 * /poli:
 *   get:
 *     summary: Mengambil daftar Poli
 *     description: Mengambil semua Poli yang tersedia.
 *     tags:
 *       - Poli
 *     responses:
 *       200:
 *         description: Berhasil menampilkan Daftar Poli.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Berhasil menampilkan Daftar Poli"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_poli:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       nama_poli:
 *                         type: string
 *                         example: "Poli Umum"
 *       404:
 *         description: Daftar Poli kosong.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Ops! daftar poli kosong"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
Route.get("/", poliController.getPoli);

/**
 * @swagger
 * /poli/{id}:
 *   get:
 *     summary: Mengambil detail  Poli
 *     description: Mengambil semua Poli yang tersedia.
 *     tags:
 *       - Poli
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID poli yang akan diperbarui.
 *     responses:
 *       200:
 *         description: Berhasil menampilkan detail Poli.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Berhasil menampilkan Daftar Poli"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_poli:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       nama_poli:
 *                         type: string
 *                         example: "Poli Umum"
 *       400:
 *         description: ID Poli wajib disertakan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "ID Poli wajib disertakan"
 *       404:
 *         description: Poli kosong.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Poli dengan ID ${id_poli} tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
Route.get("/:id", poliController.getPoliById);

/**
 * @swagger
 * /poli/{id_poli}/dokter:
 *   get:
 *     summary: Mendapatkan daftar dokter berdasarkan ID poli
 *     description: Endpoint ini digunakan untuk mengambil daftar dokter yang terdaftar pada suatu poli tertentu berdasarkan ID poli.
 *     tags:
 *       - Poli
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_poli
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Poli yang ingin dicari daftar dokternya
 *         example: "14b84fa5-8088-4f59-90ec-d5c9d59f408a"
 *     responses:
 *       200:
 *         description: Daftar dokter berhasil diambil
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
 *                   example: "Berhasil menampilkan daftar dokter berdasarkan poli"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: string
 *                         example: "c52c2a67-e9d2-4d19-bd80-ec10dfae23f5"
 *                       nama:
 *                         type: string
 *                         example: "dr. Ahmad Yani"
 *       400:
 *         description: Permintaan tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "ID poli wajib diisi"
 *       401:
 *         description: Pengguna tidak memiliki otorisasi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Authorization tidak ditemukan"
 *       404:
 *         description: Permintaan tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Tidak ada dokter ditemukan untuk poli tersebut"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
Route.get("/:id_poli/dokter", auth, poliController.getDokterByPoli);

/**
 * @swagger
 * /poli/{id_poli}:
 *   put:
 *     summary: Memperbarui data Poli
 *     description: Mengubah nama poli berdasarkan ID.
 *     tags:
 *       - Poli
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_poli
 *         required: true
 *         schema:
 *           type: string
 *         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *         description: ID Poli yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_poli:
 *                 type: string
 *                 example: "Poli Bedah"
 *     responses:
 *       200:
 *         description: Poli berhasil diperbarui.
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
 *                   example: "Berhasil update poli"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_poli:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     nama_poli:
 *                       type: string
 *                       example: "Poli Bedah"
 *       400:
 *         description: Format ID Poli tidak valid atau data tidak lengkap.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Nama poli harus diisi"
 *       401:
 *         description: Pengguna tidak memiliki otorisasi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Authorization tidak ditemukan"
 *       404:
 *         description: Poli tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Poli dengan ID bf27354f-6d82-4e25-9541-b9efc8bf57ed tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
Route.put("/:id_poli", auth, authorizeRole("ADMIN"), poliController.updatePoli);

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
module.exports = Route;
