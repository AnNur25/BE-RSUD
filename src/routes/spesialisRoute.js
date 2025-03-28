const express = require("express");
const Route = express.Router();
const spesialisController = require("../controllers/spesialisController");
const { auth } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /spesialis:
 *   post:
 *     summary: Menambahkan spesialis baru
 *     description: Endpoint ini digunakan untuk menambahkan spesialis baru ke dalam sistem.
 *     tags:
 *       - Spesialis
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_spesialis:
 *                 type: string
 *                 example: "Spesialis Bedah"
 *               deskripsi:
 *                 type: string
 *                 example: "Ahli dalam melakukan prosedur bedah"
 *     responses:
 *       201:
 *         description: Spesialis berhasil ditambahkan.
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
 *                   example: "Spesialis berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 200
 *                     status:
 *                       type: string
 *                       example: "Success"
 *                     message:
 *                       type: string
 *                       example: "Spesialis berhasil diperbarui"
 *                     data:
 *                       type: object
 *                       properties:
 *                         id_Spesialis:
 *                           type: string
 *                           example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                         nama_spesialis:
 *                           type: string
 *                           example: "spesialis baru 1"
 *                         deskripsi:
 *                           type: string
 *                           example: "baru baru"
 *                         id_user:
 *                           type: string
 *                           example: "bf27354f-6d82-4e25-9541-b9e"
 *       400:
 *         description: Nama spesialis dan deskripsi harus diisi.
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
 *                   example: "Nama spesialis dan deskripsi harus diisi."
 *       401:
 *         description: User tidak ditemukan. Pastikan sudah login.
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
 *                   example: "Detail error dari server."
 */
Route.post("/", auth, spesialisController.createSpesialis);

/**
 * @swagger
 * /spesialis:
 *   get:
 *     summary: Mengambil daftar spesialis
 *     description: Mengambil semua spesialis yang tersedia.
 *     tags:
 *       - Spesialis
 *     responses:
 *       200:
 *         description: Data spesialis berhasil diambil.
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
 *                   example: "Data spesialis berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_Spesialis:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       nama_spesialis:
 *                         type: string
 *                         example: "spesialis baru 1"
 *                       deskripsi:
 *                         type: string
 *                         example: "baru baru"
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
 *                   example: "Detail error dari server."
 */
Route.get("/", spesialisController.getSpesialis);

/**
 * @swagger
 * /spesialis/{id}:
 *   put:
 *     summary: Memperbarui spesialis
 *     description: Mengubah data spesialis berdasarkan ID.
 *     tags:
 *       - Spesialis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *        example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *         description: ID spesialis yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_spesialis:
 *                 type: string
 *                 example: "Spesialis Jantung"
 *               deskripsi:
 *                 type: string
 *                 example: "Ahli dalam menangani penyakit jantung"
 *     responses:
 *       200:
 *         description: Spesialis berhasil diperbarui.
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
 *                   example: "Spesialis berhasil diperbarui"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_Spesialis:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       nama_spesialis:
 *                         type: string
 *                         example: "Spesialis Bedah"
 *                       deskripsi:
 *                         type: string
 *                         example: "Ahli dalam melakukan prosedur bedah"
 *       400:
 *         description: Format ID spesialis tidak valid.
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
 *                   example: "Format ID spesialis tidak valid"
 *       404:
 *         description: Spesialis tidak ditemukan.
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
 *                   example: "Spesialis dengan ID 2 tidak ditemukan"
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
Route.put("/:id", spesialisController.updateSpesialis);

/**
 * @swagger
 * /spesialis/{id}:
 *   delete:
 *     summary: Memperbarui spesialis
 *     description: Mengubah data spesialis berdasarkan ID.
 *     tags:
 *       - Spesialis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID spesialis yang akan dihapus.
 *     responses:
 *       200:
 *         description: Spesialis berhasil dihapus.
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
 *                   example: "Spesialis berhasil dihapus"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Spesialis:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     nama_spesialis:
 *                       type: string
 *                       example: "spesialis baru 1"
 *                     deskripsi:
 *                       type: string
 *                       example: "baru baru"
 *       400:
 *         description: Format ID spesialis tidak valid.
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
 *                   example: "Format ID spesialis tidak valid"
 *       404:
 *         description: Spesialis tidak ditemukan.
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
 *                   example: "Spesialis dengan ID 2 tidak ditemukan"
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
Route.delete("/:id", spesialisController.deleteSpesialis);

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
