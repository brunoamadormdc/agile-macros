const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middlewares/error");
const env = require("./config/env");

const app = express();

// Security Headers
app.use(helmet());

// CORS - Restricted Origin could be configured here later
app.use(cors());

// Body parser
app.use(express.json({ limit: "10mb" })); // Increased limit for image uploads

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Global Rate Limiting - Basic protection against DDoS / Brute Force
const globalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  message: "Too many requests from this IP, please try again later",
});
// Apply global limiter to all routes starting with /api
app.use("/api", globalLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
