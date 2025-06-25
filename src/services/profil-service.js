require("dotenv").config();
const prisma = require("../prisma/prismaClient");
const JwtHelper = require("../utils/jwt-sign-utils");
const jwt = require("jsonwebtoken");
const config = require("../configs/env-config");
const {
  validatePasswordStrength,
} = require("../utils/password-validator-utils");
const secret = config.secretKey;
// const frontend_url = config.frontend;
const {
  sendSuccesPasswordEmail,
  sendForgotPasswordEmail,
} = require("../helpers/nodemailer-helper");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/error-handling-utils");

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
      no_wa: foundUser.no_wa,
      role: foundUser.role,
    };
  }
  static async updateProfil({ nama, email, no_wa, user }) {
    if (!nama || !email || !no_wa) {
      throw new BadRequestError("Semua field (nama, email, no_wa) wajib diisi");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id_user: user.id_user },
    });

    if (!existingUser) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const updatedUser = await prisma.user.update({
      where: { id_user: user.id_user },
      data: {
        nama,
        email,
        no_wa,
      },
    });

    return updatedUser;
  }

  static async updatePassw(user, body) {
    console.log("User dari middleware auth:", user);
    if (!user || !user.email) {
      throw new UnauthorizedError(
        "Tidak terautentikasi. Silakan login kembali."
      );
    }

    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Password lama dan password baru harus diisi.");
    }

    try {
      validatePasswordStrength(newPassword);
    } catch (err) {
      throw new BadRequestError(err.message);
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

  static async forgetPassword({ email }) {
    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser) {
      throw new NotFoundError("User tidak ditemukan.");
    }

    if (!foundUser.password || foundUser.password.trim() === "") {
      throw new BadRequestError(
        "Akun ini menggunakan login Google. Reset password tidak tersedia. Silakan login dengan Google."
      );
    }

    const resetToken = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "15m",
    });

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExp: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    const resetLink = `https://rs.newshub.store/reset-password?token=${resetToken}`;

    await sendForgotPasswordEmail(email, resetLink);

    return {
      reset_link: resetLink,
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
      decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    } catch (err) {
      throw new UnauthorizedError("Token tidak valid atau sudah kadaluarsa.");
    }

    try {
      validatePasswordStrength(newPassw);
    } catch (err) {
      throw new BadRequestError(err.message);
    }

    const hashedPassword = await bcrypt.hash(newPassw, 10);

    await prisma.user.update({
      where: { email: decoded.email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    await sendSuccesPasswordEmail(decoded.email);

    return { message: "Password berhasil diperbarui." };
  }
}

module.exports = ProfilService;
