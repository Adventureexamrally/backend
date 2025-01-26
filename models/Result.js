const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", ResultSchema);
