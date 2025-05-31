const jwt = require("jsonwebtoken");
const { aksesSecret, refreshSecret } = require("../configs/env-config");

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
    const refresToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
    return refresToken;
  }
}

module.exports = JwtHelper;
