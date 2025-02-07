const express = require("express");
const router = express.Router();
const multer = require("multer");
const Question = require("../models/Question");
const xlsx = require("xlsx");
const fs = require("fs");

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

router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find()
    res.status(200).json(questions)
  } catch (error) {

  }
})


module.exports = router;
