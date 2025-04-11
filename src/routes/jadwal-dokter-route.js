const express = require("express");
const route = express.Router();
const JadwalDokterController = require("../controllers/jadwal-dokter-controller");
const { auth } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /jadwal-dokter/search:
 *   get:
 *     summary: Mencari jadwal dokter berdasarkan spesialis dan tanggal
 *     description: Endpoint ini digunakan untuk mendapatkan daftar jadwal dokter berdasarkan ID spesialis dan tanggal tertentu.
 *     tags:
 *       - Jadwal Dokter
 *     parameters:
 *       - in: query
 *         name: id_poli
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari (poli) yang ingin dicari
 *       - in: query
 *         name: tanggal
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal pencarian dalam format YYYY-MM-DD
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
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Data jadwal dokter berhasil diambil.
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
 *                         example: "Dr. Budi"
 *                       gambar_dokter:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       spesialis:
 *                         type: object
 *                         properties:
 *                       pelayanan:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_pelayanan_dokter:
 *                               type: string
 *                               example: "5"
 *                             nama:
 *                               type: string
 *                               example: "Konsultasi Jantung"
 *                             jadwal:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   hari:
 *                                     type: string
 *                                     example: "Senin"
 *                                   sesi:
 *                                     type: string
 *                                     example: "Pagi"
 *                                   jam_mulai:
 *                                     type: string
 *                                     example: "08:00"
 *                                   jam_selesai:
 *                                     type: string
 *                                     example: "12:00"
 *                 total_jadwal:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Parameter query tidak lengkap
 *       404:
 *         description: Data tidak ditemukan untuk kombinasi spesialis dan tanggal tersebut
 *       500:
 *         description: Terjadi kesalahan pada server
 */
