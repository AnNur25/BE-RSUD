const prisma = require("../prisma/prismaClient");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const frontend_url = config.frontend;
const {
  sendSuccesPasswordEmail,
  sendForgotPasswordEmail,
} = require("../utils/mailer");
const bcrypt = require("bcrypt");

class ProfilController {
  static async getProfile(req, res) {
    try {
      if (!req.user || !req.user.id_user) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "Unauthorized. Silakan login kembali.",
          data: null,
        });
      }
      const userId = req.user.id_user;
      const user = await prisma.user.findUnique({
        where: { id_user: userId },
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "User tidak ditemukan.",
          data: null,
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Profile berhasil diambil.",
        data: {
          id_user: user.id_user,
          nama: user.nama,
          email: user.email,
        },
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

  static async updatePassw(req, res) {
    try {
      if (!req.user || !req.user.email) {
        return res.status(401).json({
          statusCode: 401,
          status: "Failed",
          message: "Tidak terautentikasi. Silakan login kembali.",
          data: null,
        });
      }

      const userEmail = req.user.email;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Password lama dan password baru harus diisi.",
          data: null,
        });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Password baru harus minimal 8 karakter.",
          data: null,
        });
      }
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { password: true },
      });

      const bcrypt = require("bcrypt");
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Password lama tidak valid.",
          data: null,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email: userEmail },
        data: { password: hashedPassword },
      });

      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Password berhasil diubah.",
        data: null,
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

  static async forgetPassword(req, res) {
    if (!req.user.email) {
      return res.status(401).json({
        statusCode: 401,
        status: "Failed",
        message: "Tidak terautentikasi. Silakan login kembali.",
        data: null,
      });
    }
    const email = req.user.email;

    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "User tidak ditemukan.",
          data: null,
        });
      }

      const payload = {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
      };
      const secret = process.env.JWT_SECRET;
      const resetToken = jwt.sign(payload, secret, { expiresIn: "1h" });
      const resetLink = `${frontend_url}?token=${resetToken}`;

      await sendForgotPasswordEmail(email, resetLink);
      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Link reset password telah dikirim ke email.",
        data: {
          reset_link: resetLink,
          resetToken,
        },
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

  static async resetPassword(req, res) {
    try {
      const { token } = req.query;
      const { newPassw, confirmPassw } = req.body;
      if (!token || !newPassw || !confirmPassw) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Token, password baru, dan konfirmasi password diperlukan.",
          data: null,
        });
      }

      if (newPassw !== confirmPassw) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Konfirmasi password tidak sama dengan password baru.",
          data: null,
        });
      }

      const secret = process.env.JWT_SECRET;
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            statusCode: 401,
            status: "Failed",
            message: "Token tidak valid atau sudah kadaluarsa.",
            data: null,
          });
        }

        const { email } = decoded;
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          return res.status(404).json({
            statusCode: 404,
            status: "Failed",
            message: "Akun tidak ditemukan.",
            data: null,
          });
        }

        const hashedPassword = await bcrypt.hash(newPassw, 10);

        await prisma.user.update({
          where: { email: email },
          data: { password: hashedPassword },
        });

        await sendSuccesPasswordEmail(email);

        return res.status(200).json({
          statusCode: 200,
          status: "Success",
          message: "Password berhasil direset.",
          data: null,
        });
      });
    } catch (error) {
      console.error("Kesalahan saat reset password:", error);
      res.status(500).json({
        statusCode: 500,
        status: "Failed",
        message: "Internal Server Error.",
        error: error.message,
      });
    }
  }
}

module.exports = ProfilController;
