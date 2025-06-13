const express = require("express");
const route = express.Router();
const oauthController = require("../controllers/oauth-controller");
const { auth } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Redirect ke halaman login Google OAuth
 *     description: |
 *       Endpoint ini akan mengarahkan user ke halaman login Google menggunakan OAuth 2.0.
 *       Setelah user berhasil login dan mengizinkan akses, Google akan mengarahkan kembali ke endpoint callback (`/api/v1/auth/google/callback`).
 *
 *       - Endpoint ini **tidak bisa diuji langsung dari Swagger** karena prosesnya memerlukan redirect melalui browser.
 *       - Cookie akan diset pada browser setelah proses login selesai.
 *
 *       ⚠️ Gunakan parameter `redirect` jika ingin mengatur URL tujuan setelah login berhasil.
 *
 *       Contoh alur:
 *       1. User klik login Google di frontend
 *       2. Frontend arahkan user ke: `/api/v1/auth/google?redirect=https://frontend-anda.com/dashboard`
 *       3. User login via Google
 *       4. Setelah sukses, akan redirect ke: `https://frontend-anda.com/dashboard?authSuccess=true`
 *
 *     parameters:
 *       - name: redirect
 *         in: query
 *         description: URL tujuan redirect setelah login berhasil
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect ke login Google
 */
route.get("/google", oauthController.googleLogin);

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     tags:
 *       - OAuth
 *     summary: Callback setelah login Google OAuth
 *     description: |
 *       Endpoint ini akan dipanggil secara otomatis oleh Google setelah user berhasil login.
 *
 *       - Endpoint ini akan melakukan generate JWT `aksesToken` dan `refreshToken`.
 *       - Token dikirim ke browser dalam bentuk cookie (`httpOnly`, `secure`, dan `SameSite=None`), sehingga tidak bisa diakses oleh JavaScript.
 *       - Cookie hanya dikirim untuk path tertentu:
 *         - `aksesToken`: `/api/v1`
 *         - `refreshToken`: `/api/v1/auth`
 *
 *       Jika login berhasil:
 *       - User akan di-redirect ke URL `redirectTo` (yang sebelumnya dikirim via state)
 *       - URL akan mengandung query `?authSuccess=true?aksesToken=xxx&refreshToken=xxx`
 *
 *       Jika login gagal:
 *       - Akan redirect ke frontend dengan query `?error=oauth_failed&reason=...`
 *
 *       Proses ini hanya bisa dijalankan melalui browser, bukan dari Swagger UI.
 *
 *       Cookie yang di-set:
 *       - `aksesToken`: 15 menit, httpOnly
 *       - `refreshToken`: 7 hari, httpOnly
 *
 *     responses:
 *       302:
 *         description: Redirect ke frontend (berisi parameter keberhasilan atau error)
 */
route.get("/google/callback", oauthController.googleCallback);

/**
 * @swagger
 * /api/v1/auth/set-cookie:
 *   post:
 *     tags:
 *       - OAuth
 *     summary: Set cookie secara manual dari token yang dikirim frontend
 *     description: |
 *       Endpoint ini digunakan untuk menyimpan token `aksesToken` dan `refreshToken` ke dalam cookie secara manual.
 *       Cocok digunakan ketika frontend menerima token dari redirect URL dan ingin menyimpan token ke dalam cookie secara eksplisit (misalnya setelah login via popup).
 *
 *       - Cookie `aksesToken` akan disimpan selama 15 menit.
 *       - Cookie `refreshToken` akan disimpan selama 7 hari.
 *       - Cookie akan menggunakan atribut `httpOnly`, `secure`, dan `SameSite` sesuai dengan mode production.
 *
 *       ⚠️ Token harus dikirim melalui body dalam format JSON, bukan sebagai query atau header.
 *
 *       Contoh alur:
 *       1. Frontend menerima `aksesToken` dan `refreshToken` dari redirect URL.
 *       2. Frontend mengirim `POST /api/v1/auth/set-cookie` dengan body:
 *          ```json
 *          {
 *            "aksesToken": "xxx",
 *            "refreshToken": "yyy"
 *          }
 *          ```
 *       3. Backend akan menyimpan token tersebut ke cookie.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aksesToken
 *               - refreshToken
 *             properties:
 *               aksesToken:
 *                 type: string
 *                 description: Token akses (JWT)
 *               refreshToken:
 *                 type: string
 *                 description: Token refresh (JWT)
 *
 *     responses:
 *       200:
 *         description: Cookie berhasil diset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Token tidak lengkap (aksesToken atau refreshToken kosong)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token tidak lengkap
 */
route.post("/set-cookie", oauthController.setCookie);

route.get("/testing", (req, res) => {
  res.send({
    message: "Testing OAuth route",
    aksesToken: req.cookies.aksesToken,
    refreshToken: req.cookies.refreshToken,
  });
});

module.exports = route;
