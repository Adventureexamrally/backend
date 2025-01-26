const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Add a question to an exam
router.post("/:examId", async (req, res) => {
  try {
    const { examId } = req.params;
    const { questionText, options } = req.body;
    const question = new Question({ examId, questionText, options });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: "Failed to add question." });
  }
});

module.exports = router;
