const route = require("express").Router();
const layananUnggulan = require("../controllers/layanan-unggulan-controller");
const multerErrorHandler = require("../middlewares/multer-error-handling-middleware");
const multer = require("../middlewares/multer-middleware");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /api/v1/layanan-unggulan:
 *   get:
 *     summary: Ambil semua layanan unggulan
 *     tags:
 *       - Layanan Unggulan
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan semua layanan unggulan
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
 *                   example: "Berhasil mendapatkan semua layanan unggulan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_layanan_unggulan:
 *                       type: string
 *                       example: "a6e0b47b-21c2-4581-a1c9-79b74dea1639"
 *                     judul:
 *                       type: string
 *                       example: "rsud"
 *                     deskripsi:
 *                       type: string
 *                       example: "okoko"
 *                     gambarCaptions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "04b6f8f9-4abd-4bb0-a9c6-43959dc06cc0"
 *                           gambar:
 *                             type: string
 *                             example: "https://ik.imagekit.io/ena3eh2k0/Screenshot_2025-04-25_143202_KwOQUMi9O.png"
 *                           nama_file:
 *                             type: string
 *                             example: "Screenshot 2025-04-25 143202.png"
 *                           caption:
 *                             type: string
 *                             example: "Caption terbaru"
 *                           layananId:
 *                             type: string
 *                             example: "a6e0b47b-21c2-4581-a1c9-79b74dea1639"
 *       500:
 *         description: Terjadi kesalahan server
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
route.get("/", layananUnggulan.getAllLayananUnggulan);
/**
 * @swagger
 * /api/v1/layanan-unggulan/{id}:
 *   put:
 *     summary: Update layanan unggulan
 *     description: Update data layanan unggulan termasuk judul, deskripsi, upload gambar baru, update caption gambar yang sudah ada, dan menghapus gambar yang tidak dipertahankan.
 *     tags:
 *       - Layanan Unggulan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID layanan unggulan yang ingin diupdate
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - judul
 *               - deskripsi
 *               - existingImages
 *             properties:
 *               judul:
 *                 type: string
 *                 example: "Program Bedah Rumah Update"
 *               deskripsi:
 *                 type: string
 *                 example: "Update deskripsi program renovasi rumah."
 *               existingImages:
 *                 type: string
 *                 description: JSON string berisi daftar gambar yang masih dipertahankan beserta caption terbarunya.
 *                 example: '[{"id":"04b6f8f9-4abd-4bb0-a9c6-43959dc06cc0", "caption":"ok"}]'
 *               gambarCaption:
 *                 type: string
 *                 description: JSON string caption untuk gambar baru (jika ada file yang diupload)
 *                 example: '[{"caption":"Hasil akhir renovasi"}]'
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Gambar baru yang ingin ditambahkan (opsional, maksimal total gambar 4)
 *     responses:
 *       "200":
 *         description: Layanan Unggulan berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Layanan Unggulan berhasil diupdate."
 *       "400":
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Format existingImages tidak valid"
 *       "404":
 *         description: Layanan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Layanan tidak ditemukan"
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
route.put(
  "/:id",
  auth,
  authorizeRole("ADMIN"),
  multer.array("file"),
  multerErrorHandler,
  layananUnggulan.updateLayananUnggulan
);

module.exports = route;
