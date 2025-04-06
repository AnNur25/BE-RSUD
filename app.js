const envConfig = require("./src/configs/env-config");
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
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
const galeriRoute = require("./src/routes/galeri-route");
const port = envConfig.port;

app.use(cors({ allowedHeaders: ["Content-Type", "Authorization"] }));
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
app.use("/galeri-berita", galeriRoute);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    statusCode: err.statusCode || 500,
    status: err.status || "Failed",
    message: err.message || "Internal Server Error.",
  });
});
app.get("/", (req, res) => {
  res.send("the system works !!!");
});
console.log("percobaan forked");
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
