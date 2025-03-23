const express = require("express");
const Route = express.Router();
const pelayananDokterController = require("../controllers/jadwalDokter/pelayananDokterController");
const { auth } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /pelayanan-dokter:
 *   post:
 *     summary: Membuat pelayanan dokter baru
 *     description: Endpoint untuk menambahkan data pelayanan dokter yang baru.
 *     tags:
 *       - Pelayanan Dokter
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_pelayanan:
 *                 type: string
 *                 example: "Pelayanan Konsultasi"
 *               deskripsi:
 *                 type: string
 *                 example: "Konsultasi medis dengan dokter spesialis."
 *     responses:
 *       201:
 *         description: Pelayanan Dokter berhasil dibuat.
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
 *                   example: "Pelayanan Dokter berhasil dibuat."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pelayanan:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     nama_pelayanan:
 *                       type: string
 *                       example: "Pelayanan Konsultasi"
 *                     deskripsi:
 *                       type: string
 *                       example: "Konsultasi medis dengan dokter spesialis."
 *                     id_user:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-95"
 *       400:
 *         description: Data input tidak lengkap atau tidak valid.
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
 *                   example: "Nama pelayanan dan deskripsi wajib diisi."
 *       401:
 *         description: Pengguna belum login atau token tidak valid.
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
 *         description: Terjadi kesalahan pada server.
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
Route.post("/", auth, pelayananDokterController.createPelayananDokter);

/**
 * @swagger
 * /pelayanan-dokter:
 *   get:
 *     summary: Mendapatkan daftar pelayanan dokter
 *     description: Mengambil semua data pelayanan dokter yang tersedia.
 *     tags:
 *       - Pelayanan Dokter
 *     responses:
 *       200:
 *         description: Data pelayanan dokter berhasil diambil.
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
 *                   example: "Data pelayanan dokter berhasil diambil."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_pelayanan_dokter:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       nama_pelayanan:
 *                         type: string
 *                         example: "Pelayanan Konsultasi"
 *                       deskripsi:
 *                         type: string
 *                         example: "Konsultasi medis dengan dokter spesialis."
 *       500:
 *         description: Terjadi kesalahan pada server.
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
Route.get("/", pelayananDokterController.getPelayananDokter);

/**
 * @swagger
 * /pelayanan-dokter/{id}:
 *   put:
 *     summary: Memperbarui data pelayanan dokter
 *     description: Mengubah informasi pelayanan dokter berdasarkan ID.
 *     tags:
 *       - Pelayanan Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pelayanan dokter yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_pelayanan:
 *                 type: string
 *                 example: "Pelayanan Gawat Darurat"
 *               deskripsi:
 *                 type: string
 *                 example: "Layanan gawat darurat selama 24 jam."
 *     responses:
 *       200:
 *         description: Pelayanan dokter berhasil diperbarui.
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
 *                   example: "Pelayanan Dokter berhasil diperbarui."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pelayanan_dokter:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     nama_pelayanan:
 *                       type: string
 *                       example: "Pelayanan Gawat Darurat"
 *                     deskripsi:
 *                       type: string
 *                       example: "Layanan gawat darurat selama 24 jam."
 *       400:
 *         description: ID pelayanan dokter tidak valid atau tidak diberikan.
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
 *                   example: "ID pelayanan dokter diperlukan."
 *       404:
 *         description: Pelayanan dokter tidak ditemukan.
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
 *                   example: "Pelayanan Dokter tidak ditemukan."
 *       500:
 *         description: Terjadi kesalahan pada server.
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
Route.put("/:id", auth, pelayananDokterController.updatePelayananDokter);

/**
 * @swagger
 * /pelayanan-dokter/{id}:
 *   delete:
 *     summary: Menghapus data pelayanan dokter
 *     description: Menghapus data pelayanan dokter berdasarkan ID.
 *     tags:
 *       - Pelayanan Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pelayanan dokter yang akan dihapus.
 *     responses:
 *       200:
 *         description: Pelayanan dokter berhasil dihapus.
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
 *                   example: "Pelayanan Dokter berhasil dihapus."
 *       400:
 *         description: ID pelayanan dokter tidak valid atau tidak diberikan.
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
 *                   example: "ID pelayanan dokter diperlukan."
 *       404:
 *         description: Pelayanan dokter tidak ditemukan.
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
 *                   example: "Pelayanan Dokter tidak ditemukan."
 *       500:
 *         description: Terjadi kesalahan pada server.
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
Route.delete("/:id", auth, pelayananDokterController.deletePelayananDokter);

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
