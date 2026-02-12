import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import redis from "redis";
import cors from "cors"; // ✅ add cors
import userRoutes from "./routes/user.js";
import dns from "dns";

dotenv.config();

// Force DNS servers (optional, helps with SRV lookups)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// ✅ Enable CORS for all origins
app.use(cors());

// ✅ Parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Redis connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("✅ Redis connected"))
  .catch((err) => console.error("❌ Redis connection error:", err.message));

// Routes
app.use("/api/user", userRoutes);

// ✅ Global error handler middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ✅ Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
