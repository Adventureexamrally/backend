const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/]
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/] 
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  attemptedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});


module.exports = mongoose.model("User", UserSchema);
