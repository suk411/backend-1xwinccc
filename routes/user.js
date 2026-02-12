import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/modelUser.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { number, password, inviteCode } = req.body;

    const userId = Math.floor(10000 + Math.random() * 90000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      number,
      password: hashedPassword,
      inviteCode,
      userId,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;
    const user = await User.findOne({ number });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
