require("dotenv").config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 3001,
  secretKey: process.env.JWT_SECRET,
  frontend: process.env.FRONTEND_URL,
  cookieSecure: process.env.VERCEL_ENV === "production",
};
