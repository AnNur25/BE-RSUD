const express = require("express");
const Route = express.Router();
const multer = require("multer");
const dokterController = require("../controllers/dokter-controller");
const multerConfig = require("../middlewares/multer-middleware");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
const { auth } = require("../middlewares/auth-middleware");

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
 *                 example: "dr. H. Agus Yudho Santoso, Sp.PD, Finasim ( AYS )"
 *               id_poli:
 *                 type: string
 *                 example: "ab592474-d37e-4b20-abcd-5230fca43d28"
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
 *                     gambar:
 *                       type: string
 *                       example: "https://ik.imagekit.io/example.jpg"
 *                     id_Spesialis:
 *                       type: string
 *                       example: "io6"
 *                     id_pelayanan_dokter:
 *                       type: string
 *                       example: "kjji8"
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
  multerErrorHandler,
  multerConfig.single("file"),
  dokterController.createDokter
);

/**
 * @swagger
 * /dokter:
 *   get:
 *     summary: Mendapatkan daftar dokter
 *     description: Endpoint ini digunakan untuk mengambil data semua dokter beserta spesialis dan jenis pelayanan yang mereka tawarkan.
 *     tags:
 *       - Dokter
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman yang ingin diambil.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Jumlah Dokter yang ditampilkan per halaman.
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
 *                         example: "Dr. Andi"
 *                       kontak:
 *                         type: string
 *                         example: "081234567890"
 *                       gambar:
 *                         type: string
 *                         example: "https://ik.imagekit.io/ena3eh2k0/Screenshot_2025-03-18_144412_824nKFPqX.png"
 *                       spesialis:
 *                         type: object
 *                         properties:
 *                           nama_spesialis:
 *                             type: string
 *                             example: "spesialis baru 1"
 *                       pelayananDokter:
 *                         type: object
 *                         properties:
 *                           nama_pelayanan:
 *                             type: string
 *                             example: "Pelayanan Konsultasi"
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
Route.get("/", dokterController.getDokter);

/**
 * @swagger
 * /dokter/{id_dokter}:
 *   put:
 *     summary: Memperbarui data dokter
 *     description: Mengupdate informasi dokter berdasarkan ID dokter yang diberikan.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_dokter
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar dokter yang akan diunggah.
 *               id_poli:
 *                 type: string
 *                 example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
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
 *                     id:
 *                       type: string
 *                       example: "2c4d37aa-a0b6-433f-8011-387733d626b5"
 *                     nama:
 *                       type: string
 *                       example: "Dr. Budi Santoso"
 *       400:
 *         description: Permintaan tidak valid
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
 *                   example: "ID Dokter, Nama, dan ID Poli harus diisi"
 *       404:
 *         description: Dokter atau Poli tidak ditemukan
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
 *                   example: "Dokter tidak ditemukan"
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
 *                   example: "Gagal mengupdate dokter"
 */
Route.put(
  "/:id_dokter", auth, multerErrorHandler,
  multerConfig.single("gambar"),
  dokterController.updateDokter
);

/**
 * @swagger
 * /dokter/{id_dokter}:
 *   delete:
 *     summary: Menghapus dokter berdasarkan ID
 *     description: Endpoint ini digunakan untuk menghapus dokter berdasarkan ID yang diberikan.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_dokter
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *                       type: string
 *                       example: "jikhio-6d82-4e25-9541-b9efc8bf57ed"
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
Route.delete("/:id_dokter", auth, multerErrorHandler, dokterController.deleteDokter);

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
