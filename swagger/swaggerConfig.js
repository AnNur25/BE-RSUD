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
        url: "https://m0jc9knf-3000.asse.devtunnels.ms/",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "https",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./routes/authRoute.js",
    "./routes/dokterRoute.js",
    "./routes/pelayananDokterRoute.js",
    "./routes/profilRoute.js",
    "./routes/spesialisRoute.js",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
