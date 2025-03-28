const express = require("express");
const config = require("./src/config/config");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/docs/swaggerConfig");
const authRoute = require("./src/routes/authRoute");
const profileRoute = require("./src/routes/profilRoute");
const dokterRoute = require("./src/routes/dokterRoute");
const pelayananDokterRoute = require("./src/routes/pelayananDokterRoute");
const spesialisRoute = require("./src/routes/spesialisRoute");
// const hariSesi = require("./src/routes/hariSesiRoute");
const pelayananRS = require("./src/routes/pelayananRSRoute");
// const jamKerja = require("./src/routes/jamKerjaRoute");
const jadwalDokter = require("./src/routes/jadwalDokterRoute");
const aduan = require("./src/routes/aduanRoute");
const berita = require("./src/routes/beritaRoute");
const cors = require("cors");
const port = config.port;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoute);
app.use("/", profileRoute);
app.use("/dokter", dokterRoute);
app.use("/pelayanan-dokter", pelayananDokterRoute);
app.use("/spesialis", spesialisRoute);
// app.use("/", hariSesi);
app.use("/pelayanan-rs", pelayananRS);
// app.use("/jam-kerja", jamKerja);
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
