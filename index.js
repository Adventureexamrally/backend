import express from "express";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
// import authMiddleware from './middlewares/authMiddleware.js'
import bannerRoutes from "./routes/bannerRoute.js";
import clerkRoutes from "./routes/clerkRoute.js";
import seoRoutes from "./routes/seoRoutes.js";

const app = express()

app.use(cors())
dotenv.config()

const PORT = 3000;




// Middleware

app.use(express.json({ limit: '10mb' }));  // For JSON payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // For URL-encoded payloads

connectDB()

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/clerk", clerkRoutes);
app.use('/api', seoRoutes);



app.get('/', (req, res) =>{
    res.send('Hello from the server!');
}
)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
