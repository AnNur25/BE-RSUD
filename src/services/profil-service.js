const prisma = require("../prisma/prismaClient");
const JwtHelper = require("../utils/jwt-sign");
const jwt = require("jsonwebtoken");
const config = require("../configs/env-config");
const secret = config.secretKey;
// const frontend_url = config.frontend;
const {
  sendSuccesPasswordEmail,
  sendForgotPasswordEmail,
} = require("../utils/mailer");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/error");

class ProfilService {
  static async getProfile(user) {
    if (!user || !user.id_user) {
      throw new UnauthorizedError("Unauthorized. Silakan login kembali.");
    }

    const foundUser = await prisma.user.findUnique({
      where: { id_user: user.id_user },
    });

    if (!foundUser) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    return {
      id_user: foundUser.id_user,
      nama: foundUser.nama,
      email: foundUser.email,
    };
  }

  static async updatePassw(user, body) {
    if (!user || !user.email) {
      throw new UnauthorizedError(
        "Tidak terautentikasi. Silakan login kembali."
      );
    }

    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Password lama dan password baru harus diisi.");
    }

    if (newPassword.length < 8) {
      throw new BadRequestError("Password baru harus minimal 8 karakter.");
    }

    const foundUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { password: true },
    });

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      foundUser.password
    );
    if (!isPasswordValid) {
      throw new BadRequestError("Password lama tidak valid.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    return null;
  }

  static async forgetPassword(user) {
    if (!user || !user.email) {
      throw new UnauthorizedError(
        "Tidak terautentikasi. Silakan login kembali."
      );
    }

    const email = user.email;

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    const resetToken = JwtHelper.generateToken(foundUser);
    const resetLink = `https://rs-balung-cp.vercel.app/reset-password?token=${resetToken}`;

    await sendForgotPasswordEmail(email, resetLink);

    return {
      reset_link: resetLink,
      resetToken,
    };
  }

  static async resetPassword(token, { newPassw, confirmPassw }) {
    if (!token || !newPassw || !confirmPassw) {
      throw new BadRequestError(
        "Token, password baru, dan konfirmasi password diperlukan."
      );
    }

    if (newPassw !== confirmPassw) {
      throw new BadRequestError(
        "Konfirmasi password tidak sama dengan password baru."
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedError("Token tidak valid atau sudah kadaluarsa.");
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      throw new NotFoundError("Akun tidak ditemukan.");
    }

    const hashedPassword = await bcrypt.hash(newPassw, 10);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    await sendSuccesPasswordEmail(decoded.email);

    return null;
  }
}

module.exports = ProfilService;
