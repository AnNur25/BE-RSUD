const express = require("express");
const config = require("./config/config");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerConfig");
const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profilRoute");
const dokterRoute = require("./routes/dokterRoute");
const pelayananDokterRoute = require("./routes/pelayananDokterRoute");
const spesialisRoute = require("./routes/spesialisRoute");
const hariSesi = require("./routes/hariSesiRoute");
const pelayananRS = require("./routes/pelayananRSRoute");
const jamKerja = require("./routes/jamKerjaRoute");
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
app.use("/", hariSesi);
app.use("/pelayananRS", pelayananRS);
app.use("/jam-kerja", jamKerja);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
