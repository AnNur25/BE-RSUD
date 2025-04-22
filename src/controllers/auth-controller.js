const responseHelper = require("../utils/response");
const authService = require("../services/auth-service");
const JwtHelper = require("../utils/jwt-sign");
const { UnauthorizedError } = require("../utils/error");
const config = require("../configs/env-config");
const prisma = require("../prisma/prismaClient");

class AuthController {
  static async registerAdmin(req, res) {
    try {
      const { nama, email, password } = req.body;
      const result = await authService.registerAdmin({ nama, email, password });
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
      const refreshToken = JwtHelper.generateRefreshToken(result.user);
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //Jika tidak diset, cookie akan menjadi session cookie dan akan dihapus saat browser ditutup == logout
        httpOnly: true,
        sameSite: "Strict",
        secure: config.cookieSecure,
        path: "/auth",
      });
      return responseHelper.success(
        res,
        { accessToken: result.token },
        "Login Success"
      );
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedError("Refresh token tidak ditemukan");
      }

      let decoded;
      try {
        decoded = JwtHelper.verifyRefreshToken(refreshToken);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          throw new UnauthorizedError(
            "Refresh token sudah kadaluarsa, silakan login kembali"
          );
        }
        throw new UnauthorizedError("Refresh token tidak valid");
      }
      console.log("Decoded token:", decoded);
      const user = await prisma.user.findUnique({
        where: { id_user: decoded.payload.id_user },
      });

      if (!user) {
        throw new UnauthorizedError("User tidak ditemukan");
      }

      res.clearCookie("refreshToken");

      //sliding expiration
      const newRefreshToken = JwtHelper.generateRefreshToken(user);

      res.cookie("refreshToken", newRefreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        httpOnly: true,
        sameSite: "Strict",
        secure: config.cookieSecure,
        path: "/auth",
      });

      const newAccessToken = JwtHelper.generateToken(user);

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: config.cookieSecure,
        path: "/auth",
      });

      return responseHelper.success(res, null, "Berhasil logout");
    } catch (error) {
      return responseHelper.error(res, error);
    }
  }
}

module.exports = AuthController;
