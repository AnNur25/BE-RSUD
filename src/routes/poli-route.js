const express = require("express");
const Route = express.Router();
const poliController = require("../controllers/poli-controller");
const { auth } = require("../middlewares/auth-middleware");

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
 *                       example: "poli berhasil diperbarui"
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
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Nama spesialis harus diisi."
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
Route.post("/", auth, poliController.createPoli);

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
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
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
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Ops! daftar poli kosong"
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
Route.get("/", poliController.getPoli);

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
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Nama poli harus diisi"
 *       404:
 *         description: Poli tidak ditemukan.
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
 *                   example: "Poli dengan ID bf27354f-6d82-4e25-9541-b9efc8bf57ed tidak ditemukan"
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
Route.put("/:id_poli", auth, poliController.updatePoli);

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
