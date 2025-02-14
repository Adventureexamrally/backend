const mongoose = require("mongoose");

const testTopicSchema = new mongoose.Schema({
    sub: { type: String, required: true },
    topic: [{ type: String, required: true }],
});

module.exports = mongoose.model("testTopic", testTopicSchema);
