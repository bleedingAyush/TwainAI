// app.js

const express = require("express");
const sls = require("serverless-http");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const routes = require("./routes/route.js");
const cors = require("cors");
const server = require("http").createServer(app);
const supertokens = require("supertokens-node");
const { middleware } = require("supertokens-node/framework/express");
// const connectDB = require("./config/db");
const initializeSuperToken = require("./config/supertokens");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middlewares/errorMiddleware.js");

app.use(express.json());

initializeSuperToken();

app.use(
  cors({
    origin: [`${process.env.WEBSITE_DOMAIN}`],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

app.use(middleware());

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs,
  message: "Your limit exceeded Try after a minute",
});

// Use the limit rule as an application middleware
app.use(apiRequestLimiter);

app.use("/", routes);
app.use(errorHandler);

server.listen(5000, () => {
  console.log("server started 5000");
});

module.exports.server = sls(app);
