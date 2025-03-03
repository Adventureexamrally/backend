const express = require("express");
const multer = require("multer");
const authRoutes = require("./routes/authRoutes.js");
const examRoutes = require("./routes/examRoutes.js");
const questionRoutes = require("./routes/questionRoutes.js");
const resultRoutes = require("./routes/resultRoutes.js");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const bannerRoutes = require("./routes/bannerRoute.js");
const clerkRoutes = require("./routes/clerkRoute.js");
const seoRoutes = require("./routes/seoRoutes.js");
const path = require("path");
const fs = require("fs");
const { fileURLToPath } = require('url');  // Use CommonJS require syntax
const { dirname } = require('path');  // Use CommonJS require syntax
const uploadRoutes = require("./routes/uploadRoute.js");
const PakageRoutes = require("./routes/pakageRoute.js");
const topicTestRoutes = require("./routes/topicTestRoute.js");

// Your other code...


dotenv.config();
const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup CORS
app.use(cors());

// Setup static file serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload configuration using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads/images');
    
    // Check if the 'images' directory exists, otherwise create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Set the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    // Set the filename format (timestamp + file extension to avoid collisions)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(express.json({ limit: '10mb' }));  // For JSON payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // For URL-encoded payloads

// Connect to the database
connectDB();

// Image upload route (handling POST requests)
app.post('/api/uploads/images', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Respond with the URL of the uploaded image
  const imageUrl = `${process.env.BASE_URL}/uploads/images/${req.file.filename}`;
  res.json({ location: imageUrl });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/clerk", clerkRoutes);
app.use('/api', seoRoutes);
app.use('/api/uploads',uploadRoutes);
app.use('/api/packages',PakageRoutes);
app.use('/api/topic-test',topicTestRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
