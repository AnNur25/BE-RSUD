const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

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
router.post("/register-admin", authController.registerAdmin);

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Login
 *      description: API untuk login pengguna dengan email dan password.
 *      tags:
 *       - Autentikasi
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: "binarian@gmail.com"
 *                          password:
 *                              type: string
 *                              example: "binarlope"
 *      responses:
 *          '200':
 *              description: Login berhasil
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 200
 *                              status:
 *                                  type: string
 *                                  example: "Success"
 *                              message:
 *                                  type: string
 *                                  example: "Login Success"
 *                              token:
 *                                  type: string
 *                                  example: "eyJhbGciOiJIUzI1NiIsInR..."
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
 *                                  example: "Email dan password harus diisi."
 *          '401':
 *              description: Email atau password salah
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 401
 *                              status:
 *                                  type: string
 *                                  example: "Failed"
 *                              message:
 *                                  type: string
 *                                  example: "Invalid email or password"
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
router.post("/login", authController.login);

module.exports = router;

// router.post("/register-pj", authController.registerPJ);
/*
app.get("/admin", auth, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Halo Admin, Anda berhasil mengakses halaman ini" });
});

app.get("/user", auth, authorizeRole("user", "admin"), (req, res) => {
  res.json({ message: "Halo User, Anda berhasil mengakses halaman ini" });
});

*/
