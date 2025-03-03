const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
          return /^https:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(v);
        },
        message: props => `${props.value} is not a valid YouTube URL!`
      }
      
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const YoutubeVideo = mongoose.model('Youtube', videoSchema);
module.exports = YoutubeVideo;
