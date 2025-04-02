const route = require("express").Router();
const galeriBeritaCotroller = require("../controllers/galeri-controller");
const { auth } = require("../middlewares/auth-middleware");
const multer = require("../middlewares/multer-middleware");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");

/**
 * @swagger
 * /galeri-berita:
 *   delete:
 *     summary: Hapus gambar
 *     description: Menghapus satu atau lebih gambar berdasarkan ID yang diberikan. Gambar yang berhasil dihapus akan dikembalikan bersama dengan ID dan nama file-nya.
 *     tags:
 *       - Galeri Berita
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
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "Success"
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
 *       404:
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
route.delete("/", galeriBeritaCotroller.deleteGambar);

/**
 * @swagger
 * /galeri-berita/{id}:
 *   post:
 *     summary: Mengunggah gambar tambahan untuk berita
 *     description: Endpoint ini digunakan untuk mengunggah hingga 4 gambar tambahan terkait suatu berita. Jika lebih dari 4 gambar diunggah, akan muncul kesalahan.
 *     tags:
 *       - Galeri Berita
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
  "/:id",
  multer.array("gambar_tambahan"),
  multerErrorHandler,
  galeriBeritaCotroller.uploadGambar
);

/**
 * @swagger
 * /galeri-berita/{id}:
 *   get:
 *     summary: Mendapatkan daftar gambar berdasarkan ID berita
 *     description: Endpoint ini digunakan untuk mengambil semua gambar yang terkait dengan berita tertentu berdasarkan ID berita. Jika tidak ada gambar, akan mengembalikan pesan bahwa galeri kosong.
 *     tags:
 *       - Galeri Berita
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
 *                       id:
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
route.get("/:id", galeriBeritaCotroller.getGambarByBerita);

module.exports = route;
