require("dotenv").config();
const envConfig = require("./src/configs/env-config");
const { cookieSecret } = require("./src/configs/env-config");
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

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://rsdbalung.vercel.app",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

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
app.use((err, req, res, next) => {
  console.error(err);

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
