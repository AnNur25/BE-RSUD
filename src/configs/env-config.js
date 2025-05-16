require("dotenv").config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 3001,
  aksesSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET_KEY,
  cookieSecret: process.env.COOKIE_SECRET,
  frontend: process.env.FRONTEND_URL,
  cookieSecure: process.env.VERCEL_ENV === "production",
};
