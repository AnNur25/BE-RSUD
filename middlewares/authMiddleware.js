const jwt = require("jsonwebtoken");
const config = require("../config/config");
const secret = config.secretKey;

function auth(req, res, next) {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    const error = new Error("Authorization tidak ditemukan");
    error.statusCode = 401;
    error.status = "Failed";
    return next(error);
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    const error = new Error("Token tidak ditemukan");
    error.statusCode = 401;
    error.status = "Failed";
    return next(error);
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      const error = new Error("Token tidak valid");
      error.statusCode = 401;
      error.status = "Failed";
      return next(error);
    }

    req.user = user;
    next();
  });
}

/*
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
*/

module.exports = { auth };
