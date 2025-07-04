const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RSUD BALUNG API Documentation",
      version: "1.0.0",
      description: "Express API with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Development server",
      },
      {
        url: "http://31.97.107.5:3000/",
        description: "Development server",
      },
      {
        url: "https://rsdbalung.newshub.store/",
        description: "Production server (non-www)",
      },
      {
        url: "https://rs.newshub.store/",
        description: "Production server (non-www)",
      },
    ],
  },
  apis: [
    "./src/routes/aduan-route.js",
    "./src/routes/berita-route.js",
    "./src/routes/poli-route.js",
    "./src/routes/dokter-route.js",
    "./src/routes/jadwal-dokter-route.js",
    "./src/routes/profil-route.js",
    "./src/routes/pelayanan-route.js",
    "./src/routes/auth-route.js",
    "./src/routes/oauth-route.js",
    "./src/routes/banner-route.js",
    "./src/routes/layanan-unggulan-route.js",
    "./src/routes/komentar-route.js",
    "./src/routes/media-sosial-route.js",
    "./src/routes/direktur-route.js",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
