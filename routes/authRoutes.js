const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const { hashPassword, comparePassword, generateToken } = require("../utils/helpers");
const Question = require("../models/Question");
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
router.post("/users/:userId/questions/:questionId", async (req, res) => {
  try {
      const { userId, questionId } = req.params;

      // Validate User and Question exist
      const user = await User.findById(userId);
      const question = await Question.findById(questionId);
      if (!user || !question) return res.status(404).json({ error: "User or Question not found" });

      // Add Question to User's attemptedQuestions
      if (!user.attemptedQuestions.includes(questionId)) {
          user.attemptedQuestions.push(questionId);
          await user.save();
      }

      res.status(200).json({ message: "Question added to user", user });
  } catch (error) {
      res.status(500).json({ error: "Failed to add question to user" });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
      const user = await User.findById(req.params.userId).populate("attemptedQuestions");
      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: "Error fetching user data" });
  }
});

module.exports = router;
