const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    exam:{
     type: mongoose.Schema.Types.ObjectId, ref: "Exam" 
    },
    Hindi: [
      {
        answer: { type: String, required: true },
        attempted: { type: String, default: "false" },
        common_data: String,
        correct: { type: String, required: true },
        currentTimer: { type: Number, default: 0 },
        explanation: String,
        id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        incorrect: String,
        language: { type: String, default: "English" },
        level_type: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        minus_mark: { type: Number, default: 0.25 },
        options: { type: [String], required: true },
        plus_mark: { type: Number, default: 1 },
        question: { type: String, required: true },
        question_type: String,
        section: Number,
        sno: String,
        status: { type: String, default: "active" },
        sub_type: String,
        video_solution_link: String,
        wordcounts: { type: Number, default: 0 },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],
    English: [
      {
        answer: { type: String, required: true },
        attempted: { type: String, default: "false" },
        common_data: String,
        correct: { type: String, required: true },
        currentTimer: { type: Number, default: 0 },
        explanation: String,
        id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        incorrect: String,
        language: { type: String, default: "English" },
        level_type: String,
        minus_mark: { type: String, default: "0" },
        options: { type: [String], required: true },
        plus_mark: { type: String, default: "1" },
        ques_keywords: String,
        question: { type: String, required: true },
        question_type: String,
        section: String,
        skipped: { type: String, default: "false" },
        sno: String,
        status: { type: String, default: "active" },
        sub_section: String,
        video_solution_link: String,
        wordcounts: { type: Number, default: 0 },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
