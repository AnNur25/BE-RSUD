const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 6, // maksimal 6 kali
  message: {
    status: 429,
    message: "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
