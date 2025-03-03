const mongoose = require('mongoose');

const TopicTestSchema = new mongoose.Schema({
  sub: { type: String, required: true },
  submenus:[ { type: String, required: true }],
  topics: [
    {
      name: { type: String, required: true }, // Topic name
      sub_topic: [String], // Array of sub-topics related to this topic
    },
  ],
});

const TopicTest = mongoose.model('TopicTest', TopicTestSchema);

module.exports = TopicTest;
