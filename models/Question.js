const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    exam: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }],
    answer: { type: Number, required: true },
    common_data: String,
    correct: String,
    explanation: String,
    language: { type: String, default: "English" },
    level_type: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    minus_mark: { type: Number, default: 0.25 },
    options: { type: [String], required: true },
    plus_mark: { type: Number, default: 1 },
    ques_keywords: String,
    question: { type: String, required: true },
    question_type: {
      type: String,

    },
    question_mode: {
      type: String,

    },
    sector: {
      type: String,
    },
    sno: { type: Number, unique: true, default: 0 },
    status: { type: String, default: 'active' },
    subject: {
      type: String,
    },
    video_solution_link: {
      type: String,
    },
    topic: { type: String },
    sub_topic: { type: String },
    words_limit: { type: Number, default: 250 },
  },
  { timestamps: true }
);

// ✅ **Ensure `sno` is a valid Number before saving**
QuestionSchema.pre("validate", async function (next) {
  if (!this.sno || isNaN(this.sno) || this.sno <= 0) { // Validate sno
    try {
      const lastQuestion = await mongoose
        .model("Question")
        .findOne()
        .sort({ sno: -1 })
        .select("sno");

      this.sno = lastQuestion && !isNaN(lastQuestion.sno) ? lastQuestion.sno + 1 : 1;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
