const express = require("express");
const route = express.Router();
const komentarController = require("../controllers/komentar-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");
const optionalAuth = require("../middlewares/optional-auth");

/**
 * @swagger
 * /api/v1/berita/{id_berita}/komentar:
 *   post:
 *     summary: Menambahkan komentar pada berita
 *     description: Endpoint ini digunakan untuk menambahkan komentar ke dalam berita berdasarkan ID berita. Hanya pengguna dengan role ADMIN yang dapat mengakses endpoint ini.
 *     tags:
 *       - Komentar
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         description: ID berita yang akan dikomentari
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama pengirim komentar (opsional, default dari user login)
 *                 example: John Doe
 *               no_wa:
 *                 type: string
 *                 description: Nomor WhatsApp pengirim (opsional, default dari user login)
 *                 example: 081234567890
 *               isi_komentar:
 *                 type: string
 *                 description: Isi dari komentar yang dikirim
 *                 example: Artikel ini sangat membantu!
 *     responses:
 *       201:
 *         description: Komentar berhasil ditambahkan
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
 *                   example: berhasil menambah komentar
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_komentar:
 *                       type: integer
 *                       example: 1
 *                     nama:
 *                       type: string
 *                       example: John Doe
 *                     no_wa:
 *                       type: string
 *                       example: 081234567890
 *                     isi_komentar:
 *                       type: string
 *                       example: Artikel ini sangat membantu!
 *                     id_berita:
 *                       type: string
 *                       example: 123abc
 *       400:
 *         description: Field wajib tidak diisi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Semua field wajib di isi
 *       401:
 *         description: Tidak ada token atau token tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Role tidak diizinkan (bukan ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Forbidden - Role tidak diizinkan
 *       500:
 *         description: Kesalahan server internal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan pada server
 */
route.post(
  "/:id_berita/komentar",
  optionalAuth,
  komentarController.addKomentar
);

/**
 * @swagger
 * /api/v1/berita/{id}/komentar:
 *   get:
 *     summary: Mendapatkan daftar komentar berdasarkan berita
 *     description: Endpoint ini digunakan untuk mendapatkan semua komentar dan balasannya berdasarkan ID berita. Hanya dapat diakses oleh pengguna dengan role ADMIN.
 *     tags:
 *       - Komentar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID berita (UUID)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar komentar
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
 *                   example: Berhasil menampilkan list komentar
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_komentar:
 *                         type: string
 *                         format: uuid
 *                         example: e5d5d56b-6e6b-4689-b643-cbdd2f2ead28
 *                       nama:
 *                         type: string
 *                         example: adf
 *                       isi_komentar:
 *                         type: string
 *                         example: komentar user 2
 *                       isVisible:
 *                         type: boolean
 *                         example: true
 *                       tanggal_komentar:
 *                         type: string
 *                         example: 17 Mei 2025
 *                       replies:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_komentar:
 *                               type: string
 *                               format: uuid
 *                               example: 0914fd11-427c-4430-883f-85323d437a22
 *                             nama:
 *                               type: string
 *                               example: adf
 *                             isi_komentar:
 *                               type: string
 *                               example: komentar user 2
 *                             isVisible:
 *                               type: boolean
 *                               example: true
 *                             tanggal_komentar:
 *                               type: string
 *                               example: 17 Mei 2025
 *       401:
 *         description: Token tidak tersedia atau tidak valid
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
 *                   example: Unauthorized
 *       403:
 *         description: Role tidak diizinkan (bukan ADMIN)
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
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Forbidden - Role tidak diizinkan
 *       404:
 *         description: Tidak ada komentar ditemukan
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
 *                   example: Belum ada komentar.
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
 *                   example: Terjadi kesalahan pada server
 */
route.get(
  "/:id_berita/komentar",
  auth,
  authorizeRole("ADMIN"),
  komentarController.listKomentar
);

/**
 * @swagger
 * /api/v1/berita/{id}/komentar/visible:
 *   get:
 *     summary: Berhasil menampilkan list komentar visible
 *     description: Endpoint ini digunakan untuk mendapatkan semua komentar dan balasannya berdasarkan ID berita
 *     tags:
 *       - Komentar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID berita (UUID)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar komentar
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
 *                   example: Berhasil menampilkan list komentar visible
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_komentar:
 *                         type: string
 *                         format: uuid
 *                         example: e5d5d56b-6e6b-4689-b643-cbdd2f2ead28
 *                       nama:
 *                         type: string
 *                         example: adf
 *                       isi_komentar:
 *                         type: string
 *                         example: komentar user 2
 *                       isVisible:
 *                         type: boolean
 *                         example: true
 *                       tanggal_komentar:
 *                         type: string
 *                         example: 17 Mei 2025
 *                       replies:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_komentar:
 *                               type: string
 *                               format: uuid
 *                               example: 0914fd11-427c-4430-883f-85323d437a22
 *                             nama:
 *                               type: string
 *                               example: adf
 *                             isi_komentar:
 *                               type: string
 *                               example: komentar user 2
 *                             isVisible:
 *                               type: boolean
 *                               example: true
 *                             tanggal_komentar:
 *                               type: string
 *                               example: 17 Mei 2025
 *       401:
 *         description: Token tidak tersedia atau tidak valid
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
 *                   example: Unauthorized
 *       403:
 *         description: Role tidak diizinkan (bukan ADMIN)
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
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Forbidden - Role tidak diizinkan
 *       404:
 *         description: Tidak ada komentar ditemukan
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
 *                   example: Belum ada komentar.
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
 *                   example: Terjadi kesalahan pada server
 */
