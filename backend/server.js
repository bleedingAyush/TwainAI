const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const server = require("http").createServer(app);
const routes = require("./routes/route.js");
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
    origin: [`${process.env.WEBSITE_DOMAIN}`, `${process.env.API_DOMAIN}`],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

app.use(middleware());

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs,
  message: "Your limit exceeded. Try after a minute",
});

// Use the limit rule as an application middleware
app.use(apiRequestLimiter);

app.use("/", routes);
app.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
