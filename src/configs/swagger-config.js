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
        url: "https://rs-balung-cp.vercel.app/",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
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
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
