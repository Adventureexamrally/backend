const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");

// Create a new exam
router.post("/", async (req, res) => {
    console.log(req.body)
  try {
    const { title, description, duration, questions } = req.body;
    const exam = new Exam({ title, description, duration, questions });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create exam." });
  }
});

// Get all exams
router.get("/", async (req, res) => {
  const exams = await Exam.find().populate("questions");
  res.json(exams);
});

module.exports = router;
