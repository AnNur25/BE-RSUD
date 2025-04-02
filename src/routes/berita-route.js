const route = require("express").Router();
const beritaController = require("../controllers/berita-controller");
const { auth } = require("../middlewares/auth-middleware");
const multer = require("../middlewares/multer-middleware");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");

/**
 * @swagger
 * /berita:
 *   post:
 *     summary: Membuat berita baru
 *     description: Endpoint ini digunakan untuk membuat berita baru beserta gambar sampul.
 *     tags:
 *       - Berita
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *                 example: "BANYAK WABAH YANG MENJANGKIT ANAK BERUSIA 12 TAHUN"
 *               ringkasan:
 *                 type: string
 *                 example: "Wabah penyakit yang menyerang anak-anak usia 12 tahun semakin meningkat, memerlukan perhatian serius dari masyarakat dan pemerintah."
 *               isi:
 *                 type: string
 *                 example: "Dalam beberapa bulan terakhir, telah terjadi peningkatan signifikan dalam jumlah kasus penyakit yang menyerang anak-anak usia 12 tahun. Para ahli kesehatan menyarankan agar orang tua lebih waspada terhadap gejala awal dan segera mencari bantuan medis jika diperlukan. Pemerintah juga diharapkan untuk meningkatkan kampanye kesadaran dan menyediakan fasilitas kesehatan yang memadai."
 *               tanggal_terbit:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-23"
 *               gambar_sampul:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Berita berhasil dibuat.
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
 *                   example: "Berita berhasil dibuat"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     judul:
 *                       type: string
 *                       example: "BANYAK WABAH YANG MENJANGKIT ANAK BERUSIA 12 TAHUN"
 *                     tanggal_terbit:
 *                       type: string
 *                       example: "23 Maret 2025"
 *                     dibuat_pada_tanggal:
 *                       type: string
 *                       example: "25 Maret 2025"
 *                     gambar_sampul:
 *                       type: string
 *                       example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *       "400":
 *         description: Permintaan tidak valid.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 400
 *                     status:
 *                       type: string
 *                       example: "Failed"
 *                     message:
 *                       type: string
 *                       example: "File is required"
 *                 - type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 400
 *                     status:
 *                       type: string
 *                       example: "Failed"
 *                     message:
 *                       type: string
 *                       example: "Invalid date format (YYYY-MM-DD)"
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
route.post("/", multer.single("gambar_sampul"), beritaController.createBerita);

/**
 * @swagger
 * /berita:
 *   get:
 *     summary: Mendapatkan daftar berita dengan pagination
 *     description: Endpoint ini digunakan untuk mengambil daftar berita dengan pagination. Data dapat difilter menggunakan query parameter `page` dan `pageSize`.
 *     tags:
 *       - Berita
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
 *         description: Jumlah berita yang ditampilkan per halaman.
 *     responses:
 *       "200":
 *         description: Berhasil menampilkan daftar berita dengan pagination.
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
 *                   example: "Berhasil menampilkan berita"
 *                 data:
 *                   type: object
 *                   properties:
 *                     berita:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           judul:
 *                             type: string
 *                             example: "Judul Berita Contoh"
 *                           ringkasan:
 *                             type: string
 *                             example: "Ringkasan berita singkat."
 *                           gambar_sampul:
 *                             type: string
 *                             example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *                           tanggal_terbit:
 *                             type: string
 *                             example: "23 Maret 2025"
 *                           dibuat_pada_tanggal:
 *                             type: string
 *                             example: "20 Maret 2025"
 *                           diupdate_pada_tanggal:
 *                             type: string
 *                             example: "22 Maret 2025"
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
 *       "400":
 *         description: Tidak ada berita yang tersedia.
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
 *                   example: "Oops! Tidak ada berita yang tersedia saat ini"
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
route.get("/", beritaController.getBerita);

/**
 * @swagger
 * /berita/{id_berita}:
 *   get:
 *     summary: Mendapatkan detail berita berdasarkan ID
 *     description: Endpoint ini digunakan untuk mengambil detail berita berdasarkan ID yang diberikan.
 *     tags:
 *       - Berita
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         schema:
 *           type: string
 *         description: ID berita yang ingin diambil detailnya
 *     responses:
 *       "200":
 *         description: Berhasil menampilkan detail berita.
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
 *                   example: "berhasil menampilkan detail berita"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     judul:
 *                       type: string
 *                       example: "Judul Berita Contoh"
 *                     ringkasan:
 *                       type: string
 *                       example: "Ringkasan berita singkat."
 *                     isi:
 *                       type: string
 *                       example: "Isi lengkap dari berita ini."
 *                     gambar_sampul:
 *                       type: string
 *                       example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *                     tanggal_terbit:
 *                       type: string
 *                       example: "23 Maret 2025"
 *                     dibuat_pada:
 *                       type: string
 *                       example: "23 Maret 2025, 14:30"
 *                     gambar_tambahan:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your-folder/image1.jpg"
 *       "404":
 *         description: Berita tidak ditemukan.
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
 *                   example: "Oops! detail berita tidak ditemukan"
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
route.get("/:id_berita", beritaController.getBeritaById);

/**
 * @swagger
 * /berita/{id_berita}:
 *   put:
 *     summary: Memperbarui berita
 *     description: Endpoint ini digunakan untuk memperbarui berita yang sudah ada berdasarkan ID berita.
 *     tags:
 *       - Berita
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         schema:
 *           type: string
 *         description: ID berita yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *                 example: "Judul Berita Baru"
 *               ringkasan:
 *                 type: string
 *                 example: "Ringkasan berita yang diperbarui..."
 *               isi:
 *                 type: string
 *                 example: "Isi berita yang diperbarui..."
 *               tanggal_terbit:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-23"
 *               gambar_sampul:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: Berita berhasil diperbarui.
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
 *                   example: "Berita berhasil diperbarui"
 *                 berita:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "kokng89"
 *                     judul:
 *                       type: string
 *                       example: "Judul Berita Baru"
 *                     tanggal_terbit:
 *                       type: string
 *                       example: "23 Maret 2025"
 *                     updateAt:
 *                       type: string
 *                       example: "23 Maret 2025"
 *       "400":
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
 *                   example: "Invalid date format. Use YYYY-MM-DD"
 *       "404":
 *         description: Berita tidak ditemukan.
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
 *                   example: "Berita not found"
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
 */
route.put(
  "/:id_berita",
  multer.single("gambar_sampul"),
  beritaController.updateBerita
);

/**
 * @swagger
 * /berita/{id_berita}:
 *   delete:
 *     summary: Menghapus berita berdasarkan ID
 *     description: Endpoint ini digunakan untuk menghapus berita berdasarkan ID yang diberikan.
 *     tags:
 *       - Berita
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         schema:
 *           type: string
 *         description: ID berita yang akan dihapus
 *     responses:
 *       "200":
 *         description: Berita berhasil dihapus.
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
 *                   example: "Berita berhasil dihapus"
 *       "404":
 *         description: Berita tidak ditemukan.
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
 *                   example: "Berita tidak ditemukan"
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
route.delete("/:id_berita", beritaController.deleteBerita);

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
