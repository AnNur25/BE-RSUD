const express = require("express");
const route = express.Router();
const JadwalDokterController = require("../controllers/jadwalDokter/jadwalDokterController");
const { auth } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /jadwal-dokter:
 *   post:
 *     summary: Menambahkan jadwal dokter baru
 *     description: Endpoint ini digunakan untuk menambahkan jadwal dokter berdasarkan daftar jadwal yang dikirim dalam request.
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
 *               jadwalList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_dokter:
 *                       type: string
 *                       example: "db93a5a8-8300-43b5-a2c7-652fdc75b368"
 *                       description: ID dokter yang akan ditambahkan jadwalnya
 *                     hariList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           hari:
 *                             type: string
 *                             enum: [SENIN, SELASA, RABU, KAMIS, JUMAT, SABTU, MINGGU]
 *                             description: Hari jadwal dokter
 *                           jam_mulai:
 *                             type: string
 *                             format: time
 *                             example: "07:00"
 *                             description: Jam mulai praktik
 *                           jam_selesai:
 *                             type: string
 *                             format: time
 *                             example: "14:00"
 *                             description: Jam selesai praktik
 *     responses:
 *       201:
 *         description: Jadwal dokter berhasil ditambahkan
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
 *                 dokter:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: string
 *                       jadwal:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             hari:
 *                               type: string
 *                             sesi:
 *                               type: string
 *                               example: "Pagi"
 *                             jam_mulai:
 *                               type: string
 *                               format: time
 *                             jam_selesai:
 *                               type: string
 *                               format: time
 *                 total_jadwal:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Kesalahan dalam permintaan
 *       404:
 *         description: Dokter tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
route.post("/", auth, JadwalDokterController.createJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter:
 *   get:
 *     summary: Mengambil daftar jadwal dokter beserta informasi terkait
 *     description: Endpoint ini digunakan untuk mengambil semua jadwal dokter yang tersedia.
 *     tags:
 *       - Jadwal Dokter
 *     responses:
 *       200:
 *         description: Data jadwal dokter berhasil diambil
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
 *                   example: "Data jadwal dokter berhasil diambil."
 *                 dokter:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: string
 *                         example: "opoj"
 *                       nama_dokter:
 *                         type: string
 *                         example: "Dr. Andi Hartanto"
 *                       gambar_dokter:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       spesialis:
 *                         type: object
 *                         properties:
 *                           id_Spesialis:
 *                             type: string
 *                             example: "oiooh"
 *                           nama_spesialis:
 *                             type: string
 *                             example: "Spesialis Jantung"
 *                       pelayanan:
 *                         type: object
 *                         properties:
 *                           id_pelayanan_dokter:
 *                             type: string
 *                             example: "ojoj"
 *                           nama_pelayanan:
 *                             type: string
 *                             example: "Pelayanan Umum"
 *                       jadwal:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             hari:
 *                               type: string
 *                               example: "Senin"
 *                             sesi:
 *                               type: string
 *                               example: "Pagi"
 *                             jam_mulai:
 *                               type: string
 *                               example: "08:00"
 *                             jam_selesai:
 *                               type: string
 *                               example: "12:00"
 *                 total_jadwal:
 *                   type: integer
 *                   example: 10
 *                 total_jadwal_per_spesialis:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_spesialis:
 *                         type: string
 *                         example: "rjgfdsk"
 *                       nama_spesialis:
 *                         type: string
 *                         example: "Spesialis Jantung"
 *                       total_jadwal:
 *                         type: integer
 *                         example: 5
 *       500:
 *         description: Terjadi kesalahan pada server
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
 *                   example: "Terjadi kesalahan pada server."
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
route.get("/", JadwalDokterController.getJadwalDokter);
/**
 * @swagger
 * /jadwal-dokter/search:
 *   get:
 *     summary: Mencari jadwal dokter berdasarkan spesialis dan tanggal
 *     description: Endpoint ini digunakan untuk mencari jadwal dokter berdasarkan ID spesialis dan tanggal yang diberikan.
 *     tags:
 *       - Jadwal Dokter
 *     parameters:
 *       - in: query
 *         name: id_Spesialis
 *         required: true
 *         schema:
 *           type: string
 *           example: "ab592474-d37e-4b20-abcd-5230fca43d28"
 *         description: ID spesialis dokter.
 *       - in: query
 *         name: tanggal
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-03-25"
 *         description: Tanggal pencarian dalam format YYYY-MM-DD.
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan jadwal dokter.
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
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Data jadwal dokter untuk hari Senin (2025-03-25) berhasil diambil.
 *                 dokter:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: string
 *                         example: "1"
 *                       nama_dokter:
 *                         type: string
 *                         example: Dr. Budi
 *                       gambar_dokter:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       spesialis:
 *                         type: object
 *                         properties:
 *                           id_Spesialis:
 *                             type: string
 *                             example: "3"
 *                           nama:
 *                             type: string
 *                             example: Spesialis Jantung
 *                       pelayanan:
 *                         type: object
 *                         properties:
 *                           id_pelayanan_dokter:
 *                             type: string
 *                             example: "5"
 *                           nama:
 *                             type: string
 *                             example: Konsultasi Jantung
 *                       jadwal:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             hari:
 *                               type: string
 *                               example: Senin
 *                             sesi:
 *                               type: string
 *                               example: Pagi
 *                             jam_mulai:
 *                               type: string
 *                               example: "08:00"
 *                             jam_selesai:
 *                               type: string
 *                               example: "12:00"
 *                 total_jadwal:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Parameter tidak lengkap.
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
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: ID Spesialis dan Tanggal diperlukan
 *       404:
 *         description: Tidak ada jadwal dokter yang ditemukan.
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
 *                   example: Not Found
 *                 message:
 *                   type: string
 *                   example: Tidak ada jadwal dokter untuk spesialis ini pada hari Senin (2025-03-25).
 *       500:
 *         description: Kesalahan server.
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
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan pada server.
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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
