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
const port = envConfig.port;
const passport = require("passport");

app.use(passport.initialize());
require("./src/cron/delete-komentar-cron");
require("./src/cron/cleanup-revoked-token-cron");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fixed CORS configuration
const allowedOrigins = [
  "https://rsdbalung.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://rs-balung-cp.vercel.app", // Removed trailing slash
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, Swagger UI)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // For development/testing purposes, you might want to be more permissive
        // Comment out the line below in production
        console.warn(`CORS: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// Handle preflight requests
app.options("*", cors());

// Special CORS handling for Swagger UI
app.use("/api-docs", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
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

// Routes
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

// Error handling middleware
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

app.listen(port, () => {
  console.log(`LOPE YOU ${port}`);
});

module.exports = app;
