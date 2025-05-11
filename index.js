const express = require("express");
const http = require("http");
const cors = require("cors");
const { connectDB } = require("./src/utility/dB.connection");

const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");
const { userRouter } = require("./src/routes/userRoutes");
const { householdRouter } = require("./src/routes/householdRoutes");
const { choreRouter } = require("./src/routes/choreRoutes");
const { expenseRouter } = require("./src/routes/expenseRoutes");
const { calendarRouter } = require("./src/routes/calendarRoutes");
const { historyRouter } = require("./src/routes/historyRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: "*",
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "X-CSRF-Token",
    "X-API-Key",
  ],
  exposedHeaders: ["Content-Length", "X-Request-ID", "X-Response-Time"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("/", cors(corsOptions));

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Api server is running");
});

app.use("/api/users", userRouter);
app.use("/api/households", householdRouter);
app.use("/api/chores", choreRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/history", historyRouter);

//error handling
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, console.log(`Server running on PORT ${PORT}...`));
