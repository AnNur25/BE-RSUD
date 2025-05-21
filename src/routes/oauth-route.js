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
 *       - URL akan mengandung query `?authSuccess=true`
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
route.post("/set-cookie", oauthController.setCookie);

module.exports = route;
