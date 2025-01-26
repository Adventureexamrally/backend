const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

// Submit results
router.post("/", async (req, res) => {
  try {
    const { userId, examId, score, totalMarks } = req.body;
    const result = new Result({ userId, examId, score, totalMarks });
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit result." });
  }
});

// Get results by user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const results = await Result.find({ userId }).populate("examId");
  res.json(results);
});

module.exports = router;
