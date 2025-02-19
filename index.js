import express from "express";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
// import authMiddleware from './middlewares/authMiddleware.js'
import multer from "multer";
import path from "path";
import bannerRoutes from "./routes/bannerRoute.js";
import Question from "./models/Question.js";

const app = express()

app.use(cors())
dotenv.config()
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

}).single("excelFile");

const uploads = multer({
    storage: storage,

}).single("docxFile");

const PORT = 3000;

// Middleware


app.use(express.json());
connectDB()

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/banner", bannerRoutes);


// main().catch(err=>console.log(err)
// )

// async function main(){
//    let exam = "67ac50d70a6d138318229387";
//     let English = {
//      answer: 2,
//      question: "test"
//     }
//     const newQuestion = new Question({ "exam": "67ac50d70a6d138318229387", English: English });
//    await newQuestion.save();
//    console.log(newQuestion);
// }

// main1().catch(err=>console.log(err)
// )

// async function main1(){

//   const newQuestion = await Question.findById("67ac9a36987c88e512d31818").populate('exam');
//     console.log(newQuestion);
// }

app.get('/', (req, res) =>{
    res.send('Hello from the server!');
}
)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
