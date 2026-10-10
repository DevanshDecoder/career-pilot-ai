const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// MongoDB Atlas Connection (if configured)
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log(" 🍃 MongoDB Atlas connected successfully!");
    })
    .catch((err) => {
      console.warn(" ⚠️ MongoDB connection warning (falling back to memory store):", err.message);
    });
} else {
  console.log(" ℹ️ No MONGODB_URI provided. Running in fast in-memory store mode.");
}

// Healthcheck Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "CareerPilot AI API Server",
    database: mongoose.connection.readyState === 1 ? "mongodb-connected" : "in-memory-mode",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` 🚀 CareerPilot AI Backend Server running on port ${PORT}`);
  console.log(` 🔗 API Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
