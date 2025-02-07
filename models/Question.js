const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  answer: String,
  attempted: String,
  common_data: String,
  correct: String,
  currentTimer: Number,
  explanation: String,
  id: String,
  incorrect: String,
  language: String,
  level_type: String,
  minus_mark: String,
  options:Array,
  plus_mark: String,
  ques_keywords: String,
  question: String,
  question_type: String,
  section: String,
  skipped: String,
  sno: String,
  status: String,
  sub_section: String,
  video_solution_link: String,
  wordcounts: Number,
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
