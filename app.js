require("dotenv").config();
const envConfig = require("./src/configs/env-config");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("./src/configs/passport-config"); //Hanya dijalankan sekali saat app boot | Maka passport.use(...) sudah teregistrasi ke singleton passport secara global
const swaggerUi = require("swagger-ui-express");
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} = require("./src/utils/error-handling-utils");
const responseHelper = require("./src/helpers/response-helper");
const cors = require("cors");
const swaggerSpec = require("./src/configs/swagger-config");
const swaggerUiDist = require("swagger-ui-dist");
const authRoute = require("./src/routes/auth-route");
const oauthRoute = require("./src/routes/oauth-route");
const profileRoute = require("./src/routes/profil-route");
const dokterRoute = require("./src/routes/dokter-route");
const pelayananRoute = require("./src/routes/pelayanan-route");
const poliRoute = require("./src/routes/poli-route");
const jadwalDokterRoute = require("./src/routes/jadwal-dokter-route");
const aduanRoute = require("./src/routes/aduan-route");
const beritaRoute = require("./src/routes/berita-route");
const bannerRoute = require("./src/routes/banner-route");
const layananUnggulanRoute = require("./src/routes/layanan-unggulan-route");
const komentarRoute = require("./src/routes/komentar-route");
const mediaSosial = require("./src/routes/media-sosial-route");
const direkturRoute = require("./src/routes/direktur-route");
const port = envConfig.port;
const passport = require("passport");

app.use(passport.initialize());
require("./src/cron/cronJobs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fixed CORS configuration
const allowedOrigins = [
  "https://rsdbalung.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://31.97.50.117:3000",
  "https://www.newshub.store",
  "https://newshub.store",
  "https://rs-balung-cp.vercel.app",
];

// Middleware CORS untuk semua route
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );

  // Preflight response
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.8/swagger-ui.css",
  })
);

app.use("/swagger-ui", express.static(swaggerUiDist.getAbsoluteFSPath()));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/auth", oauthRoute);
app.use("/api/v1", profileRoute);
app.use("/api/v1/dokter", dokterRoute);
app.use("/api/v1/pelayanan", pelayananRoute);
app.use("/api/v1/poli", poliRoute);
app.use("/api/v1/jadwal-dokter", jadwalDokterRoute);
app.use("/api/v1/aduan", aduanRoute);
app.use("/api/v1/berita", beritaRoute);
app.use("/api/v1/berita", komentarRoute);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/layanan-unggulan", layananUnggulanRoute);
app.use("/api/v1/media-sosial", mediaSosial);
app.use("/api/v1", direkturRoute);

app.use((err, req, res, next) => {
  console.error("Error details:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", (req, res) => {
  res.send("the system works !!!");
});
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});

module.exports = app;
