const express = require("express");
const route = express.Router();
const direkturController = require("../controllers/direktur-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");
const multer = require("../middlewares/multer-middleware");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");

route.post(
  "/direktur",
  auth,
  authorizeRole("ADMIN"),
  multer.single("gambar"),
  multerErrorHandler,
  direkturController.createDirektur
);

route.put(
  "/direktur/:id_direktur",
  auth,
  authorizeRole("ADMIN"),
  multer.single("gambar"),
  multerErrorHandler,
  direkturController.updateDirektur
);

route.get("/direktur", direkturController.getDirektur);
/**
 * @swagger
 * /api/v1/direktur:
 *   post:
 *     summary: Menambah data direktur baru
 *     description: Membuat data direktur baru dengan upload gambar yang akan dikonversi ke format WebP.
 *     tags:
 *       - Direktur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar direktur (opsional, akan dikonversi ke WebP dengan kualitas 50%)
 *     responses:
 *       200:
 *         description: Data direktur berhasil ditambahkan.
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
 *                   example: "Data direktur berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_direktur:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     gambar:
 *                       type: string
 *                       nullable: true
 *                       example: "https://frontend.example.com/uploads/resized/image123.webp"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-14T10:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-14T10:30:00.000Z"
 *       400:
 *         description: Format file tidak valid atau terjadi kesalahan upload.
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
 *                   example: "Format file tidak didukung"
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
 *       403:
 *         description: Akses ditolak, hanya admin yang dapat mengakses.
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
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "Akses ditolak. Hanya admin yang dapat mengakses"
 *       500:
 *         description: Terjadi kesalahan pada server.
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

/**
 * @swagger
 * /api/v1/direktur/{id_direktur}:
 *   put:
 *     summary: Memperbarui data direktur
 *     description: Mengubah data direktur berdasarkan ID dengan opsi upload gambar baru.
 *     tags:
 *       - Direktur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_direktur
 *         required: true
 *         schema:
 *           type: string
 *         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *         description: ID Direktur yang akan diperbarui.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar direktur baru (opsional, akan dikonversi ke WebP dengan kualitas 50%)
 *     responses:
 *       200:
 *         description: Data direktur berhasil diperbarui.
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
 *                   example: "Data direktur berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_direktur:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     gambar:
 *                       type: string
 *                       nullable: true
 *                       example: "https://frontend.example.com/uploads/resized/image123.webp"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-14T10:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-14T10:30:00.000Z"
 *       400:
 *         description: Format ID direktur tidak valid, gambar direktur harus ada, atau terjadi kesalahan upload.
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
 *                   example: "Gambar direktur harus ada."
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
 *       403:
 *         description: Akses ditolak, hanya admin yang dapat mengakses.
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
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "Akses ditolak. Hanya admin yang dapat mengakses"
 *       404:
 *         description: Direktur tidak ditemukan.
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
 *                   example: "Data direktur tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan pada server.
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

/**
 * @swagger
 * /api/v1/direktur:
 *   get:
 *     summary: Mengambil semua data direktur
 *     description: Mendapatkan daftar semua data direktur yang tersedia.
 *     tags:
 *       - Direktur
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan semua data direktur.
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
 *                   example: "Data direktur berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_direktur:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       gambar:
 *                         type: string
 *                         nullable: true
 *                         example: "https://frontend.example.com/uploads/resized/image123.webp"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-14T10:30:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-14T10:30:00.000Z"
 *       404:
 *         description: Data direktur tidak ditemukan.
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
 *                   example: "Data direktur tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan pada server.
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
module.exports = route;
