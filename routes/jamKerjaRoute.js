const express = require("express");
const route = express.Router();
const jamKerjaController = require("../controllers/jamKerjaController");
const { auth } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /jam-kerja:
 *   post:
 *     summary: Menambahkan jam kerja baru
 *     description: Endpoint ini digunakan untuk menambahkan data jam kerja baru dengan jam mulai dan jam selesai.
 *     tags:
 *       - Jam Kerja
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jam_mulai:
 *                 type: string
 *                 format: date-time
 *                 example: "08:00"
 *               jam_selesai:
 *                 type: string
 *                 format: date-time
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Jam kerja berhasil ditambahkan.
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
 *                   example: "Jam kerja berhasil ditambahkan."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_jamkerja:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     jam_mulai:
 *                       type: string
 *                       format: date-time
 *                       example: "08:00"
 *                     jam_selesai:
 *                       type: string
 *                       format: date-time
 *                       example: "16:00"
 *                     id_user:
 *                       type: string
 *                       example: "bf27-4e25-9541-b9efc8bf57ed"
 *       400:
 *         description: Jam mulai dan jam selesai wajib diisi.
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
 *                   example: "jam mulai dan jam selesai wajib diisi."
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
route.post("/", auth, jamKerjaController.createJamKerja);

/**
 * @swagger
 * /jam-kerja:
 *   get:
 *     summary: Mendapatkan daftar jam kerja
 *     description: Endpoint ini digunakan untuk mengambil semua data jam kerja yang tersedia.
 *     tags:
 *       - Jam Kerja
 *     responses:
 *       200:
 *         description: Berhasil menampilkan daftar jam kerja.
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
 *                   example: "berhasil menampilkan jam kerja"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_jamkerja:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       jam_mulai:
 *                         type: string
 *                         format: date-time
 *                         example: "08:00"
 *                       jam_selesai:
 *                         type: string
 *                         format: date-time
 *                         example: "17:00"
 *                       id_user:
 *                         type: string
 *                         example: "bf27354f-6d-9541-b9efc8bf57ed"
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
route.get("/", jamKerjaController.getJamKerja);

/**
 * @swagger
 * /jam-kerja/{id}:
 *   put:
 *     summary: Memperbarui data jam kerja
 *     description: Endpoint ini digunakan untuk memperbarui data jam kerja berdasarkan ID.
 *     tags:
 *       - Jam Kerja
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID jam kerja yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jam_mulai:
 *                 type: string
 *                 format: date-time
 *                 example: "08:00"
 *               jam_selesai:
 *                 type: string
 *                 format: date-time
 *                 example: "16:00"
 *     responses:
 *       200:
 *         description: Berhasil memperbarui jam kerja.
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
 *                   example: "Jam kerja berhasil diperbarui."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Jamkerja:
 *                       type: string
 *                       example: "bf273-6d82-4e25-9541-b9efc8bf57ed"
 *                     jam_mulai:
 *                       type: string
 *                       format: date-time
 *                       example: "08:00"
 *                     jam_selesai:
 *                       type: string
 *                       format: date-time
 *                       example: "16:00"
 *                     id_user:
 *                       type: string
 *                       example: "bf27-6d82-4e25-9541-b9efd"
 *       400:
 *         description: Format ID tidak valid atau input tidak lengkap.
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
 *                   example: "Format ID tidak valid."
 *       404:
 *         description: Jam kerja dengan ID yang diberikan tidak ditemukan.
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
 *                   example: "Jam kerja dengan ID 1 tidak ditemukan."
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
route.put("/:id", auth, jamKerjaController.updateJamKerja);

/**
 * @swagger
 * /jam-kerja/{id}:
 *   delete:
 *     summary: Menghapus data jam kerja
 *     description: Endpoint ini digunakan untuk menghapus data jam kerja berdasarkan ID.
 *     tags:
 *       - Jam Kerja
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID jam kerja yang akan dihapus.
 *     responses:
 *       200:
 *         description: Berhasil menghapus jam kerja.
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
 *                   example: "Jam kerja berhasil dihapus."
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
 *                   example: "Format ID tidak valid."
 *       404:
 *         description: Jam kerja dengan ID yang diberikan tidak ditemukan.
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
 *                   example: "Jam kerja dengan ID 1 tidak ditemukan."
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
route.delete("/:id", auth, jamKerjaController.deleteJamKerja);

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
