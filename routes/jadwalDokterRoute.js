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
 *                 type: string
 *                 example: "bf27354f"
 *               id_Hari:
 *                 type: string
 *                 example: "bf27354f57ed"
 *               id_dokter:
 *                 type: string
 *                 example: "3er57ed"
 *               id_jamkerja:
 *                 type: string
 *                 example: "bf2c8bf57ed"
 *               id_user:
 *                 type: string
 *                 example: "bfemy7ed"
 *     responses:
 *       "201":
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
 *                       type: string
 *                       example: "bf27334fregebebf57ed"
 *                     id_Hari:
 *                       type: string
 *                       example: "bf27eokijuguguh57ed"
 *                     id_dokter:
 *                       type: string
 *                       example: "kjji8"
 *                     id_jamkerja:
 *                       type: string
 *                       example: "kjji8"
 *                     id_user:
 *                       type: string
 *                       example: "kjji8"
 *       "400":
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
 *       "404":
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
 *       "500":
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
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                       dokter:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "bf272323354f-6d82-4e25-9541-b9efc8bf57ed"
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
 *                             type: string
 *                             example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                           nama:
 *                             type: string
 *                             example: "Pagi"
 *                       hari:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "bf2735egeeh4f-6d82-4e25-9541-b9efc8bf57ed"
 *                           nama:
 *                             type: string
 *                             example: "Senin"
 *                       jam_kerja:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "bf27353354f-6d82-4e25-9541-b9efc8bf57ed"
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
 *                             type: string
 *                             example: "bf27354f-6d43482-4e25-9541-b9efc8bf57ed"
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
 * /jadwal-dokter/search:
 *   get:
 *     summary: Mendapatkan daftar jadwal dokter berdasarkan filter
 *     description: API ini digunakan untuk mengambil data jadwal dokter dengan berbagai filter seperti nama dokter, sesi, jam kerja, hari, dan spesialis.
 *     tags:
 *       - Jadwal Dokter
 *     parameters:
 *       - in: query
 *         name: nama_dokter
 *         schema:
 *           type: string
 *         description: Nama dokter yang ingin dicari.
 *       - in: query
 *         name: sesi
 *         schema:
 *           type: string
 *         description: Sesi jadwal dokter.
 *       - in: query
 *         name: jam_mulai
 *         schema:
 *           type: string
 *           format: time
 *         description: Jam mulai jadwal dokter.
 *       - in: query
 *         name: jam_selesai
 *         schema:
 *           type: string
 *           format: time
 *         description: Jam selesai jadwal dokter.
 *       - in: query
 *         name: hari_mulai
 *         schema:
 *           type: string
 *         description: Hari mulai jadwal dokter.
 *       - in: query
 *         name: hari_selesai
 *         schema:
 *           type: string
 *         description: Hari selesai jadwal dokter.
 *       - in: query
 *         name: spesialis
 *         schema:
 *           type: string
 *         description: Spesialisasi dokter.
 *     responses:
 *       200:
 *         description: Berhasil menampilkan jadwal dokter berdasarkan filter.
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
 *                   example: "Berhasil menampilkan jadwal dokter berdasarkan filter."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_jadwal_dokter:
 *                         type: string
 *                         example: 1
 *                       dokter:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 101
 *                           nama:
 *                             type: string
 *                             example: "Dr. Budi Santoso"
 *                           kontak:
 *                             type: string
 *                             example: "08123456789"
 *                           gambar:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           spesialis:
 *                             type: string
 *                             example: "Spesialis Bedah"
 *                           pelayanan:
 *                             type: string
 *                             example: "Bedah Umum"
 *                       sesi:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "bf2735wrw4f-6d82-4e25-9541-b9efc8bf57ed"
 *                           nama:
 *                             type: string
 *                             example: "Pagi"
 *                       hari:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "bfrr27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                           hari_mulai:
 *                             type: string
 *                             example: "Senin"
 *                           hari_selesai:
 *                             type: string
 *                             example: "Jumat"
 *                       jam_kerja:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "bf27354f-634d82-4e25-9541-b9efc8bf57ed"
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
 *                             type: string
 *                             example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                           nama:
 *                             type: string
 *                             example: "Admin Klinik"
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
 *                   example: "Unexpected error occurred."
 */
route.get("/search", JadwalDokterController.searchJadwalDokter);

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
 *           type: string
 *         description: ID jadwal dokter yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_Sesi:
 *                 type: string
 *                 example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *               id_Hari:
 *                 type: string
 *                 example: "bf27354f-6d82-9541-b9efc8bf57ed"
 *               id_dokter:
 *                 type: string
 *                 example: "bf27354f541-b9efc8bf57ed"
 *               id_jamkerja:
 *                 type: string
 *                 example: "bf274e25-9541-b9efc8bf57ed"
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
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     id_Sesi:
 *                       type: string
 *                       example: "bf2-4e25-9541-b9efc8bf57ed"
 *                     id_Hari:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-bf57ed"
 *                     id_dokter:
 *                       type: string
 *                       example: "bf27354f-6efc8bf57ed"
 *                     id_jamkerja:
 *                       type: string
 *                       example: "bf2-4e25-9541-b9efc8bf57ed"
 *                     id_user:
 *                       type: string
 *                       example: "bf27354f-1-b9efc8bf57ed"
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
 *           type: string
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
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     id_Sesi:
 *                       type: string
 *                       example: "bf27354f-4e25-9541-b9efc8bf57ed"
 *                     id_Hari:
 *                       type: string
 *                       example: "bf27-6d82-4e25-9541-b9efc8bf57ed"
 *                     id_dokter:
 *                       type: string
 *                       example: "bf27354f-6d-b9efc8bf57ed"
 *                     id_jamkerja:
 *                       type: string
 *                       example: "bf27354f-6d82b9efc8bf57ed"
 *                     id_user:
 *                       type: string
 *                       example: "bf282-4e25-9541-b9efc8bf57ed"
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
