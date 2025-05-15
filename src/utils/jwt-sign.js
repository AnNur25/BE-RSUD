const jwt = require("jsonwebtoken");
const secret = require("../configs/env-config").secretKey;

class JwtHelper {
  static generateToken(user) {
    const payload = {
      id_user: user.id_user,
      nama: user.nama,
      email: user.email,
      no_wa: user.no_wa,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    return token;
  }
}

module.exports = JwtHelper;
