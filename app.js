const express = require("express");
const config = require("./config/config");
const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profilRoute");
const port = config.port;
const app = express();

app.use(express.json());
app.use("/auth", authRoute);
app.use("/", profileRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
