import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/modelUser.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { number, password, inviteCode } = req.body;

    // Check if number already exists
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Number already registered",
      });
    }

    // Generate 5-digit userId
    const userId = Math.floor(10000 + Math.random() * 90000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      number,
      password: hashedPassword,
      inviteCode,
      userId,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Registration failed",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;

    const user = await User.findOne({ number });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Login failed",
    });
  }
});

export default router;
