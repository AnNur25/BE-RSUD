const prisma = require("../prisma/prismaClient");

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
}

module.exports = ProfilController;
