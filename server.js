require("dotenv").config();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const app = require("./app");
const envConfig = require("./src/configs/env-config");

const port = envConfig.port || 3000;

if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
