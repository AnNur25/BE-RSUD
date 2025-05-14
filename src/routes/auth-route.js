const express = require("express");
const route = express.Router();
const authController = require("../controllers/auth-controller");
const { auth } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /auth/register-admin:
 *  post:
 *      summary: Registrasi Admin
 *      description: API untuk registrasi akun admin baru.
 *      tags:
 *       - Autentikasi
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nama:
 *                              type: string
 *                              example: "binar si'ah"
 *                          email:
 *                              type: string
 *                              example: "binarian@gmail.com"
 *                          password:
 *                              type: string
 *                              example: "binarlope"
 *      responses:
 *          '201':
 *              description: Akun Admin berhasil registrasi
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 201
 *                              status:
 *                                  type: string
 *                                  example: "Success"
 *                              message:
 *                                  type: string
 *                                  example: "Akun Admin berhasil registrasi"
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      id_user:
 *                                          type: integer
 *                                          example: 1
 *                                      nama:
 *                                          type: string
 *                                          example: "binar"
 *                                      email:
 *                                          type: string
 *                                          example: "binar@gmail.com"
 *          '400':
 *              description: Data tidak lengkap
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 400
 *                              status:
 *                                  type: string
 *                                  example: "Failed"
 *                              message:
 *                                  type: string
 *                                  example: "Semua field (nama, email, password) harus diisi"
 *          '500':
 *              description: Terjadi kesalahan pada server
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 500
 *                              status:
 *                                  type: string
 *                                  example: "Failed"
 *                              message:
 *                                  type: string
 *                                  example: "Internal Server Error."
 */
route.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: API untuk login pengguna dengan email dan password. Refresh token akan disimpan dalam cookie HttpOnly.
 *     tags:
 *       - Autentikasi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "binarian@gmail.com"
 *               password:
 *                 type: string
 *                 example: "binarlope"
 *     responses:
 *       '200':
 *         description: Login berhasil dan refresh token disimpan dalam cookie HttpOnly.
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
 *                   example: "Login Success"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       '400':
 *         description: Data tidak lengkap
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
 *                   example: "Email dan password harus diisi."
 *       '401':
 *         description: Email atau password salah
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
 *                   example: "Invalid email or password"
 *       '500':
 *         description: Terjadi kesalahan pada server
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
route.post("/login", authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: Mengembalikan access token baru menggunakan refresh token yang disimpan dalam cookie HttpOnly.
 *     tags:
 *       - Autentikasi
 *     responses:
 *       '200':
 *         description: Berhasil mendapatkan access token baru.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       '401':
 *         description: Refresh token tidak ditemukan, tidak valid, atau sudah kadaluarsa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh token tidak ditemukan"
 *       '500':
 *         description: Terjadi kesalahan pada server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Terjadi kesalahan pada server."
 */
// route.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     description: API untuk logout admin.
 *     tags:
 *       - Autentikasi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil logout.
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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "berhasil logout"
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
 *                   example: "Unexpected error occurred."
 */
route.post("/logout", auth, authController.logout);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Masukkan token JWT di sini
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refreshToken
 *       description: |
 *         Refresh token disimpan dalam cookie HttpOnly dan digunakan untuk memperoleh access token baru.
 */
module.exports = route;

// router.post("/register-pj", authController.registerPJ);
/*
app.get("/admin", auth, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Halo Admin, Anda berhasil mengakses halaman ini" });
});

app.get("/user", auth, authorizeRole("user", "admin"), (req, res) => {
  res.json({ message: "Halo User, Anda berhasil mengakses halaman ini" });
});

components:
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: refresh_token
      description: |
        Refresh token disimpan dalam cookie HttpOnly dan digunakan untuk memperoleh access token baru.

*/
