// Express
const express = require("express");
const path = require("path");

// firebase
const app = express();
const admin = require("./db/firebaseAdmin");

//Security
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimit = require('express-rate-limit');

var corsOptions = {
  origin: "https://task-management-app-nine-beryl.vercel.app", //  frontend domain
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(cors(corsOptions));
app.use(helmet());
app.use(xss());
app.use(limiter)

app.use(express.json());
app.use(express.static("./public"));

// Routers
const taskRouter = require("./routes/taskRoutes");

// Endpoints
app.use("/dashboard/tasks", taskRouter);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running`);
});
