const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../configs/env-config");

function optionalAuth(req, res, next) {
  const rawToken = req.cookies?.aksesToken;

  // Jika tidak ada cookie, lanjut sebagai guest
  if (!rawToken) {
    return next();
  }

  // Coba unsign cookie
  const unsigned = cookie.unsign(rawToken, cookieSecret);
  if (!unsigned) {
    console.log("Token tidak valid, lanjut sebagai guest (signature mismatch)");
    return next();
  }

  // Verifikasi JWT
  jwt.verify(unsigned, aksesSecret, (err, user) => {
    if (err) {
      console.log("Token JWT invalid atau expired, lanjut sebagai guest");
      return next(); // tidak usah error, cukup lanjut
    }

    req.user = user;
    next();
  });
}

module.exports = optionalAuth;
