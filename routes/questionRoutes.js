const express = require("express");
const router = express.Router();
const multer = require("multer");
const Question = require("../models/Question");
const xlsx = require("xlsx");
const fs = require("fs");
const { log } = require("console");

// Setup Multer for File Uploads
const upload = multer({ dest: "../uploads/" }); // Ensure this folder exists

// Route to Upload Excel File and Insert Data into MongoDB
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const filePath = req.file.path;
    console.log("Processing File:", filePath);

    // Read Excel File
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Fix options: Convert string to array
    data = data.map((item) => ({
      ...item,
      options: item.options ? JSON.parse(item.options.replace(/'/g, '"')) : [], // Convert string to array
    }));

    console.log("Parsed Data:", data); // Debugging line

    // Insert into MongoDB
    await Question.insertMany(data);

    fs.unlinkSync(filePath); // Remove uploaded file

    res.send("Data inserted successfully!");
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).send("Error processing file: " + error.message);
  }
});


router.post('/uploadquestions', async (req, res) => {
  console.log(req.body);
  try {
    const question = await Question.insertMany(req.body)
    res.status(201).json(question)
  } catch (error) {
    res.send("data not inserted")
  }

})
router.post("/add", async (req, res) => {
  console.log(req.body);
  const { language, exam } = req.body

  try {
 
    if (language === "English") {
      const newQuestion = new Question({ exam: exam, English: req.body });
      await newQuestion.save();
      res.status(201).json({"message":"sucess"})
    } else if (language === "Hindi") {
      const newQuestion = new Question({ exam: exam, Hindi: req.body });
      await newQuestion.save();
      res.status(201).json({"message":"sucess"})
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add question" });
  }
});

router.get('/get', async (req, res) => {
  try {
    const questions = await Question.find()
    res.status(200).json(questions)
  } catch (error) {

  }
})
router.get('/ques_get/:id', async (req, res) => {

  const { id } = req.params 
  console.log(id);
  
  try {
    const questions = await Question.find({exam:id})
    res.status(200).json(questions)
  } catch (error) {

  }
})

router.get("/questions/:id", async (req, res) => {
  const { id } = req.params
  console.log(id);
  
  try {
      const question = await Question.find({_id : id});

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



module.exports = router;
