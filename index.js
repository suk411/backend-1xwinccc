import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import redis from "redis";
import userRoutes from "./routes/user.js";
import dns from "dns";
dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Redis connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("✅ Redis connected"))
  .catch((err) => console.error("Redis error:", err));

// Routes
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
