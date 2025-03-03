const mongoose = require('mongoose');


const faqSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const subtitlesSchema = new mongoose.Schema({
  title: String,
  description: String
});


const PakageContentSchema = new mongoose.Schema({
  title: String,
  description: String,
  packageId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pakage" }],
  faqs: [faqSchema],
  sub_titles:[subtitlesSchema],
});

const PakageContent = mongoose.model('PakageContent', PakageContentSchema);

module.exports = PakageContent;