route.get("/search", JadwalDokterController.searchJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter/{id_poli}:
 *   get:
 *     summary: Mendapatkan daftar dokter berdasarkan ID poli
 *     description: Endpoint ini digunakan untuk mengambil daftar dokter yang terdaftar pada suatu poli tertentu berdasarkan ID poli.
 *     tags:
 *       - Jadwal Dokter
 *     parameters:
 *       - in: path
 *         name: id_poli
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Poli yang ingin dicari daftar dokternya
 *         example: "14b84fa5-8088-4f59-90ec-d5c9d59f408a"
 *     responses:
 *       200:
 *         description: Daftar dokter berhasil diambil
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
 *                   example: "Berhasil menampilkan daftar dokter berdasarkan poli"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: string
 *                         example: "c52c2a67-e9d2-4d19-bd80-ec10dfae23f5"
 *                       nama:
 *                         type: string
 *                         example: "dr. Ahmad Yani"
 *       400:
 *         description: Permintaan tidak valid
 *       404:
 *         description: Tidak ada dokter ditemukan untuk poli tersebut
 *       500:
 *         description: Terjadi kesalahan pada server
 */
route.get("/:id_poli", auth, JadwalDokterController.getDokterByPoli);
/**
 * @swagger
 * /jadwal-dokter:
 *   get:
 *     summary: Mendapatkan seluruh jadwal dokter
 *     description: Endpoint ini digunakan untuk mengambil seluruh jadwal dokter beserta informasi dokter, poli, dan daftar pelayanan yang terkait dengan hari dan jam praktiknya.
 *     tags:
 *       - Jadwal Dokter
 *     responses:
 *       200:
 *         description: Berhasil mengambil seluruh jadwal dokter
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
 *                   example: "Berhasil menampilkan seluruh jadwal dokter"
 *                 data:
 *                   type: object
 *                   properties:
 *                     dokter:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_dokter:
 *                             type: string
 *                             example: "a1b2c3d4-5678-90ab-cdef-1234567890ab"
 *                           nama_dokter:
 *                             type: string
 *                             example: "dr. Siti Nurhaliza"
 *                           poli:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                               nama:
 *                                 type: string
 *                                 example: "Poli Gigi"
 *                           layananList:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id_pelayanan:
 *                                   type: string
 *                                   example: "987e6543-e21a-33d4-a987-876543210000"
 *                                 nama_pelayanan:
 *                                   type: string
 *                                   example: "Pemeriksaan Umum"
 *                                 hariList:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       hari:
 *                                         type: string
 *                                         example: "Senin"
 *                                       jam_mulai:
 *                                         type: string
 *                                         example: "08:00"
 *                                       jam_selesai:
 *                                         type: string
 *                                         example: "10:00"
 *       404:
 *         description: Tidak ada data jadwal dokter ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
route.get("/", JadwalDokterController.getAllJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter:
 *   post:
 *     summary: Menambahkan jadwal dokter baru
 *     description: Endpoint ini digunakan untuk menambahkan jadwal dokter berdasarkan daftar dokter, layanan, dan jadwal hari yang dikirim dalam request.
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
 *               id_dokter:
 *                 type: integer
 *                 example: 101
 *                 description: ID dokter yang akan ditambahkan jadwalnya
 *               layananList:
 *                 type: array
 *                 description: Daftar layanan yang dimiliki oleh dokter
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_pelayanan:
 *                       type: integer
 *                       example: 201
 *                       description: ID pelayanan terkait
 *                     hariList:
 *                       type: array
 *                       description: Daftar jadwal dokter untuk pelayanan ini
 *                       items:
 *                         type: object
 *                         properties:
 *                           hari:
 *                             type: string
 *                             enum: [Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu]
 *                             example: "Senin"
 *                             description: Hari jadwal praktik
 *                           jam_mulai:
 *                             type: string
 *                             format: time
 *                             example: "08:00"
 *                             description: Jam mulai praktik
 *                           jam_selesai:
 *                             type: string
 *                             format: time
 *                             example: "12:00"
 *                             description: Jam selesai praktik
 *     responses:
 *       201:
 *         description: Jadwal dokter berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jadwal_dokter:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dokter_id:
 *                         type: integer
 *                         example: 101
 *                         description: ID dokter
 *                       jadwal:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_pelayanan:
 *                               type: integer
 *                               example: 201
 *                               description: ID pelayanan
 *                             hari:
 *                               type: string
 *                               example: "Senin"
 *                               description: Hari praktik
 *                             jam:
 *                               type: string
 *                               example: "08:00-12:00"
 *                               description: Jam praktik
 *       400:
 *         description: Kesalahan dalam permintaan (bad request)
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
route.get("/", JadwalDokterController.getAllJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter/{id_dokter}:
 *   put:
 *     summary: Memperbarui seluruh jadwal dokter
 *     description: Endpoint ini digunakan untuk memperbarui seluruh jadwal dokter berdasarkan ID dokter. Jadwal sebelumnya akan dihapus dan diganti dengan data baru.
 *     tags:
 *       - Jadwal Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_dokter
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dokter yang jadwalnya akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               layananList:
 *                 type: array
 *                 description: Daftar layanan dan hari jadwal dokter.
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_pelayanan:
 *                       type: string
 *                       example: 201
 *                     hariList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           hari:
 *                             type: string
 *                             example: "Senin"
 *                           jam_mulai:
 *                             type: string
 *                             example: "08:00"
 *                           jam_selesai:
 *                             type: string
 *                             example: "12:00"
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
 *                   example: "Jadwal dokter berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     jadwal_dokter:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dokter_id:
 *                             type: integer
 *                             example: 101
 *                           jadwal:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id_pelayanan:
 *                                   type: integer
 *                                   example: 201
 *                                 hari:
 *                                   type: string
 *                                   example: "Senin"
 *                                 jam:
 *                                   type: string
 *                                   example: "08:00-12:00"
 *       400:
 *         description: Permintaan tidak valid.
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
 *                   example: "Data layananList harus berupa array dan tidak boleh kosong."
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
 *                   example: "Dokter dengan ID 101 tidak ditemukan."
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
route.put("/:id_dokter", auth, JadwalDokterController.updateJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter/{id_dokter}:
 *   delete:
 *     summary: Hapus semua jadwal berdasarkan ID dokter
 *     description: Endpoint ini digunakan untuk menghapus seluruh jadwal dokter berdasarkan ID dokter.
 *     tags:
 *       - Jadwal Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_dokter
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari dokter yang jadwalnya akan dihapus.
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
 *                   example: "Jadwal dokter dengan ID 123 berhasil dihapus"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deleted_count:
 *                       type: integer
 *                       example: 3
 *                     id_dokter:
 *                       type: string
 *                       example: "123"
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
 *                   example: "Dokter dengan ID 123 tidak ditemukan."
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
 */
route.delete(
  "/:id_dokter",
  auth,
  JadwalDokterController.deleteJadwalDokterByDokterId
);

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
