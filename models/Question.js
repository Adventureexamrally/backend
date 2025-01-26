const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Question", QuestionSchema);
