const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

class AuthController {
  static async registerAdmin(req, res) {
    const { nama, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.user.create({
        data: {
          nama,
          email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      res.json(admin);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
  static async registerPJ(req, res) {
    const { nama, email, password, role } = req.body;
    try {
      const admin = await prisma.user.create({
        data: {
          nama,
          email,
          password,
          role: "PJ",
        },
      });
      res.json(admin);
    } catch (error) {
      res.json({ error: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Invalid email or password",
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({
          statusCode: 400,
          status: "Failed",
          message: "Invalid email or password",
        });
      }

      const payload = {
        id_user: user.id_user,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: "Login Success",
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = AuthController;
