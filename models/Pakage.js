const mongoose = require('mongoose');
const packageSchema = new mongoose.Schema({
    type: String,
    exams: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Exam" }
    ],
    name: String,
    amount: Number,
    discountedAmount: Number,
    expiryDays: Number,
    photo: String,
    description: String,
    link_name: String,
    content: [
        { type: mongoose.Schema.Types.ObjectId, ref: "PakageContent" }
    ],
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE",
    }
});
const Pakage = mongoose.model("Pakage", packageSchema);

module.exports = Pakage;