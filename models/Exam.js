const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    length_test: {
      type: String,
      enum: ["sectional_test", "topic_test", "full_length_test"],
      default: "full_length_test",
    },
    topic_test: {
      subject: String,
      sub_menu: String,
      topic: String,
    },
    test_type: {
      type: String,
      enum: ["Prelims", "Mains", "PQY"],
      default: "None",
    },
    time: {
      type: String,
      enum: ["Composite", "Sectional"],
      default: "Composite",
    },

    test_name: { type: String },
    show_name: { type: String },
    exam_name: { type: String },

    duration: { type: Number, required: true, min: 1 },
    status: { type: String, default: "active" },

    id: { type: Number, required: true },

    section: [
      {
        name: { type: String, required: true },
        t_question: { type: Number, required: true },
        t_time: { type: Number, required: true, min: 1 },
        t_mark: { type: Number, required: true },
        plus_mark: { type: Number, required: true },
        minus_mark: { type: Number, required: true },
        cutoff_mark: { type: Number, required: true },
        questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
        s_order: { type: Number, default: 0 }, 
      },
    ],

    live_date: { type: Date, default: null },
    t_questions: { type: Number, required: true },
    t_cutoff: { type: Number, required: true }, // ✅ Fixed typo

    english_status: { type: Boolean, default: false },
    hindi_status: { type: Boolean, default: false },

    english_date: { type: Date, default: null },
    hindi_date: { type: Date, default: null },

    mode_type: { type: String },
    result_type: { type: String },

    q_level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    orders: { type: Number, default: 0 },
    video_solution: { type: String },

    lock_section: { type: Boolean, default: false },
    lang_lock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
