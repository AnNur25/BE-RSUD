const route = require("express").Router();
const bannerController = require("../controllers/banner-controller");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
const multer = require("../middlewares/multer-middleware");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /api/v1/banner:
 *   post:
 *     summary: Mengunggah banner baru
 *     description: Endpoint untuk mengunggah satu atau lebih gambar banner. Maksimal 4 banner dapat diunggah sekaligus.
 *     tags:
 *       - Banner
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               banner:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: File gambar banner yang diunggah
 *     responses:
 *       "201":
 *         description: Banner berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_banner:
 *                     type: string
 *                     example: "1"
 *                   gambar:
 *                     type: string
 *                     example: "https://example.com/banner1.jpg"
 *       "400":
 *         description: Request tidak valid (Tidak ada file yang diunggah atau melebihi batas maksimal banner)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Maksimal 4 banner. Saat ini sudah ada 4 banner."
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.post(
  "/",
  auth,
  multer.array("banner"),
  multerErrorHandler,
  bannerController.createBanner
);

/**
 * @swagger
 * /api/v1/banner:
 *   get:
 *     summary: Mendapatkan daftar banner
 *     description: Endpoint untuk mendapatkan daftar banner yang tersedia.
 *     tags:
 *       - Banner
 *     responses:
 *       "200":
 *         description: Daftar banner berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_banner:
 *                     type: string
 *                     example: "1"
 *                   gambar:
 *                     type: string
 *                     example: "https://example.com/banner1.jpg"
 *       "404":
 *         description: Tidak ada banner yang ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ops! daftar banner kosong"
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.get("/", bannerController.getBanner);

/**
 * @swagger
 * /api/v1/banner:
 *   delete:
 *     summary: Menghapus banner
 *     description: Endpoint untuk menghapus banner berdasarkan ID yang diberikan.
 *     tags:
 *       - Banner
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
 *                 example: ["1", "2"]
 *     responses:
 *       "200":
 *         description: Banner berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "2 banner berhasil dihapus."
 *       "400":
 *         description: ID banner yang akan dihapus tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID banner yang akan dihapus tidak ditemukan"
 *       "404":
 *         description: Beberapa ID banner tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Banner dengan ID berikut tidak ditemukan: 3, 4"
 *       "500":
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
route.delete("/", auth, bannerController.deleteBanner);

module.exports = route;
