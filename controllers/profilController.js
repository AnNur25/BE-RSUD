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
      const userId = req.user.id_user;

      const user = await prisma.user.findUnique({
        where: { id_user: userId },
      });

      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          status: "Failed",
          message: "User not found",
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updatePassw(req, res) {
    try {
      if (!req.user || !req.user.email) {
        return res.status(401).json({
          success: false,
          message: "Tidak terautentikasi atau data user tidak lengkap",
        });
      }

      const userEmail = req.user.email;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Password lama dan baru harus diisi",
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
          success: false,
          message: "Password lama tidak valid",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email: userEmail },
        data: { password: hashedPassword },
      });

      return res.status(200).json({
        success: true,
        message: "Password berhasil diubah",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({
        message: "Terjadi kesalahan saat mengubah password",
      });
    }
  }

  static async forgetPassword(req, res) {
    const email = req.user.email;

    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
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
        message: "Link reset password telah dikirim ke email",
        reset_link: resetLink,
        resetToken,
      });
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token } = req.query;
      const { newPassw, confirmPassw } = req.body;
      if (!token || !newPassw) {
        return res
          .status(400)
          .json({ message: "Token dan password baru diperlukan." });
      }

      if (newPassw != confirmPassw) {
        return res.json({
          messag: "konfirmasi password tidak sama dengan password",
        });
      }

      const secret = process.env.JWT_SECRET;
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Token tidak valid atau sudah kadaluarsa." });
        }

        const { email } = decoded;
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          return res.status(404).json({ message: "Akun tidak ditemukan." });
        }

        const hashedPassword = await bcrypt.hash(newPassw, 10);

        await prisma.user.update({
          where: { email: email },
          data: { password: hashedPassword },
        });

        await sendSuccesPasswordEmail(email);

        return res.status(200).json({ message: "Password berhasil direset." });
      });
    } catch (error) {
      console.error("Kesalahan saat reset password:", error);
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }
  }
}

module.exports = ProfilController;
