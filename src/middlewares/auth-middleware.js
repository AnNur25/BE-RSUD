const jwt = require("jsonwebtoken");
const config = require("../configs/env-config");
const { UnauthorizedError } = require("../utils/error");
const secret = config.secretKey;

function auth(req, res, next) {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return next(new UnauthorizedError("Authorization tidak ditemukan"));
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return next(new UnauthorizedError("Token tidak ditemukan"));
  }
  jwt.verify(token, secret, (error, user) => {
    if (error) {
      return next(new UnauthorizedError("Token tidak valid"));
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

module.exports = { auth };
