
const mongoose = require('mongoose');


const subtitleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});


const topicTestContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }],
    sub_titles: [subtitleSchema], // Array of subtitles
  },
  { timestamps: true }
);

const TopicTestContent = mongoose.model('TopicTestContent', topicTestContentSchema);

module.exports = TopicTestContent;
