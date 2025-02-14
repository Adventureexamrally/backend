const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const TestTopic = require("../models/testTopic");

// Create a new exam
router.post("/", async (req, res) => {
  console.log(req.body);
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
  const { page = 1, limit = 5 } = req.query; // Default to page 1, limit 5 per page
  const exams = await Exam.find()
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalExams = await Exam.countDocuments();
  res.json({
    exams,
    totalPages: Math.ceil(totalExams / limit),
    currentPage: Number(page),
  });
});
router.get("/getExam/:id", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const exams = await Exam.findOne({ _id: id });
    res.json(exams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get exams." });
  }
});

router.put("/:id/UpdateExam", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const exam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
    await exam.save();
    res.status(201).json({ message: "updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create exam." });
  }
});
router.put("/update/:id", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const exam = await Exam.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    await exam.save();
    res.status(201).json({ message: "updated" });
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
  const { id } = req.body; // Ensure `id` is present

  try {
    // Correct the query for finding an exam
    const exam = await Exam.findOne({ id: id });
    if (exam) {
      return res.status(200).json({ message: "exists" });
    }

    // Creating a new exam
    const newExam = await Exam.create(req.body);
    res.status(201).json({ message: "created" });
  } catch (error) {
    console.error("Error inserting exam:", error);
    res.status(500).json({ error: "Failed to create exam." });
  }
});

router.get("/:id/exams-with-questions", async (req, res) => {
  console.log(req.params.id);

  const { id } = req.params;

  try {
    const result = await Exam.aggregate([
      {
        $lookup: {
          from: "questions", // Name of the Question collection
          localField: "id",
          foreignField: "id",
          as: "questions",
        },
      },
      // { $unwind: "$questions" }, // Flattens the array
      { $match: { "questions.id": parseInt(id) } }, // Filters only hard questions
    ]);

    res.json(result).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Aggregation failed" });
  }
});

router.get("/search", async (req, res) => {
  const { search } = req.query;

  if (!search || search.trim().length === 0) {
    return res.status(400).json({ message: "Invalid search query" });
  }

  console.log("Search term:", search, "Type:", typeof search);

  try {
    const searchNum = Number(search); // Convert to number if possible

    const query = isNaN(searchNum)
      ? { title: { $regex: search, $options: "i" } } // If not a number, search in text fields
      : {
          $or: [
            { id: searchNum },
            { title: { $regex: search, $options: "i" } },
          ],
        }; // Search in both fields

    const result = await Exam.find(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addtopic", async (req, res) => {
  console.log(req.body);
  const { sub, topic } = req.body;

  try {
    const result = await TestTopic.find({ sub: sub });
    console.log(result);
    if (!result.sub) {
      const newTopic = new TestTopic(req.body);
      await newTopic.save();
      res.status(201).json({ message: "Topic added successfully" });
    } else {
      await TestTopic.updateOne({ sub: sub }, { $push: { topic: topic } });
      res.status(201).json({ message: "Topic updated successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getSec/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const exam = await Exam.findOne({ "section._id": id }).populate("section.questions");

    if (!exam) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Extract the specific section with populated questions
    const section = exam.section.find(sec => sec._id.toString() === id);

    res.status(200).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addQuestion/:examId/:sectionId", async (req, res) => {
  const { examId, sectionId } = req.params;
  const { questionId } = req.body; // Expecting questionId in request body

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Find the section by ID
    const section = exam.section.find(sec => sec._id.toString() === sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Add the question ID if it doesn't already exist
    if (!section.questions.includes(questionId)) {
      section.questions.push(questionId);
    } else {
      return res.status(400).json({ message: "Question already exists in the section" });
    }

    await exam.save();
    res.status(200).json({ message: "Question added successfully", section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addQuestion/:examId/:sectionId", async (req, res) => {
  const { examId, sectionId } = req.params;
  const { questionId } = req.body; // Expecting questionId in request body

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Find the section by ID
    const section = exam.section.find(sec => sec._id.toString() === sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Add the question ID if it doesn't already exist
    if (!section.questions.includes(questionId)) {
      section.questions.push(questionId);
    } else {
      return res.status(400).json({ message: "Question already exists in the section" });
    }

    await exam.save();
    res.status(200).json({ message: "Question added successfully", section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





module.exports = router;
