const express = require("express");
const route = express.Router();
const JadwalDokterController = require("../controllers/jadwal-dokter-controller");
const { auth } = require("../middlewares/auth-middleware");
/**
 * @swagger
 * /jadwal-dokter/search:
 *   get:
 *     summary: Cari jadwal dokter berdasarkan tanggal dan poli
 *     description: Endpoint untuk mencari jadwal dokter berdasarkan ID poli dan tanggal tertentu.
 *     tags:
 *       - Jadwal Dokter
 *     parameters:
 *       - in: query
 *         name: id_poli
 *         schema:
 *           type: string
 *         required: true
 *         description: ID dari poli yang ingin dicari.
 *       - in: query
 *         name: tanggal
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-15"
 *         required: true
 *         description: Tanggal untuk mencari jadwal (format YYYY-MM-DD).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman.
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan hasil pencarian jadwal dokter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Data jadwal dokter untuk hari Selasa (2025-04-15) berhasil diambil."
 *                 dokter:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: string
 *                       nama_dokter:
 *                         type: string
 *                       gambar_dokter:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       poli:
 *                         type: object
 *                         properties:
 *                           id_poli:
 *                             type: string
 *                           nama_poli:
 *                             type: string
 *                       pelayanan:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_pelayanan:
 *                               type: string
 *                             nama_pelayanan:
 *                               type: string
 *                             jadwal:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   hari:
 *                                     type: string
 *                                   sesi:
 *                                     type: string
 *                                   jam_mulai:
 *                                     type: string
 *                                   jam_selesai:
 *                                     type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Permintaan tidak valid
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
 *                   example: "ID poli dan tanggal wajib diisi"
 *       404:
 *         description: Permintaan tidak valid
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
 *                   example: "tidak ada jadwal dokter pada hari ${namaHariSekarang} (${tanggal})."
 *       500:
 *         description: Terjadi kesalahan pada server
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
route.get("/search", JadwalDokterController.searchJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter/{id_poli}:
 *   get:
 *     summary: Mendapatkan daftar dokter berdasarkan ID poli
 *     description: Endpoint ini digunakan untuk mengambil daftar dokter yang terdaftar pada suatu poli tertentu berdasarkan ID poli.
 *     tags:
 *       - Jadwal Dokter
 *     security:
 *       - bearerAuth: []
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
 *                   example: "ID poli wajib diisi"
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
 *       404:
 *         description: Permintaan tidak valid
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
 *                   example: "Tidak ada dokter ditemukan untuk poli tersebut"
 *       500:
 *         description: Terjadi kesalahan pada server
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
route.get("/:id_poli", auth, JadwalDokterController.getDokterByPoli);

/**
 * @swagger
 * /jadwal-dokter:
 *   get:
 *     summary: Mendapatkan seluruh jadwal dokter
 *     description: Endpoint ini digunakan untuk mengambil seluruh jadwal dokter beserta informasi dokter, poli, dan daftar pelayanan yang terkait dengan hari dan jam praktiknya. Data ditampilkan dengan sistem pagination berdasarkan jumlah dokter.
 *     tags:
 *       - Jadwal Dokter
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
 *           default: 10
 *         description: Jumlah dokter yang ditampilkan per halaman.
 *     responses:
 *       200:
 *         description: Berhasil mengambil seluruh jadwal dokter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
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
 *                                 example: "5aad80c9-bf65-477f-824f-f550a7894bdd"
 *                               nama:
 *                                 type: string
 *                                 example: "Dokter Spesialis Bedah"
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
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         pageSize:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 100
 *                         totalPages:
 *                           type: integer
 *                           example: 10
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
 *       404:
 *         description: Permintaan tidak valid
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
 *                   example: "Data jadwal dokter belum tersedia"
 *       500:
 *         description: Terjadi kesalahan pada server
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
route.get("/", JadwalDokterController.getAllJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter:
 *   post:
 *     summary: Menambahkan jadwal dokter baru
 *     description: Endpoint ini digunakan untuk menambahkan jadwal dokter berdasarkan daftar layanan dan jadwal hari yang dikirim dalam request.
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
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_dokter:
 *                       type: integer
 *                       example: 101
 *                       description: ID dokter
 *                     nama_dokter:
 *                       type: string
 *                       example: "dr. Andi"
 *                       description: Nama dokter
 *                     message:
 *                       type: string
 *                       example: "Jadwal dokter berhasil ditambahkan"
 *                 message:
 *                   type: string
 *                   example: "Success"
 *       400-layananist:
 *         description: Permintaan tidak valid
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
 *                   example: "Setiap layanan harus memiliki daftar hari (hariList) yang valid."
 *       400-harilist:
 *         description: Permintaan tidak valid
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
 *                   example: "Setiap jadwal harus memiliki hari, jam_mulai, dan jam_selesai."
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
 *       404:
 *         description: Permintaan tidak valid
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
 *                   example: "Dokter dengan ID ${id_dokter} tidak ditemukan."
 *       500:
 *         description: Terjadi kesalahan pada server
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
route.post("/", auth, JadwalDokterController.createJadwalDokter);

/**
 * @swagger
 * /jadwal-dokter/{id_dokter}:
 *   put:
 *     summary: Memperbarui seluruh jadwal dokter
 *     description: Endpoint ini digunakan untuk memperbarui seluruh jadwal dokter berdasarkan ID dokter. Semua jadwal lama akan dihapus dan digantikan dengan data baru.
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
 *                 description: Daftar layanan dan jadwal hari dokter.
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_pelayanan:
 *                       type: string
 *                       example: "201"
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
 *                     id_dokter:
 *                       type: string
 *                       example: "101"
 *                     nama_dokter:
 *                       type: string
 *                       example: "dr. Andi Santoso"
 *       400:
 *         description: Permintaan tidak valid.
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
 *                   example: "Setiap layanan harus memiliki daftar hari (hariList) yang valid."
 *       404:
 *         description: Dokter tidak ditemukan.
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
 *                   example: "Dokter dengan ID 101 tidak ditemukan."
 *       500:
 *         description: Terjadi kesalahan pada server
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Jadwal dokter dengan ID 123 berhasil dihapus"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Dokter tidak ditemukan.
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
 *                   example: "Dokter dengan ID 123 tidak ditemukan."
 *       500:
 *         description: Terjadi kesalahan pada server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 500
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
