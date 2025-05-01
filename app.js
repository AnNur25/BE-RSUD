const envConfig = require("./src/configs/env-config");
const express = require("express");
const app = express();
require("./src/configs/passport-config");
const swaggerUi = require("swagger-ui-express");
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} = require("./src/utils/error");
const responseHelper = require("./src/utils/response");
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerSpec = require("./src/configs/swagger-config");
const swaggerUiDist = require("swagger-ui-dist");
const authRoute = require("./src/routes/auth-route");
const profileRoute = require("./src/routes/profil-route");
const dokterRoute = require("./src/routes/dokter-route");
const pelayananRoute = require("./src/routes/pelayanan-route");
const poliRoute = require("./src/routes/poli-route");
const jadwalDokterRoute = require("./src/routes/jadwal-dokter-route");
const aduanRoute = require("./src/routes/aduan-route");
const beritaRoute = require("./src/routes/berita-route");
const bannerRoute = require("./src/routes/banner-route");
const layananUnggulanRoute = require("./src/routes/layanan-unggulan-route");
const oauth = require("./src/controllers/oauth-controller");
const port = envConfig.port;

// app.use(cookieParser());
app.use(
  cors({ allowedHeaders: ["Content-Type", "Authorization"], credentials: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.8/swagger-ui.css",
  })
);

app.use("/swagger-ui", express.static(swaggerUiDist.getAbsoluteFSPath()));

app.use("/auth", authRoute);
app.use("/", profileRoute);
app.use("/dokter", dokterRoute);
app.use("/pelayanan", pelayananRoute);
app.use("/poli", poliRoute);
app.use("/jadwal-dokter", jadwalDokterRoute);
app.use("/aduan", aduanRoute);
app.use("/berita", beritaRoute);
app.use("/banner", bannerRoute);
app.use("/layanan-unggulan", layananUnggulanRoute);
app.use("/auth", oauth);

app.use((err, req, res, next) => {
  console.error(err);
  if (
    err instanceof UnauthorizedError ||
    err instanceof BadRequestError ||
    err instanceof NotFoundError
  ) {
    return responseHelper.error(res, err);
  }
  return responseHelper.error(res, new Error("Internal Server Error"));
});

app.get("/", (req, res) => {
  res.send("the system works !!!");
});
app.listen(port, () => {
  console.log(`LOPE YOU ${port}`);
});
