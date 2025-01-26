const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // Duration in minutes
  questions: [
    {
      questionText: { type: String, required: true }, // The question text
      options: [
        {
          text: { type: String, required: true }, // The text of the option
          isCorrect: { type: Boolean, default: false }, // If this option is correct
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Exam", ExamSchema);
