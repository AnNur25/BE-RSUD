require("dotenv").config;
const jwt = require("jsonwebtoken");
const secret = require("../configs/env-config").secretKey;
const refreshSecret = process.env.REFRESH_SECRET_KEY;

class JwtHelper {
  static generateToken(user) {
    const payload = {
      id_user: user.id_user,
      nama: user.nama,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1m" });
    return token;
  }
  static generateRefreshToken(user) {
    const payload = {
      id_user: user.id_user,
      nama: user.nama,
      email: user.email,
    };

    const refreshToken = jwt.sign({ payload, type: "refresh" }, refreshSecret, {
      expiresIn: "7d",
    });
    return refreshToken;
  }
  static verifyRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, refreshSecret);
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }
      return decoded;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JwtHelper;
