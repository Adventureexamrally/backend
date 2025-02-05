const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  id:Number,
  duration: { type: Number}, // Duration in minutes
  sections:[
   
  ],
});

module.exports = mongoose.model("Exam", ExamSchema);
