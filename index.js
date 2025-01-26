

import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import fs from "fs";
import mammoth from "mammoth";
import cors from "cors";
import authMiddleware from './middlewares/authMiddleware.js'
import Document from "./models/Document.js";

import Exam from "./models/Exam.js";

import multer from "multer";
import XLSX from "xlsx";

import path from "path";


const app = express()

dotenv.config()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

//   const upload = multer({
//     storage: storage,
// fileFilter: (req, file, cb) => {
//   const fileTypes = /xlsx|xls/; // Accept only Excel files
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimeType = fileTypes.test(file.mimetype);

//   if (extname && mimeType) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only Excel files are allowed."));
//   }
// },
//   }).single("excelFile");

const upload = multer({
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //   const fileTypes = /docx/;
    //   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //   const mimeType = fileTypes.test(file.mimetype);

    //   if (extname && mimeType) {
    //     cb(null, true);
    //   } else {
    //     cb(new Error("Only DOCX files are allowed."));
    //   }
    // },
}).single("docxFile");

const PORT = 3000;

// Middleware
app.use(express.json());
connectDB()
// Routes
app.use("/auth", authRoutes);
app.use("/exams", examRoutes);
app.use("/questions", questionRoutes);
app.use("/results", resultRoutes);

// Database Connection


app.post("/upload", upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Parse the uploaded Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // Use the first sheet
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Map data to your model structure
        const exams = data.map((row) => ({
            title: row["Title"],
            description: row["Description"],
            duration: row["Duration"],
            questions: JSON.parse(row["Questions"]), // Assume questions are stored as JSON string
        }));

        // Save to MongoDB
        await Exam.insertMany(exams);

        res.status(201).json({ message: "Data successfully uploaded and stored." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process the file." });
    }
});

app.post("/uploads", upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Read the DOCX file and extract text
        const docxFilePath = req.file.path;
        const result = await mammoth.extractRawText({ path: req.file.path })
        mammoth.extractRawText({ path: req.file.path })
            .then((result) => {
                const text = result.value;

                // Assuming that the data is separated by lines and looks like the following:
                // 1. Question text
                // 2. Options (a), (b), (c), etc.
                // 3. Answer
                // 4. Explanation

                const questions = parseQuestions(text);

                // Save questions to MongoDB
                Document.insertMany(questions)
                    .then(() => {
                        res.status(200).json({ message: "Questions uploaded successfully!" });
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: "Failed to upload questions" });
                    });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Failed to parse DOCX file" });
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process the file." });
    }
});

function parseQuestions(text) {
    const questions = [];
    const lines = text.split("\n");

    // Example of parsing each question block based on line breaks
    for (let i = 0; i < lines.length; i++) {
        const questionText = lines[i].replace(/^(\d+)\.\s*/, "").trim();
        const options = [];
        let correctAnswer = "";

        // Parse options (next 5 lines)
        for (let j = i + 1; j < i + 6; j++) {
            if (lines[j].startsWith("(")) {
                const optionText = lines[j].replace(/^\([a-e]\)\s*/, "").trim();
                const isCorrect = optionText.includes("Answer");
                options.push({ text: optionText, isCorrect: isCorrect });
                if (isCorrect) {
                    correctAnswer = optionText;
                }
            }
        }

        // Parse explanation (next line after options)
        const explanation = lines[i + 6] ? lines[i + 6].trim() : "";

        questions.push({
            questionText,
            options,
            correctAnswer,
            explanation
        });

        i += 6; // Skip the lines for the next question
    }

    return questions;
}
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
