const express = require("express");
const route = express.Router();
const JadwalDokterController = require("../controllers/jadwalDokterController");
const { auth } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /jadwal-dokter:
 *   post:
 *     summary: Menambahkan jadwal dokter baru
 *     description: Endpoint ini digunakan untuk menambahkan jadwal dokter berdasarkan sesi, hari, dokter, dan jam kerja.
 *     tags:
 *       - Jadwal Dokter
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_Sesi:
 *                 type: integer
 *                 example: 1
 *               id_Hari:
 *                 type: integer
 *                 example: 2
 *               id_dokter:
 *                 type: integer
 *                 example: 3
 *               id_jamkerja:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Jadwal dokter berhasil ditambahkan.
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
 *                   example: "Jadwal dokter berhasil ditambahkan."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_Sesi:
 *                       type: integer
 *                       example: 1
 *                     id_Hari:
 *                       type: integer
 *                       example: 2
 *                     id_dokter:
 *                       type: integer
 *                       example: 3
 *                     id_jamkerja:
 *                       type: integer
 *                       example: 4
 *                     id_user:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Semua field wajib diisi.
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
 *                   example: "Semua field wajib diisi."
 *       404:
 *         description: Salah satu ID tidak ditemukan (Sesi, Hari, Dokter, Jam Kerja, atau User).
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
 *                   example: "ID Sesi tidak ditemukan."
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
route.post("/", auth, JadwalDokterController.createJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter:
 *   get:
 *     summary: Menampilkan jadwal dokter baru
 *     description: Endpoint ini digunakan untuk Menampilkan jadwal dokter
 *     tags:
 *       - Jadwal Dokter
 *     responses:
 *       200:
 *         description: Berhasil menampilkan semua jadwal dokter.
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
 *                   example: "Berhasil menampilkan semua jadwal dokter."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_jadwal_dokter:
 *                         type: integer
 *                         example: 1
 *                       dokter:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 10
 *                           nama:
 *                             type: string
 *                             example: "Dr. Andi"
 *                           kontak:
 *                             type: string
 *                             example: "081234567890"
 *                           gambar:
 *                             type: string
 *                             example: "https://example.com/foto-dokter.jpg"
 *                           spesialis:
 *                             type: string
 *                             example: "Spesialis Jantung"
 *                           pelayanan:
 *                             type: string
 *                             example: "Pelayanan Konsultasi"
 *                       sesi:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           nama:
 *                             type: string
 *                             example: "Sesi Pagi"
 *                       hari:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           nama:
 *                             type: string
 *                             example: "Senin"
 *                       jam_kerja:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           jam_mulai:
 *                             type: string
 *                             example: "08:00"
 *                           jam_selesai:
 *                             type: string
 *                             example: "12:00"
 *                       dibuat_oleh:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 20
 *                           nama:
 *                             type: string
 *                             example: "Admin Klinik"
 *       404:
 *         description: Data jadwal dokter tidak ditemukan.
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
 *                   example: "Data jadwal dokter tidak ditemukan."
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
 *                   example: "Database connection failed."
 */
route.get("/", JadwalDokterController.getJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter/{id}:
 *   put:
 *     summary: Menambahkan jadwal dokter baru
 *     description: Endpoint ini digunakan untuk menambahkan jadwal dokter berdasarkan sesi, hari, dokter, dan jam kerja.
 *     tags:
 *       - Jadwal Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID jadwal dokter yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_Sesi:
 *                 type: integer
 *                 example: 2
 *               id_Hari:
 *                 type: integer
 *                 example: 3
 *               id_dokter:
 *                 type: integer
 *                 example: 10
 *               id_jamkerja:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Jadwal dokter berhasil diperbarui.
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
 *                   example: "Jadwal dokter berhasil diperbarui."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_jadwal_dokter:
 *                       type: integer
 *                       example: 1
 *                     id_Sesi:
 *                       type: integer
 *                       example: 2
 *                     id_Hari:
 *                       type: integer
 *                       example: 3
 *                     id_dokter:
 *                       type: integer
 *                       example: 10
 *                     id_jamkerja:
 *                       type: integer
 *                       example: 5
 *                     id_user:
 *                       type: integer
 *                       example: 20
 *       400:
 *         description: ID tidak valid atau request body salah.
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
 *                   example: "ID tidak valid."
 *       404:
 *         description: Data tidak ditemukan.
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
 *                   example: "Jadwal dokter dengan ID 1 tidak ditemukan."
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
 *                   example: "Database connection failed."
 */
route.put("/:id", auth, JadwalDokterController.updateJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter/{id}:
 *   delete:
 *     summary: menghapus jadwal dokter
 *     description: menghapus jadwal dokter
 *     tags:
 *       - Jadwal Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID jadwal dokter yang akan dihapus.
 *     responses:
 *       200:
 *         description: Jadwal dokter berhasil dihapus.
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
 *                   example: "Jadwal dokter berhasil dihapus."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_jadwal_dokter:
 *                       type: integer
 *                       example: 1
 *                     id_Sesi:
 *                       type: integer
 *                       example: 2
 *                     id_Hari:
 *                       type: integer
 *                       example: 3
 *                     id_dokter:
 *                       type: integer
 *                       example: 10
 *                     id_jamkerja:
 *                       type: integer
 *                       example: 5
 *                     id_user:
 *                       type: integer
 *                       example: 20
 *       400:
 *         description: ID tidak valid.
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
 *                   example: "ID tidak valid."
 *       404:
 *         description: Jadwal dokter tidak ditemukan.
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
 *                   example: "Jadwal dokter dengan ID 1 tidak ditemukan."
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
route.delete("/:id", auth, JadwalDokterController.deleteJadwalDokter);
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
