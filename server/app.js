const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Routes = require("./routes");

dotenv.config();

// Ensure required env variables are set
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is missing.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) console.warn("⚠️ JWT_SECRET is missing.");

// Initialize Express app
const app = express();
const HOST = process.env.HOST || "http://localhost:3000";
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: HOST,
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`✅ MongoDB connected in ${process.env.MONGO_URL}`))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// API Routes
const routes = {
  "/api/": Routes.baseRoutes,
  "/api/auth/admin": Routes.adminAuthRoutes,
  "/api/admin": Routes.adminRoutes,
  "/api/admin": Routes.cadreRoutes,
  "/api/auth": Routes.authRoutes,
  "/api/user": Routes.userRoutes,
};

Object.keys(routes).forEach((path) => app.use(path, routes[path]));

app.use("*", (req, res, next) => {
  res.status(404).json({ error: "API Not Found" });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

module.exports = app;