route.get(
  "/:id_berita/komentar/visible",
  komentarController.listKomentarVisible
);

/**
 * @swagger
 * /api/v1/{id}/komentar/{id_komentar}:
 *   patch:
 *     summary: Toggle status visible komentar
 *     description: Mengubah status `isVisible` komentar menjadi aktif atau nonaktif berdasarkan `id_komentar`. Hanya dapat diakses oleh pengguna dengan role ADMIN.
 *     tags:
 *       - Komentar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID berita (UUID)
 *         schema:
 *           type: string
 *       - in: path
 *         name: id_komentar
 *         required: true
 *         description: ID komentar yang ingin diubah status visible-nya (UUID)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status komentar berhasil diubah
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
 *                   example: Komentar berhasil diaktifkan.
 *       400:
 *         description: ID komentar tidak diberikan atau salah
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
 *                   example: Id komentar di perlukan
 *       401:
 *         description: Token tidak tersedia atau tidak valid
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
 *                   example: Unauthorized
 *       403:
 *         description: Role tidak diizinkan (bukan ADMIN)
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
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Forbidden - Role tidak diizinkan
 *       404:
 *         description: Data komentar tidak ditemukan
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
 *                   example: Data komentar kosong nih
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
 *                   example: Terjadi kesalahan pada server
 */
route.patch(
  "/:id/komentar/:id_komentar",
  auth,
  authorizeRole("ADMIN"),
  komentarController.isVisibleKomentar
);

/**
 * @swagger
 * /api/v1/{id_berita}/komentar/{id_komentar}/reply:
 *   post:
 *     summary: Membalas komentar pada berita
 *     description: Membuat balasan komentar pada komentar induk tertentu di berita. Hanya dapat diakses oleh user dengan role ADMIN atau USER.
 *     tags:
 *       - Komentar
 *     parameters:
 *       - in: path
 *         name: id_berita
 *         required: true
 *         description: ID berita tempat komentar berada (UUID string)
 *         schema:
 *           type: string
 *       - in: path
 *         name: id_komentar
 *         required: true
 *         description: ID komentar induk yang akan dibalas (UUID string)
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Data balasan komentar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isi_komentar
 *               - nama
 *               - no_wa
 *             properties:
 *               isi_komentar:
 *                 type: string
 *                 description: Isi balasan komentar
 *                 example: "Terima kasih atas informasinya!"
 *               nama:
 *                 type: string
 *                 description: Nama pengirim komentar (jika tidak login, wajib diisi)
 *                 example: "Budi"
 *               no_wa:
 *                 type: string
 *                 description: Nomor WhatsApp pengirim komentar (jika tidak login, wajib diisi)
 *                 example: "081234567890"
 *     responses:
 *       201:
 *         description: Balasan komentar berhasil dibuat
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
 *                   example: Berhasil membalas komentar.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_komentar:
 *                       type: string
 *                       example: "d4e3f2a1-56b7-4c9a-bcda-123456789abc"
 *                     isi_komentar:
 *                       type: string
 *                       example: "Terima kasih atas informasinya!"
 *                     nama:
 *                       type: string
 *                       example: "Budi"
 *                     no_wa:
 *                       type: string
 *                       example: "081234567890"
 *                     isVisible:
 *                       type: boolean
 *                       example: true
 *                     parentId:
 *                       type: string
 *                       example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     berita_id:
 *                       type: string
 *                       example: "b1c2d3e4-f5a6-7890-bcde-fa1234567890"
 *       400:
 *         description: Bad request, parameter atau body tidak lengkap atau tidak valid
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
 *                   example: Berita ID, komentar ID, dan isi komentar wajib diisi
 *       401:
 *         description: Unauthorized, token tidak valid atau tidak disediakan
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
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden, role user tidak diizinkan
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
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Forbidden - Role tidak diizinkan
 *       404:
 *         description: Komentar induk atau berita tidak ditemukan
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
 *                   example: Komentar induk tidak ditemukan
 */
route.post(
  "/:id_berita/komentar/:id_komentar/reply",
  auth,
  authorizeRole("ADMIN", "USER"),
  komentarController.replayKomentar
);

// route.delete("/:id/:id_komentar", auth, komentarController.deleteKomentar);

module.exports = route;
