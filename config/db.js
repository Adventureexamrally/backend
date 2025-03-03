const mongoose = require("mongoose");
// import mongoose from "mongoose";

const dotenv = require("dotenv");

dotenv.config()
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
export default connectDB;
