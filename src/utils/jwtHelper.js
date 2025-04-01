const jwt = require("jsonwebtoken");
const secret = require("../config/config").secretKey;

class JwtHelper {
  static generateToken(user) {
    const payload = {
      id_user: user.id_user,
      nama: user.nama,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    return token;
  }
}

module.exports = JwtHelper;
