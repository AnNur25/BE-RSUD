const prisma = require("../prisma/prismaClient");
const { BadRequestError, NotFoundError } = require("../utils/error-handling-utils");
const bcrypt = require("bcrypt");
const JwtHelper = require("../utils/jwt-sign-utils");
const { Role } = require("@prisma/client");
const { validatePasswordStrength } = require("../utils/password-validator-utils");

class AuthService {
  static async register({ nama, email, password, no_wa, role }) {
    if (!nama || !email || !password || !no_wa) {
      throw new BadRequestError("Semua field harus diisi");
    }
    try {
      validatePasswordStrength(password);
    } catch (err) {
      throw new BadRequestError(err.message);
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
    const refreshToken = JwtHelper.generateRefresToken(user);
    await prisma.revokedToken.upsert({
      where: { user_id: user.id_user },
      update: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        user_id: user.id_user,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return { aksesToken, refreshToken, user };
  }
}

module.exports = AuthService;
