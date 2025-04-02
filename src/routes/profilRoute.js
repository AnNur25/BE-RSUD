const express = require("express");
const router = express.Router();
const profilController = require("../controllers/profilController");

const { auth } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /profil:
 *   get:
 *     summary: Mendapatkan informasi profil pengguna
 *     description: API ini digunakan untuk mengambil data profil pengguna yang sedang login.
 *     tags:
 *       - Profil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil berhasil diambil.
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
 *                   example: "Profile berhasil diambil."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: string
 *                       example: "bf27354f-6d82-4e25-9541-b9efc8bf57ed"
 *                     nama:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "binar@gmail.com"
 *       401:
 *         description: Unauthorized - Pengguna tidak memiliki izin.
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
 *                   example: "Unauthorized. Silakan login kembali."
 *                 data:
 *                   type: "null"
 *       404:
 *         description: User tidak ditemukan.
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
 *                   example: "User tidak ditemukan."
 *                 data:
 *                   type: "null"
 *       500:
 *         description: Terjadi kesalahan pada server.
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
 *                   example: "Detail error dari server."
 */
router.get("/profil", auth, profilController.getProfile);

/**
 * @swagger
 * /profil:
 *   put:
 *     summary: Mengubah password pengguna
 *     description: API ini digunakan untuk mengubah password pengguna yang sedang login.
 *     tags:
 *       - Profil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "passwordlama123"
 *               newPassword:
 *                 type: string
 *                 example: "passwordbaru123"
 *     responses:
 *       200:
 *         description: Password berhasil diubah.
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
 *                   example: "Password berhasil diubah."
 *                 data:
 *                   type: "null"
 *       400:
 *         description: Password lama salah atau password baru tidak valid.
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
 *                   example: "Password lama tidak valid."
 *                 data:
 *                   type: "null"
 *       401:
 *         description: Tidak terautentikasi.
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
 *                   example: "Tidak terautentikasi. Silakan login kembali."
 *                 data:
 *                   type: "null"
 *       500:
 *         description: Terjadi kesalahan pada server.
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
 *                   example: "Detail error dari server."
 */
router.put("/profil", auth, profilController.updatePassw);

/**
 * @swagger
 * /profil:
 *   post:
 *     summary: Mengirimkan link reset password ke email pengguna
 *     description: API ini digunakan untuk mengirimkan email berisi link reset password kepada pengguna yang telah terautentikasi.
 *     tags:
 *       - Profil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Link reset password berhasil dikirim ke email.
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
 *                   example: "Link reset password telah dikirim ke email."
 *                 data:
 *                   type: object
 *                   properties:
 *                     reset_link:
 *                       type: string
 *                       example: "https://frontend.example.com/reset?token=123abc"
 *                     resetToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1..."
 *       401:
 *         description: Tidak terautentikasi atau token tidak valid.
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
 *                   example: "Tidak terautentikasi. Silakan login kembali."
 *                 data:
 *                   type: "null"
 *       404:
 *         description: User tidak ditemukan.
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
 *                   example: "User tidak ditemukan."
 *                 data:
 *                   type: "null"
 *       500:
 *         description: Terjadi kesalahan pada server.
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
 *                   example: "Detail error dari server."
 */
router.post("/profil", auth, profilController.forgetPassword);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password pengguna dengan token yang dikirim via email
 *     description: API ini digunakan untuk mengganti password pengguna dengan token reset yang dikirim ke email mereka.
 *     tags:
 *       - Profil
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token reset password yang diterima via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassw:
 *                 type: string
 *                 example: "passwordbaru123"
 *               confirmPassw:
 *                 type: string
 *                 example: "passwordbaru123"
 *     responses:
 *       200:
 *         description: Password berhasil direset.
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
 *                   example: "Password berhasil direset."
 *                 data:
 *                   type: "null"
 *       400:
 *         description: Token tidak valid atau password tidak sesuai.
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
 *                   example: "Konfirmasi password tidak sama dengan password baru."
 *                 data:
 *                   type: "null"
 *       401:
 *         description: Token tidak valid atau sudah kadaluarsa.
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
 *                   example: "Token tidak valid atau sudah kadaluarsa."
 *                 data:
 *                   type: "null"
 *       404:
 *         description: Akun tidak ditemukan.
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
 *                   example: "Akun tidak ditemukan."
 *                 data:
 *                   type: "null"
 *       500:
 *         description: Terjadi kesalahan pada server.
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
 *                   example: "Detail error dari server."
 */
router.post("/", profilController.resetPassword);

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
module.exports = router;
