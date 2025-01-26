// const express = require("express");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/authRoutes");
// const examRoutes = require("./routes/examRoutes");
// const questionRoutes = require("./routes/questionRoutes");
// const resultRoutes = require("./routes/resultRoutes");
// const connectDB = require("./config/db");
// const app = express();

import express from "express";

import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authMiddleware from './middlewares/authMiddleware.js'


const app = express()

dotenv.config()

const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/exams", examRoutes);
app.use("/questions", questionRoutes);
app.use("/results", resultRoutes);

// Database Connection

connectDB()

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
