const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  seoData: {
    title: String,
    description: String,
    keywords: String
  }
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
