const responseHelper = require("../helpers/response-helper");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");
const authService = require("../services/auth-service");
const cookie = require("cookie-signature");
const {
  cookieSecure,
  cookieSecret,
  refreshSecret,
} = require("../configs/env-config");
const { UnauthorizedError } = require("../utils/error-handling-utils");
const JwtHelper = require("../utils/jwt-sign-utils");

class AuthController {
  static async register(req, res) {
    try {
      const { nama, email, password, no_wa, role } = req.body;
      const result = await authService.register({
        nama,
        email,
        password,
        no_wa,
        role,
      });
      return responseHelper.created(
        res,
        result,
        "Akun Admin berhasil registrasi"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.cookie("aksesToken", cookie.sign(result.aksesToken, cookieSecret), {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSecure ? "None" : "Lax",
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/",
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSecure ? "None" : "Lax", // Ubah ke None untuk cross-domain
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
      });
      return responseHelper.success(res, result, "Login Success");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }

  static async refresToken(req, res) {
    try {
      const rawRefreshToken = req.cookies.refreshToken;
      if (!rawRefreshToken) {
        throw new UnauthorizedError("Refresh token tidak ditemukan");
      }
      const decoded = jwt.verify(rawRefreshToken, refreshSecret);
      console.log("Decoded Token:", decoded);
      const userId = decoded.id_user;
      if (!userId) {
        throw new UnauthorizedError(
          "ID user tidak tersedia dalam refresh token"
        );
      }

      const currentUser = await prisma.user.findUnique({
        where: { id_user: userId },
      });
      if (!currentUser) {
        throw new UnauthorizedError("User tidak ditemukan");
      }

      const revoked = await prisma.revokedToken.findUnique({
        where: { user_id: userId },
      });

      if (!revoked || revoked.token !== rawRefreshToken) {
        throw new UnauthorizedError(
          "Refresh token tidak valid atau sudah kadaluarsa"
        );
      }

      const newAksesToken = JwtHelper.generateToken(currentUser);
      const newRefreshToken = JwtHelper.generateRefresToken(currentUser);

      // (update jika ada, create jika belum)
      await prisma.revokedToken.upsert({
        where: { user_id: userId },
        update: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          user_id: userId,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.cookie("aksesToken", cookie.sign(newAksesToken, cookieSecret), {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSecure ? "None" : "Lax",
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/",
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSecure ? "None" : "Lax", // Ubah ke None untuk cross-domain
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
      });
      return responseHelper.success(
        res,
        {
          aksesToken: newAksesToken,
          refreshToken: newRefreshToken,
        },
        "berhasil refresh token"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async logout(req, res) {
    try {
      const rawRefreshToken = req.cookies.refreshToken;
      console.log("Raw Refresh Token:", rawRefreshToken);
      if (!rawRefreshToken) {
        throw new UnauthorizedError("Refresh token tidak ditemukan");
      }

      const decoded = jwt.verify(rawRefreshToken, refreshSecret);
      const userId = decoded.id_user;

      await prisma.revokedToken.deleteMany({
        where: { user_id: userId },
      });

      res.clearCookie("aksesToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });

      return responseHelper.success(res, null, "Berhasil logout");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = AuthController;
