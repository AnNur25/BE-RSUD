const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs/env-config");
const secret = config.secretKey;

class AuthController {
  static async registerAdmin(req, res) {
    const { nama, email, password } = req.body;
    if (!nama || !email || !password) {
      return res.status(400).json({
        statusCode: 400,
        status: "Failed",
        message: "Semua field (nama, email, password) harus diisi",
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.user.create({
        data: {
          nama,
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json({
        statusCode: 201,
        status: "Success",
        message: "Akun Admin berhasil registrasi",
        data: admin,
      });
    } catch (error) {
      console.error("Error saat registrasi admin:", error);
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        statusCode: 400,
        status: "Failed",
        message: "Email dan password harus diisi.",
      });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "Invalid email or password",
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "Invalid email or password",
        });
      }

      const payload = {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Login Success",
        token,
      });
    } catch (error) {
      cconsole.error("Error saat registrasi admin:", error);
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
  static async logout(req, res) {
    try {
      res.clearCookie("refreshToken", null,{
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });

      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Berhasil logout",
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;
