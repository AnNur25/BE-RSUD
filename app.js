const express = require("express");
const config = require("./src/config/config");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/docs/swaggerConfig");
const authRoute = require("./src/routes/authRoute");
const profileRoute = require("./src/routes/profilRoute");
const dokterRoute = require("./src/routes/dokterRoute");
const pelayananDokterRoute = require("./src/routes/pelayananDokterRoute");
const spesialisRoute = require("./src/routes/spesialisRoute");
const pelayananRS = require("./src/routes/pelayananRSRoute");
const jadwalDokter = require("./src/routes/jadwalDokterRoute");
const aduan = require("./src/routes/aduanRoute");
const berita = require("./src/routes/beritaRoute");
const cors = require("cors");
const port = config.port;
const app = express();

app.use(cors({ allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoute);
app.use("/", profileRoute);
app.use("/dokter", dokterRoute);
app.use("/pelayanan-dokter", pelayananDokterRoute);
app.use("/spesialis", spesialisRoute);
app.use("/pelayanan-rs", pelayananRS);
app.use("/jadwal-dokter", jadwalDokter);
app.use("/aduan", aduan);
app.use("/berita", berita);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    statusCode: err.statusCode || 500,
    status: err.status || "Failed",
    message: err.message || "Internal Server Error.",
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
