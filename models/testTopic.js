const mongoose = require('mongoose');

const TestTopicSchema = new mongoose.Schema({
  sub: { type: String, required: true },
  topics: [
    {
      name: { type: String, required: true }, // Topic name
      sub_topic: [String], // Array of sub-topics related to this topic
    },
  ],
});

const TestTopic = mongoose.model('TestTopic', TestTopicSchema);

module.exports = TestTopic;
