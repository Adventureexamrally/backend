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
router.get("/get", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get exams." });

  }
});

router.put("/:id/UpdateExam", async (req, res) => {
  console.log(req.body)
  const { id } = req.params;
  try {

    const exam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create exam." });
  }
});

router.post("/Many", async (req, res) => {
  console.log(req.body);
  try {
    // Using insertMany directly on the Exam model
    const exams = await Exam.insertMany(req.body);
    res.status(201).json(exams);
  } catch (error) {
    console.error("Error inserting exams:", error);
    res.status(500).json({ error: "Failed to create exams." });
  }
});
router.post("/AddExam", async (req, res) => {
  console.log(req.body);
  try {
    // Using insertMany directly on the Exam model
    const exams = await Exam.create(req.body);
    res.status(201).json(exams);
  } catch (error) {
    console.error("Error inserting exams:", error);
    res.status(500).json({ error: "Failed to create exams." });
  }
});

router.get("/:id/exams-with-questions", async (req, res) => {
  console.log(req.params.id);

  const { id } = req.params

  try {
    const result = await Exam.aggregate([
      {
        $lookup: {
          from: "questions", // Name of the Question collection
          localField: "id",
          foreignField: "id",
          as: "questions"
        }
      },
      // { $unwind: "$questions" }, // Flattens the array
      { $match: { "questions.id": parseInt(id) } } // Filters only hard questions
    ]);

    res.json(result).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Aggregation failed" });
  }
});



module.exports = router;
