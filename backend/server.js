const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Healthcheck Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "CareerPilot AI API Server",
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
