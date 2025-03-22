const express = require("express");
const Route = express.Router();
const dokterController = require("../controllers/dokterController");
const multerConfig = require("../middlewares/multerConfig");
const { auth } = require("../middlewares/authMiddleware");
const multer = require("multer");

/**
 * @swagger
 * /dokter:
 *   post:
 *     summary: Menambahkan data dokter
 *     description: Endpoint untuk menambahkan dokter baru dengan informasi spesialisasi dan pelayanan dokter.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Dr. Andi"
 *               kontak:
 *                 type: string
 *                 example: "081234567890"
 *               id_Spesialis:
 *                 type: integer
 *                 example: 2
 *               id_pelayanan_dokter:
 *                 type: integer
 *                 example: 3
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Gambar dokter yang akan diunggah.
 *     responses:
 *       201:
 *         description: Dokter berhasil ditambahkan.
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
 *                   example: "Dokter berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_dokter:
 *                       type: integer
 *                       example: 5
 *                     nama:
 *                       type: string
 *                       example: "Dr. Andi"
 *                     kontak:
 *                       type: string
 *                       example: "081234567890"
 *                     gambar:
 *                       type: string
 *                       example: "https://ik.imagekit.io/example.jpg"
 *                     id_Spesialis:
 *                       type: integer
 *                       example: 2
 *                     id_pelayanan_dokter:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Data tidak lengkap atau file tidak diunggah.
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
 *                   example: "No file uploaded"
 *       401:
 *         description: Pengguna tidak memiliki otorisasi.
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
 *                   example: "Unauthorized: User ID not found"
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
Route.post(
  "/",
  auth,
  multerConfig.single("gambar"),
  dokterController.createDokter
);

/**
 * @swagger
 * /dokter:
 *   get:
 *     summary: Mendapatkan daftar dokter
 *     description: Mengambil daftar semua dokter beserta spesialisasi dan pelayanan dokter.
 *     tags:
 *       - Dokter
 *     responses:
 *       200:
 *         description: Data dokter berhasil diambil.
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
 *                   example: "Data dokter berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: integer
 *                         example: 1
 *                       nama:
 *                         type: string
 *                         example: "Dr. Budi"
 *                       kontak:
 *                         type: string
 *                         example: "08123456789"
 *                       gambar:
 *                         type: string
 *                         example: "https://ik.imagekit.io/example.jpg"
 *                       spesialis:
 *                         type: object
 *                         properties:
 *                           nama_spesialis:
 *                             type: string
 *                             example: "Kardiologi"
 *                       pelayananDokter:
 *                         type: object
 *                         properties:
 *                           nama_pelayanan:
 *                             type: string
 *                             example: "Pemeriksaan Jantung"
 *       404:
 *         description: Data dokter tidak ditemukan.
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
 *                   example: "Data dokter tidak ditemukan"
 *                 data:
 *                   type: array
 *                   example: []
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
Route.get("/", dokterController.getDokter);

/**
 * @swagger
 * /dokter/{id}:
 *   put:
 *     summary: Memperbarui data dokter
 *     description: Mengupdate informasi dokter berdasarkan ID dokter yang diberikan.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dokter yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Dr. Budi Santoso"
 *               kontak:
 *                 type: string
 *                 example: "08123456789"
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar dokter yang akan diunggah.
 *               id_Spesialis:
 *                 type: integer
 *                 example: 2
 *               id_pelayanan_dokter:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Dokter berhasil diperbarui.
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
 *                   example: "Dokter berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_dokter:
 *                       type: integer
 *                       example: 1
 *                     nama:
 *                       type: string
 *                       example: "Dr. Budi Santoso"
 *                     kontak:
 *                       type: string
 *                       example: "08123456789"
 *                     gambar:
 *                       type: string
 *                       example: "https://ik.imagekit.io/example.jpg"
 *                     spesialis:
 *                       type: object
 *                       properties:
 *                         id_Spesialis:
 *                           type: integer
 *                           example: 2
 *                     pelayananDokter:
 *                       type: object
 *                       properties:
 *                         id_pelayanan_dokter:
 *                           type: integer
 *                           example: 3
 *       400:
 *         description: Data yang dikirimkan tidak lengkap atau tidak valid.
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
 *                   example: "No file uploaded"
 *       404:
 *         description: Dokter tidak ditemukan.
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
 *                   example: "Dokter not found"
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
Route.put("/:id", auth, dokterController.updateDokter);

/**
 * @swagger
 * /dokter/{id}:
 *   delete:
 *     summary: Menghapus dokter berdasarkan ID
 *     description: Endpoint ini digunakan untuk menghapus dokter berdasarkan ID yang diberikan.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dokter yang akan dihapus.
 *     responses:
 *       200:
 *         description: Dokter berhasil dihapus.
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
 *                   example: "Dokter berhasil dihapus"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_dokter:
 *                       type: integer
 *                       example: 1
 *                     nama:
 *                       type: string
 *                       example: "Dr. Budi Santoso"
 *                     kontak:
 *                       type: string
 *                       example: "08123456789"
 *                     gambar:
 *                       type: string
 *                       example: "https://ik.imagekit.io/example.jpg"
 *       400:
 *         description: Format ID dokter tidak valid.
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
 *                   example: "Invalid dokter ID format"
 *       404:
 *         description: Dokter tidak ditemukan.
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
 *                   example: "Dokter dengan ID 10 tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan server yang tidak terduga.
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
 *                   example: "Unexpected error occurred"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
Route.delete("/:id", auth, dokterController.deleteDokter);

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
