const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KGL Backend API",
      version: "1.0.0",
      description: "API Documentation for Karibu Groceries Ltd"
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
