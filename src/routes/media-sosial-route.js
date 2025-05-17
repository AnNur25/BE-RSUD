const express = require("express");
const route = express.Router();
const mediaSosial = require("../controllers/media-sosial-controller");
const { auth, authorizeRole } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /api/v1/media-sosial:
 *   get:
 *     summary: Mendapatkan daftar link Instagram media sosial
 *     description: Mengambil semua link Instagram yang tersimpan untuk media sosial.
 *     tags:
 *       - Media Sosial / Embed IG
 *     responses:
 *       200:
 *         description: Berhasil menampilkan embed Instagram media sosial
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
 *                   example: berhasil menampilkan embed ig
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_embed:
 *                         type: string
 *                         example: "c12345a6-b789-4d12-9f34-56a7890bc123"
 *                       link_embed:
 *                         type: string
 *                         example: "https://www.instagram.com/namaakun/"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-17T08:00:00Z"
 *       404:
 *         description: Data tidak ditemukan atau kosong
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
 *                   example: data tidak ada / kosong
 *       500:
 *         description: Kesalahan server internal
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
 *                   example: Internal Server Error
 */
route.get("/", mediaSosial.getMediaSosial);

/**
 * @swagger
 * /api/v1/media-sosial:
 *   put:
 *     summary: Memperbarui link Instagram media sosial
 *     description: Memperbarui maksimal 4 link Instagram untuk embed di media sosial. Hanya dapat diakses oleh user dengan role ADMIN.
 *     tags:
 *       - Media Sosial / Embed IG
 *     requestBody:
 *       description: Daftar link Instagram yang valid (max 4 link)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - links
 *             properties:
 *               links:
 *                 type: array
 *                 description: Array berisi link Instagram yang valid, maksimal 4 link.
 *                 items:
 *                   type: string
 *                   example: "https://www.instagram.com/namaakun/"
 *     responses:
 *       200:
 *         description: Berhasil memperbarui link Instagram media sosial
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
 *                   example: berhasil memperbarui
 *                 data:
 *                   type: array
 *                   description: Data embed Instagram terbaru setelah update
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_embed:
 *                         type: string
 *                         example: "c12345a6-b789-4d12-9f34-56a7890bc123"
 *                       link_embed:
 *                         type: string
 *                         example: "https://www.instagram.com/namaakun/"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-17T08:00:00Z"
 *       400:
 *         description: Bad request, link tidak valid atau jumlah link lebih dari 4
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
 *                   example: link tidak valid / Maksimal 4 link yang diperbolehkan
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
 */
route.put("/", auth, authorizeRole("ADMIN"), mediaSosial.updateMediaSosial);

module.exports = route;
