const express = require("express");
const router = express.Router();
const multer = require("multer");
const Question = require("../models/Question");
const xlsx = require("xlsx");
const fs = require("fs");
const { log } = require("console");

// Setup Multer for File Uploads
// const upload = multer({ dest: "../uploads/" }); 

// Route to Upload Excel File and Insert Data into MongoDB
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     console.log("File received:", req.file);

//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const filePath = req.file.path;
//     console.log("Processing File:", filePath);

//     // Read Excel File
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     // Fix options: Convert string to array
//     data = data.map((item) => ({
//       ...item,
//       options: item.options ? JSON.parse(item.options.replace(/'/g, '"')) : [], // Convert string to array
//     }));

//     console.log("Parsed Data:", data); // Debugging line

//     // Insert into MongoDB
//     await Question.insertMany(data);

//     fs.unlinkSync(filePath); // Remove uploaded file

//     res.send("Data inserted successfully!");
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).send("Error processing file: " + error.message);
//   }
// });
router.post("/uploadquestions", async (req, res) => {
  console.log(req.body);
  try {
    const question = await Question.insertMany(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.send("data not inserted");
  }
});
router.post("/add", async (req, res) => {
  console.log(req.body);
  const { language, exam } = req.body;

  try {
    if (language === "English") {
      const newQuestion = new Question(req.body);
      await newQuestion.save();
      res.status(201).json({ message: "sucess" });
    } else if (language === "Hindi") {
      const newQuestion = new Question(req.body);
      await newQuestion.save();
      res.status(201).json({ message: "sucess" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add question" });
    console.log(error);

  }
});
router.get("/get", async (req, res) => {
  try {
    let { page, limit } = req.query;  // Get page & limit from query params

    page = parseInt(page) || 1;  // Default page = 1
    limit = parseInt(limit) || 10;  // Default limit = 10

    const skip = (page - 1) * limit;  // Calculate how many records to skip

    const questions = await Question.find()
      .select("sno question_type section status")
      .sort({ createdAt: 1 })  // Latest first
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(); // Get total number of questions

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      questions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/ques_get/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const questions = await Question.findById(id).populate("exam");
    res.status(200).json(questions);
  } catch (error) { }
});

router.get("/questions/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const question = await Question.find({ _id: id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Extract English questions
    const englishQuestions = question.English || [];

    // Check for required keys in each English question object
    const result = englishQuestions.map((q) => ({
      section: q.section || "Not Available",
      question_type: q.question_type || "Not Available",
      sub_section: q.sub_section || "Not Available",
    }));

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments(); // Counts total documents
    res.json({ count: totalQuestions });
  } catch (error) {
    console.error("Error fetching question count:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//get question by Id
router.get('/:id', (req, res) => {
  const { id } = req.params
  console.log(id);
  try {
    ques = Question.findById(id)
    res.status(200).json(ques)
  } catch (error) {

  }
})

router.get("/", async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments(); // Counts total documents
    res.json({ count: totalQuestions });
  } catch (error) {
    console.error("Error fetching question count:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put('/editQuestion/:id', async (req, res) => {
  console.log(req.params);
  const { id } = req.params
  console.log(req.body);
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: "Failed to update question" });
    console.log(error);
  }
})

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    res.status(200).json(deletedQuestion);
    console.log(deletedQuestion);
    // Delete related exam records
    // await Exam.deleteMany({ question: id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question" });
    console.log(error);
  }

  // Delete related exam records
});

// Update question status

router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: "Failed to update question status" });
    console.log(error);
  }
});

// insert new question

router.post("/insert", async (req, res) => {
  console.log(req.body);
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add question" });
    console.log(error);
  }
});
router.get("/search", async (req, res) => {
  const { search } = req.query;
  // const search = 2;
  console.log(search);
  

  // Check if search query is empty or invalid
  if (!search || search.trim().length === 0) {
    return res.status(400).json({ message: "Invalid search query" });
  }

  console.log("Search term:", search, "Type:", typeof search);

  try {
    const searchNum = Number(search); // Try to convert to number

    // Construct the search query
    const query = isNaN(searchNum)
      ? { $or: [
          { question: { $regex: search, $options: "i" } }, // Search in the 'question' field
          { topic: { $regex: search, $options: "i" } },    // Search in 'topic'
          { sub_topic: { $regex: search, $options: "i" } }, // Search in 'sub_topic'
          { ques_keywords: { $regex: search, $options: "i" } } // Search in 'ques_keywords'
        ] }
      : {
        $or: [
          { sno: searchNum },                  // Search by 'sno' number
          { question: { $regex: search, $options: "i" } }, // Search by question text
          { topic: { $regex: search, $options: "i" } }     // Search by topic
        ]
      };

    // Fetch results from the database
    const result = await Question.find(query).select("_id sno question topic sub_topic ques_keywords");

    // If no results found
    if (result.length === 0) {
      return res.status(404).json({ message: "No results found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
