const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const bcrypt = require("bcrypt");
const JwtHelper = require("../utils/jwt-sign");

class AuthService {
  static async registerAdmin({ nama, email, password }) {
    if (!nama || !email || !password) {
      throw new BadRequestError(
        "Semua field (nama, email, password) harus diisi"
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
      },
    });

    return admin;
  }

  static async login({ email, password }) {
    if (!email || !password) {
      throw new BadRequestError("Email dan password harus diisi");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError("Invalid email or password");
    }
    const token = JwtHelper.generateToken(user);
    return { token };
  }

  static async logout(res) {
    res.clearCookie("refreshToken", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "Strict",
    });
  }
}

module.exports = AuthService;
