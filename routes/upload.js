const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /xlsx|xls/; // Accept only Excel files
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed."));
    }
  },
}).single("excelFile"); // Ensure the field name matches your HTML form

// Route to handle file upload
router.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "Multer Error: " + err.message });
    } else if (err) {
      return res.status(400).json({ error: "Error: " + err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    res.status(200).json({ message: "File uploaded successfully.", file: req.file });
  });
});

module.exports = router;
