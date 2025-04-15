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
 *     security:
 *       - bearerAuth: []
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
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
 *                     tanggal_dibuat:
 *                       type: string
 *                       example: "25 Maret 2025"
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
 *                   example: "Semua field harus diisi"
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
route.post(
  "/",
  auth,
  multerErrorHandler,
  multer.single("gambar_sampul"),
  beritaController.createBerita
);

/**
 * @swagger
 * /berita/search:
 *   get:
 *     summary: Mencari berita berdasarkan kata kunci
 *     description: Endpoint ini digunakan untuk mencari berita berdasarkan judul. Pencarian bersifat case-insensitive.
 *     tags:
 *       - Berita
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: Kata kunci untuk mencari berita. Harus diisi.
 *         schema:
 *           type: string
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
 *           default: 9
 *         description: Jumlah berita yang ditampilkan per halaman.
 *     responses:
 *       "200":
 *         description: Berhasil menampilkan berita
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
 *                           isi:
 *                             type: string
 *                             example: "lorem ipsum dolor sit amet..."
 *                           gambar_sampul:
 *                             type: string
 *                             example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *                           tanggal_dibuat:
 *                             type: string
 *                             example: "20 Maret 2025"
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
 *         description: Keyword pencarian diperlukan.
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
 *                   example: "Keyword pencarian diperlukan tersedia saat ini"
 *       "404":
 *         description: data berita tidak ditemukan
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
 *                   example: "Berita dengan keyword tersebut tidak ditemukan"
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
route.get("/search", beritaController.searchBerita);

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
 *           default: 9
 *         description: Jumlah berita yang ditampilkan per halaman.
 *     responses:
 *       "200":
 *         description: Berhasil menampilkan daftar berita dengan pagination.
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
 *                           isi:
 *                             type: string
 *                             example: "lorem ipsum dolor sit amet..."
 *                           gambar_sampul:
 *                             type: string
 *                             example: "https://ik.imagekit.io/your-folder/sample-cover.jpg"
 *                           tanggal_dibuat:
 *                             type: string
 *                             example: "20 Maret 2025"
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
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Oops! Tidak ada berita yang tersedia saat ini"
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
route.get("/", beritaController.getBerita);

/**
 * @swagger
 * /berita/{id}:
 *   get:
 *     summary: Mendapatkan detail berita berdasarkan ID
 *     description: Endpoint ini digunakan untuk mengambil detail berita berdasarkan ID yang diberikan.
 *     tags:
 *       - Berita
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
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
 *                     dibuat_pada:
 *                       type: string
 *                       example: "23 Maret 2025, 14:30"
 *                     gambar_tambahan:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your-folder/image1.jpg"
 *       "400":
 *         description: ID berita tidak ditemukan.
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
 *                   example: "Id berita tidak ditemukan"
 *       "404":
 *         description: Berita tidak ditemukan.
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
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Oops! detail berita tidak ditemukan"
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
route.get("/:id", beritaController.getBeritaById);

/**
 * @swagger
 * /berita/{id}:
 *   put:
 *     summary: Memperbarui berita
 *     description: Endpoint ini digunakan untuk memperbarui berita yang sudah ada berdasarkan ID berita.
 *     tags:
 *       - Berita
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
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
 *                     tanggal_dibuat:
 *                       type: string
 *                       example: "23 Maret 2025"
 *       "400":
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
 *                   example: "Semua field harus diisi"
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
 *       "404":
 *         description: Berita tidak ditemukan.
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
 *                   example: "id berita tidak ditemukan"
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
  "/:id",
  auth,
  multerErrorHandler,
  multer.single("gambar_sampul"),
  beritaController.updateBerita
);

/**
 * @swagger
 * /berita/{id}:
 *   delete:
 *     summary: Menghapus berita berdasarkan ID
 *     description: Endpoint ini digunakan untuk menghapus berita berdasarkan ID yang diberikan.
 *     tags:
 *       - Berita
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Berita berhasil dihapus"
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
 *       "404":
 *         description: Berita tidak ditemukan.
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
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Id Berita tidak ditemukan"
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
route.delete("/:id", auth, beritaController.deleteBerita);

/**
 * @swagger
 * /berita/{id}/galeri-berita:
 *   get:
 *     summary: Mendapatkan daftar gambar berdasarkan ID berita
 *     description: Endpoint ini digunakan untuk mengambil semua gambar yang terkait dengan berita tertentu berdasarkan ID berita.
 *     tags:
 *       - Berita
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID berita yang gambarnya ingin diambil
 *         example: "b20ab68f-be3e-4437-aff6-3d84a684f30b"
 *     responses:
 *       "200":
 *         description: Gambar berhasil ditemukan.
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
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "Gambar berhasil ditemukan"
 *                 gambar:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       url:
 *                         type: string
 *                         example: "https://ik.imagekit.io/your-folder/sample-image.jpg"
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
 *       "404":
 *         description: Tidak ada gambar untuk berita ini.
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
 *                   example: "Tidak ada gambar untuk berita ini"
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
route.get("/:id/galeri-berita", auth, beritaController.getGaleriBerita);

/**
 * @swagger
 * /berita/{id}/galeri-berita:
 *   delete:
 *     summary: Hapus satu atau lebih gambar dari galeri berita
 *     description: Menghapus gambar-gambar yang terkait dengan sebuah berita berdasarkan ID berita (`id`) dan array ID gambar (`ids`) yang diberikan.
 *     tags:
 *       - Berita
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari berita yang memiliki galeri gambar
 *         schema:
 *           type: string
 *           example: orgjeo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array ID gambar yang akan dihapus
 *                 example: ["123e4567-e89b-12d3-a456-426614174000", "987e6543-b21c-45d8-c789-123456789012"]
 *     responses:
 *       200:
 *         description: Berhasil menghapus gambar
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
 *                   example: "Gambar berhasil dihapus"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       fileName:
 *                         type: string
 *                         example: "gambar1.png"
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
 *         description: Gambar tidak ditemukan.
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
 *                   example: "Gambar tidak ditemukan"
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
route.delete("/:id/galeri-berita", auth, beritaController.deleteGambar);

/**
 * @swagger
 * /berita/{id}/galeri-berita:
 *   post:
 *     summary: Mengunggah gambar tambahan untuk berita
 *     description: Endpoint ini digunakan untuk mengunggah hingga 4 gambar tambahan terkait suatu berita. Jika lebih dari 4 gambar diunggah, akan muncul kesalahan.
 *     tags:
 *       - Berita
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
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
 *       "400":
 *         description: Kesalahan dalam input gambar.
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
 *                   example: "No files uploaded"
 *       "400_Overimage":
 *         description: Terlalu banyak gambar yang diunggah.
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
 *                   example: "Maksimal 4 gambar diperbolehkan"
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
route.post(
  "/:id/galeri-berita",
  auth,
  multer.array("gambar_tambahan"),
  multerErrorHandler,
  beritaController.uploadGambar
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
