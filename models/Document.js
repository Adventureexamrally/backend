const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
    text: { type: String,  }, // Option text (e.g., "Thiruchitrambalam")
    isCorrect: { type: Boolean, default: false }, // Whether the option is correct
  });

const DocumentSchema = new mongoose.Schema({
    questionText: { type: String,  }, // The question itself
    options: [OptionSchema], // Array of options with text and isCorrect flag
    Answer: { type: String,  }, // Correct answer text
    explanation: { type: String }, // Explanation of the answer
    createdAt: { type: Date, default: Date.now }, // Timestamp when question is created
});

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
