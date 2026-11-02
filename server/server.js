// Polyfill SlowBuffer for Node 24+ / modern Vercel runtime
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
if (!global.SlowBuffer) {
  global.SlowBuffer = buffer.Buffer;
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { connectDatabase } = require("./config/dbConfig");

// Middleware to ensure database connection in Serverless environments (e.g. Vercel)
app.use(async (req, res, next) => {
  try {
    if (process.env.MONGO_URL && mongoose.connection.readyState !== 1) {
      await connectDatabase();
    }
  } catch (e) {
    // continue with memoryStore fallback
  }
  next();
});

const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");

// Support both /api/path and /path in case reverse proxy strips prefix
app.use("/api/users", usersRoute);
app.use("/users", usersRoute);

app.use("/api/exams", examsRoute);
app.use("/exams", examsRoute);

app.use("/api/reports", reportsRoute);
app.use("/reports", reportsRoute);

// Health check endpoint
const handleHealth = (req, res) => {
  res.send({
    status: "online",
    message: "Quiz Application Server is running",
    database: mongoose.connection.readyState === 1 ? "mongodb" : "memoryStore",
  });
};
app.get("/api/health", handleHealth);
app.get("/health", handleHealth);

const port = process.env.PORT || 5000;

// Only serve frontend static files in traditional production environments, NOT inside serverless functions
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const rootDir = path.resolve();
  app.use(express.static(path.join(rootDir, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(rootDir, "client", "build", "index.html"));
  });
}

// 404 handler for unknown API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
  });
});

// Global error handler so serverless function never throws unhandled crashes
app.use((err, req, res, next) => {
  console.error("[Unhandled Express Error]:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`===============================================`);
    console.log(` Quiz Application Server listening on port ${port}`);
    console.log(` Health Check: http://localhost:${port}/api/health`);
    console.log(`===============================================`);
  });
}
