const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const dbConfig = require("./config/dbConfig");

const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");

app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.send({ status: "online", message: "Quiz Application Server is running" });
});

const port = process.env.PORT || 5000;

const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`===============================================`);
    console.log(` Quiz Application Server listening on port ${port}`);
    console.log(` Health Check: http://localhost:${port}/api/health`);
    console.log(`===============================================`);
  });
}
