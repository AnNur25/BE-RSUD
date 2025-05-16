const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error");
const bcrypt = require("bcrypt");
const JwtHelper = require("../utils/jwt-sign");
const { Role } = require("@prisma/client");

class AuthService {
  static async register({ nama, email, password, no_wa, role }) {
    if (!nama || !email || !password || !no_wa) {
      throw new BadRequestError("Semua field harus diisi");
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
        no_wa,
        role: Role[role] || Role.USER,
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
    const aksesToken = JwtHelper.generateToken(user);
    const refresToken = JwtHelper.generateRefresToken(user);
    return { aksesToken, refresToken, user };
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
