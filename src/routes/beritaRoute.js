const express = require("express");
const route = express.Router();
const beritaController = require("../controllers/beritaController");
const gambarCotroller = require("../controllers/gambarController");
const { auth } = require("../middlewares/authMiddleware");
const multer = require("../middlewares/multerConfig");
const multerErrorHandler = require("../middlewares/multerErrorHandler");

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
 *                 example: "BANYAK WABAH YANG MENJAKIT ANAK BERUSIA 12 THN"
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
 *                       example: "Judul Berita"
 *                     gambar_sampul:
 *                       type: string
 *                       example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *                     tanggal_terbit:
 *                       type: string
 *                       format: date
 *                       example: "2025-03-23"
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
 *                       example: "No file uploaded"
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
 *                       example: "Invalid date format. Use YYYY-MM-DD"
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
 *                             format: date
 *                             example: "23 Maret 2025"
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
 *     summary: Mendapatkan daftar berita berdasarkan id
 *     description: Endpoint ini digunakan untuk mengambil detail berita yang tersedia.
 *     tags:
 *       - Berita
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         schema:
 *           type: string
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
 *                   example: "berhasil menampilkan berita"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_berita:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       judul:
 *                         type: string
 *                         example: "Judul Berita Contoh"
 *                       ringkasan:
 *                         type: string
 *                         example: "Ringkasan berita singkat."
 *                       isi:
 *                         type: string
 *                         example: "Isi lengkap dari berita ini."
 *                       gambar_sampul:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *                       waktu:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-23T14:30:00Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                           nama:
 *                             type: string
 *                             example: "John Doe"
 *                       gambar_tambahan:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "987e6543-e89b-12d3-a456-426614174000"
 *                             url:
 *                               type: string
 *                               example: "https://ik.imagekit.io/your-folder/image1.jpg"
 *                             beritaId:
 *                               type: string
 *                               example: "123e4567-e89b-12d3-a456-426614174000"
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
 *                     id_berita:
 *                       type: string
 *                       example: "kokng89"
 *                     judul:
 *                       type: string
 *                       example: "Judul Berita Baru"
 *                     ringkasan:
 *                       type: string
 *                       example: "Ringkasan berita yang diperbarui..."
 *                     isi:
 *                       type: string
 *                       example: "Isi berita yang diperbarui..."
 *                     gambar_sampul:
 *                       type: string
 *                       example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *                     tanggal_terbit:
 *                       type: string
 *                       format: date
 *                       example: "2025-03-23"
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
 *                       example: "Invalid date format. Use YYYY-MM-DD"
 *       "401":
 *         description: Unauthorized - User ID tidak ditemukan.
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
 *                   example: "Unauthorized: User ID not found"
 *       "403":
 *         description: Forbidden - Tidak memiliki izin untuk memperbarui berita ini.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You do not have permission to update this berita"
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
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
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
 * /berita/gambar/{id}:
 *   post:
 *     summary: Mengunggah gambar tambahan untuk berita
 *     description: Endpoint ini digunakan untuk mengunggah hingga 4 gambar tambahan terkait suatu berita.
 *     tags:
 *       - Gambar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         schema:
 *           type: string
 *         description: ID berita yang akan ditambahkan gambarnya
 *         example: "b20ab68f-be3e-4437-aff6-3d84a684f30b"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gambar_tambahan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Maksimal 4 gambar yang diunggah
 *     responses:
 *       "201":
 *         description: Gambar berhasil diunggah.
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
 *                   example: "Gambar tambahan berhasil diunggah"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your-folder/image1.jpg"
 *                       beritaId:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       id_user:
 *                         type: string
 *                         example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *       "400":
 *         description: Kesalahan dalam input gambar.
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
 *                   example: "No files uploaded"
 *       "400_Overimage":
 *         description: Terlalu banyak gambar yang diunggah.
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
 *                   example: "Maksimal 4 gambar diperbolehkan"
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
route.post(
  "/gambar/:id",
  auth,
  multer.array("gambar_tambahan"),
  multerErrorHandler,
  gambarCotroller.uploadGambar
);

/**
 * @swagger
 * /berita/gambar/{id}:
 *   get:
 *     summary: Mendapatkan daftar gambar berdasarkan ID berita
 *     description: Endpoint ini digunakan untuk mengambil semua gambar yang terkait dengan berita tertentu berdasarkan ID berita.
 *     tags:
 *       - Gambar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID berita yang gambarnya ingin diambil
 *     responses:
 *       "200":
 *         description: Gambar berhasil ditemukan.
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
 *                   example: "Gambar berhasil ditemukan"
 *                 gambar:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_gambar:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       url:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your-folder/sample-image.jpg"
 *       "404":
 *         description: Tidak ada gambar untuk berita ini.
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
 *                   example: "Tidak ada gambar untuk berita ini"
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
route.get("/gambar/:id", gambarCotroller.getGambarByBerita);

/**
 * @swagger
 * /berita/gambar/{id}:
 *   delete:
 *     summary: Hapus gambar
 *     description: Menghapus gambar berdasarkan ID yang diberikan.
 *     tags:
 *       - Gambar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID gambar yang akan dihapus
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       "200":
 *         description: Gambar berhasil dihapus.
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
 *                   example: "Gambar berhasil dihapus"
 *       "404":
 *         description: Gambar tidak ditemukan.
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
 *                   example: "Gambar tidak ditemukan"
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
route.delete("/gambar/:id", auth, gambarCotroller.deleteGambar);
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
