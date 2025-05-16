const express = require("express");
const route = express.Router();
const komentarController = require("../controllers/komentar-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /komentar/{id_berita}:
 *   post:
 *     summary: Memberikan komentar pada berita
 *     description: Endpoint untuk menambahkan komentar pengguna terhadap berita tertentu.
 *     tags:
 *       - Komentar
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari berita yang ingin dikomentari
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - no_wa
 *               - isi_komentar
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Andi"
 *               no_wa:
 *                 type: string
 *                 example: "081234567890"
 *               isi_komentar:
 *                 type: string
 *                 example: "Berita ini sangat bermanfaat, terima kasih!"
 *     responses:
 *       201:
 *         description: Komentar berhasil ditambahkan.
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
 *                   example: "berhasil memberikan komentar"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_komentar:
 *                       type: integer
 *                       example: 12
 *                     nama:
 *                       type: string
 *                       example: "Andi"
 *                     no_wa:
 *                       type: string
 *                       example: "081234567890"
 *                     isi_komentar:
 *                       type: string
 *                       example: "Berita ini sangat bermanfaat, terima kasih!"
 *                     id_berita:
 *                       type: string
 *                       example: "12fb8453-1111-4e4f-b3b2-abcdef123456"
 *       400:
 *         description: Permintaan tidak valid karena field tidak lengkap.
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
 *                   example: "Semua field wajib di isi"
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
  "/:id_berita/komentar",
  auth,
  authorizeRole("ADMIN"),
  komentarController.addKomentar
);

/**
 * @swagger
 * /komentar:
 *   get:
 *     summary: Menampilkan daftar komentar
 *     description: Menampilkan semua komentar utama beserta balasan-balasannya secara berurutan berdasarkan tanggal.
 *     tags:
 *       - Komentar
 *     responses:
 *       200:
 *         description: Daftar komentar berhasil ditampilkan.
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
 *                   example: "Berhasil menampilkan list komentar"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_komentar:
 *                         type: string
 *                         nullable: true
 *                         example: "8fe13ded-cad1-400e-b2a7-51a550f7c5b9"
 *                       nama:
 *                         type: string
 *                         nullable: true
 *                         example: "komentar 1"
 *                       isi_komentar:
 *                         type: string
 *                         nullable: true
 *                         example: "isi komentar 1"
 *                       tanggal_komentar:
 *                         type: string
 *                         nullable: true
 *                         example: "15 Mei 2025"
 *                       replies:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_komentar:
 *                               type: string
 *                               example: "741387d8-0c4b-41e6-882c-6573f819ad98"
 *                             nama:
 *                               type: string
 *                               example: "farid"
 *                             isi_komentar:
 *                               type: string
 *                               example: "Ini adalah balasan komentar saya"
 *                             tanggal_komentar:
 *                               type: string
 *                               example: "15 Mei 2025"
 *       404:
 *         description: Belum ada komentar.
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
 *                   example: "Belum ada komentar."
 *       500:
 *         description: Terjadi kesalahan pada server.
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
route.get(
  "/:id/komentar",
  authorizeRole("ADMIN"),
  komentarController.listKomentar
);

route.get("/:id/komentar/visible", komentarController.listKomentarVisible);
route.patch(
  "/:id/komentar/:id_komentar",
  auth,
  authorizeRole("ADMIN"),
  komentarController.isVisibleKomentar
);
route.post(
  "/:id_berita/komentar/:id_komentar/reply",
  auth,
  authorizeRole("ADMIN", "USER"),
  komentarController.replayKomentar
);

// route.delete("/:id/:id_komentar", auth, komentarController.deleteKomentar);

module.exports = route;
