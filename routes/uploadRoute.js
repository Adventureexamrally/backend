const express = require('express');
const router = express.Router();
const { log } = require('console');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const YoutubeVideo = require('../models/Youtube');
// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Check if the upload directory exists, otherwise create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    cb(null, uploadDir); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Set the filename format: original file name + timestamp to avoid collisions
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10 MB
  }).single('photo'); // 'file' is the key from the form data
  
  // Image upload route
  router.post('/', upload, (req, res) => {
    console.log(req.body);
    
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
  
    // Generate image URL (You may need to serve images from a public directory)
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('Image uploaded successfully:', imageUrl);
    // Respond with the URL of the uploaded image
    res.json({ location: imageUrl });
    
  });
  router.get('/videos', async (req, res) => {
    try {
      const videos = await YoutubeVideo.find();
      res.json(videos);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching videos' });
    }
  });
  
  // Create a new video
  router.post('/videos', async (req, res) => {
    try {
      const { title, description, youtubeUrl } = req.body;
      const newVideo = new YoutubeVideo({ title, description, youtubeUrl });
      await newVideo.save();
      res.status(201).json(newVideo);
    } catch (err) {
      res.status(500).json({ message: 'Error creating video' });
    }
  });
  
  // Delete a video
  router.delete('/videos/:id', async (req, res) => {
    try {
      const video = await YoutubeVideo.findByIdAndDelete(req.params.id);
      if (!video) return res.status(404).json({ message: 'Video not found' });
      res.json({ message: 'Video deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting video' });
    }
  });
  

  module.exports = router