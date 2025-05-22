const express = require("express");
const route = express.Router();
const JadwalDokterController = require("../controllers/jadwal-dokter-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");
/**
 * @swagger
 * api/v1/jadwal-dokter/search:
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
 *         description: Berhasil mengambil  jadwal dokter
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
 *                   example: "Berhasil menampilkan  jadwal dokter"
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
 *                           nama_dokter:
 *                             type: string
 *                           gambar_dokter:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           poli:
 *                             type: object
 *                             properties:
 *                               id_poli:
 *                                 type: string
 *                               nama_poli:
 *                                 type: string
 *                           layananList:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id_pelayanan:
 *                                   type: string
 *                                 nama_pelayanan:
 *                                   type: string
 *                                 jadwal:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       hari:
 *                                         type: string
 *                                       sesi:
 *                                         type: string
 *                                       jam_mulai:
 *                                         type: string
 *                                       jam_selesai:
 *                                         type: string
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

route.get("/seacrh/dokter", JadwalDokterController.searchJadwalByNameDokter);

/**
 * @swagger
 * api/v1/jadwal-dokter/{id_dokter}:
 *   get:
 *     summary: Mendapatkan jadwal dokter berdasarkan ID
 *     description: Endpoint ini digunakan untuk mengambil jadwal dokter berdasarkan ID dokter, beserta informasi dokter, dan daftar layanan yang terkait dengan hari dan jam praktiknya.
 *     tags:
 *       - Jadwal Dokter
 *     parameters:
 *       - in: path
 *         name: id_dokter
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unik dokter yang jadwalnya ingin diambil.
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail jadwal dokter
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
 *                   example: "Berhasil menampilkan detail jadwal dokter"
 *                 data:
 *                   type: object
 *                   properties:
 *                     dokter:
 *                       type: object
 *                       properties:
 *                         id_dokter:
 *                           type: string
 *                         nama_dokter:
 *                           type: string
 *                         gambar_dokter:
 *                           type: string
 *                           example: "https://example.com/image.jpg"
 *                         poli:
 *                           type: object
 *                           properties:
 *                             id_poli:
 *                               type: string
 *                             nama_poli:
 *                               type: string
 *                         layananList:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id_pelayanan:
 *                                 type: string
 *                               nama_pelayanan:
 *                                 type: string
 *                               jadwal:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     hari:
 *                                       type: string
 *                                     sesi:
 *                                       type: string
 *                                     jam_mulai:
 *                                       type: string
 *                                     jam_selesai:
 *                                       type: string
 *       404:
 *         description: Dokter dengan ID yang diberikan tidak ditemukan
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
 *                   example: "Dokter dengan ID {id_dokter} tidak ditemukan"
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
route.get("/:id_dokter", JadwalDokterController.getByIdJadwalDokter);

/**
 * @swagger
 * api/v1/jadwal-dokter:
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
 *                           nama_dokter:
 *                             type: string
 *                           gambar_dokter:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           poli:
 *                             type: object
 *                             properties:
 *                               id_poli:
 *                                 type: string
 *                               nama_poli:
 *                                 type: string
 *                           layananList:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id_pelayanan:
 *                                   type: string
 *                                 nama_pelayanan:
 *                                   type: string
 *                                 jadwal:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       hari:
 *                                         type: string
 *                                       sesi:
 *                                         type: string
 *                                       jam_mulai:
 *                                         type: string
 *                                       jam_selesai:
 *                                         type: string
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
 * api/v1/jadwal-dokter:
 *   post:
 *     summary: Menambahkan jadwal dokter baru
 *     description: Endpoint ini digunakan untuk menambahkan jadwal dokter berdasarkan daftar layanan dan jadwal hari yang dikirim dalam request.
 *     tags:
 *       - Jadwal Dokter
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
route.post(
  "/",
  auth,
  authorizeRole("ADMIN"),
  JadwalDokterController.createJadwalDokter
);

/**
 * @swagger
 * api/v1/jadwal-dokter/{id_dokter}:
 *   put:
 *     summary: Memperbarui seluruh jadwal dokter
 *     description: Endpoint ini digunakan untuk memperbarui seluruh jadwal dokter berdasarkan ID dokter. Semua jadwal lama akan dihapus dan digantikan dengan data baru.
 *     tags:
 *       - Jadwal Dokter
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
 *       404-pelayanan:
 *         description: pelayanan tidak ditemukan.
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
 *                   example: "Pelayanan dengan ID ${id_pelayanan} tidak ditemukan."
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
route.put(
  "/:id_dokter",
  auth,
  authorizeRole("ADMIN"),
  JadwalDokterController.updateJadwalDokter
);

/**
 * @swagger
 * api/v1/jadwal-dokter/{id_dokter}:
 *   delete:
 *     summary: Hapus semua jadwal berdasarkan ID dokter
 *     description: Endpoint ini digunakan untuk menghapus seluruh jadwal dokter berdasarkan ID dokter.
 *     tags:
 *       - Jadwal Dokter
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
  authorizeRole("ADMIN"),
  JadwalDokterController.deleteJadwalDokterByDokterId
);

module.exports = route;
