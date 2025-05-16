const jwt = require("jsonwebtoken");
const cookie = require("cookie-signature");
const { cookieSecret, aksesSecret } = require("../configs/env-config");

function auth(req, res, next) {
  const rawToken = req.cookies.aksesToken;
  if (!rawToken) {
    const error = new Error("Token tidak ditemukan");
    error.statusCode = 401;
    error.status = "Failed";
    return next(error);
  }

  const unsigned = cookie.unsign(rawToken, cookieSecret);

  if (!unsigned) {
    const error = new Error("Token tidak valid(signature tidak cocok)");
    error.statusCode = 401;
    error.status = "Failed";
    return next(error);
  }

  jwt.verify(unsigned, aksesSecret, (error, user) => {
    if (error) {
      const error = new Error("Token JWT tidak valid atau sudah expired");
      error.statusCode = 401;
      error.status = "Failed";
      return next(error);
    }
    req.user = user;
    next();
  });
}

function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error("Akses ditolak, Anda tidak memiliki izin");
      error.statusCode = 403;
      error.status = "Failed";
      return next(error);
    }
    next();
  };
}

module.exports = { auth, authorizeRole };
