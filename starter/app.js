require("express-async-errors");
const express = require("express");
const app = express();

const config = require("./utils/config");
const mongoose = require("mongoose");

//import middleware
const morgan = require("morgan");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

//import routers
const authRouter = require("./routes/auth");

// import openapi docs
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JWT Auth",
      version: "1.0.0",
      description: "JWT authentication app built using Express and MongoDB",
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      },
    },
    security: [
      {
        basicAuth: [],
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const openapiSpecification = swaggerJsdoc(options);

//middleware
app.use(express.static("./public"));
app.use(express.json());
app.use(morgan("common"));

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification)); //swagger ui docs routes

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = config.PORT;
async function start() {
  try {
    mongoose.connect(config.MONGODB_URI);
    app.listen(port, console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.error(error);
  }
}

start();
