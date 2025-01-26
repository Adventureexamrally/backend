const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { hashPassword, comparePassword, generateToken } = require("../utils/helpers");

// Signup
router.post("/signup", async (req, res) => {
    console.log(req.body)
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
});

module.exports = router;
