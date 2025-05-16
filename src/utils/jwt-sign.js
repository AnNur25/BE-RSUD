const jwt = require("jsonwebtoken");
const aksesSecret = require("../configs/env-config").aksesSecret;
const refresSecret = require("../configs/env-config").refresSecret;

class JwtHelper {
  static generateToken(user) {
    const payload = {
      id_user: user.id_user,
      nama: user.nama,
      email: user.email,
      no_wa: user.no_wa,
      role: user.role,
    };

    const aksesToken = jwt.sign(payload, aksesSecret, { expiresIn: "15m" });
    return aksesToken;
  }
  static generateRefresToken(user) {
    const payload = {
      id_user: user.id_user,
    };
    const refresToken = jwt.sign(payload, refresSecret, { expiresIn: "1h" });
    return refresToken;
  }
}

module.exports = JwtHelper;
