const express = require("express");
const Route = express.Router();
const dokterController = require("../controllers/dokter-controller");
const multerConfig = require("../middlewares/multer-middleware");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
const { auth } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /dokter:
 *   post:
 *     summary: Menambahkan data dokter
 *     description: Endpoint untuk menambahkan dokter baru dengan informasi spesialisasi dan pelayanan dokter.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "dr. H. Agus Yudho Santoso, Sp.PD, Finasim ( AYS )"
 *               id_poli:
 *                 type: string
 *                 example: "ab592474-d37e-4b20-abcd-5230fca43d28"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Gambar dokter yang akan diunggah.
 *     responses:
 *       201:
 *         description: Dokter berhasil ditambahkan.
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
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Dokter berhasil ditambahkan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_dokter:
 *                       type: integer
 *                       example: 5
 *                     nama:
 *                       type: string
 *                       example: "Dr. Andi"
 *       400:
 *         description: Data tidak lengkap atau file tidak diunggah.
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
 *                   example: "Nama, id poli, dan file harus diisi"
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
Route.post(
  "/",
  auth,
  multerErrorHandler,
  multerConfig.single("file"),
  dokterController.createDokter
);

/**
 * @swagger
 * /dokter/search:
 *   get:
 *     summary: Mencari dokter berdasarkan kata kunci
 *     description: Endpoint ini digunakan untuk mencari dokter berdasarkan nama atau nama poli. Pencarian bersifat case-insensitive.
 *     tags:
 *       - Dokter
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: Kata kunci untuk mencari dokter. Harus diisi.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil menampilkan dokter
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nama:
 *                         type: string
 *                         example: "Dr. John Doe"
 *                       poli:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nama_poli:
 *                             type: string
 *                             example: "Pediatri"
 *                 message:
 *                   type: string
 *                   example: "berhasil menampilkan dokter"
 *       400:
 *         description: Permintaan tidak valid, kata kunci tidak boleh kosong
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
 *                   example: "Keyword pencarian harus diisi"
 *       404:
 *         description: Dokter tidak ditemukan berdasarkan kata kunci yang diberikan
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
 *                   example: "data dokter tidak tersedia"
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
Route.get("/search", dokterController.searchDokter);

/**
 * @swagger
 * /dokter:
 *   get:
 *     summary: Mendapatkan daftar dokter
 *     description: Endpoint ini digunakan untuk mengambil data semua dokter beserta spesialis dan jenis pelayanan yang mereka tawarkan.
 *     tags:
 *       - Dokter
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
 *           default: 15
 *         description: Jumlah Dokter yang ditampilkan per halaman.
 *     responses:
 *       200:
 *         description: Data dokter berhasil diambil.
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
 *                   example: "Data dokter berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_dokter:
 *                         type: integer
 *                         example: 1
 *                       nama:
 *                         type: string
 *                         example: "Dr. Andi"
 *                       kontak:
 *                         type: string
 *                         example: "081234567890"
 *                       gambar:
 *                         type: string
 *                         example: "https://ik.imagekit.io/ena3eh2k0/Screenshot_2025-03-18_144412_824nKFPqX.png"
 *                       spesialis:
 *                         type: object
 *                         properties:
 *                           nama_spesialis:
 *                             type: string
 *                             example: "spesialis baru 1"
 *                       pelayananDokter:
 *                         type: object
 *                         properties:
 *                           nama_pelayanan:
 *                             type: string
 *                             example: "Pelayanan Konsultasi"
 *       404:
 *         description: Data Dokter Kosong
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
 *                   example: "Data Dokter Kosong"
 *                 data:
 *                   type: array
 *                   example: []
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
Route.get("/", dokterController.getDokter);

/**
 * @swagger
 * /dokter/{id_dokter}:
 *   get:
 *     summary: Mendapatkan data dokter berdasarkan ID
 *     description: Endpoint ini digunakan untuk mengambil detail data seorang dokter berdasarkan ID, termasuk informasi poli.
 *     tags:
 *       - Dokter
 *     parameters:
 *       - in: path
 *         name: id_dokter
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari dokter yang ingin diambil.
 *     responses:
 *       200:
 *         description: Data dokter berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Berhasil mengambil data Dokter"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_dokter:
 *                       type: string
 *                       example: 3
 *                     nama:
 *                       type: string
 *                       example: "dr. Rina"
 *                     gambar:
 *                       type: string
 *                       example: "https://ik.imagekit.io/xxx/dr-rina.jpg"
 *                     id_poli:
 *                       type: string
 *                       example: 2
 *                     nama_poli:
 *                       type: string
 *                       example: "Dokter Umum"
 *       404:
 *         description: Dokter tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Dokter dengan ID 3 tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
Route.get("/:id_dokter", dokterController.getDokterById);

/**
 * @swagger
 * /dokter/{id_dokter}:
 *   put:
 *     summary: Memperbarui data dokter
 *     description: Mengupdate informasi dokter berdasarkan ID dokter yang diberikan.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_dokter
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dokter yang akan diperbarui.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Dr. Budi Santoso"
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: File gambar dokter yang akan diunggah.
 *               id_poli:
 *                 type: string
 *                 example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *     responses:
 *       200:
 *         description: Dokter berhasil diperbarui.
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
 *                   example: "Dokter berhasil diperbarui"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "2c4d37aa-a0b6-433f-8011-387733d626b5"
 *                     nama:
 *                       type: string
 *                       example: "Dr. Budi Santoso"
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
 *                   example: "ID Dokter, Nama, dan ID Poli harus diisi"
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
 *         description: Dokter atau Poli tidak ditemukan
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
 *                   example: "Dokter atau poli tidak ditemukan"
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
Route.put(
  "/:id_dokter",
  auth,
  multerErrorHandler,
  multerConfig.single("gambar"),
  dokterController.updateDokter
);

/**
 * @swagger
 * /dokter/{id_dokter}:
 *   delete:
 *     summary: Menghapus dokter berdasarkan ID
 *     description: Endpoint ini digunakan untuk menghapus dokter berdasarkan ID yang diberikan.
 *     tags:
 *       - Dokter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_dokter
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dokter yang akan dihapus.
 *     responses:
 *       200:
 *         description: Dokter berhasil dihapus.
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
 *                   example: "Dokter berhasil dihapus"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
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
 *                   example: "Dokter dengan ID 10 tidak ditemukan"
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
Route.delete(
  "/:id_dokter",
  auth,
  multerErrorHandler,
  dokterController.deleteDokter
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
module.exports = Route;
