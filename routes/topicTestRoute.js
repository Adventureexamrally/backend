const express = require('express');
const route = express.Router();
const TopicTest = require('../models/TopicTest');  // Your TestTopic model
const router = require('./uploadRoute');
const TopicTestContent = require('../models/TopicTestContent');



// Get all test topics
router.get('/testtopics', async (req, res) => {
  try {
    const topics = await TopicTest.find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single test topic by ID
router.get('/testtopics/:id', async (req, res) => {
  try {
    const topic = await TopicTest.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/testtopics', async (req, res) => {
    console.log(req.body);
    
  const { sub, submenus, topics } = req.body;
  const newTopic = new TopicTest({ sub, submenus, topics });

  try {
    const savedTopic = await newTopic.save();
    res.status(201).json(savedTopic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put('/testtopics/:id', async (req, res) => {
  try {
    const updatedTopic = await TopicTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(updatedTopic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/testtopics/:id', async (req, res) => {
  try {
    const deletedTopic = await TopicTest.findByIdAndDelete(req.params.id);
    if (!deletedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json({ message: 'Topic deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/test-sub/:sub', async (req, res) => {
  const { sub } = req.params;
  // const {sub} = req.query;
  console.log(sub);
  try {
    const subjects = await TopicTest.find({sub : sub});
      res.json(subjects);
      console.log(subjects);
      
  } catch (err) {
      res.status(500).send('Error fetching subjects');
  }
});
router.get('/test-sub', async (req, res) => {


  try {
    const subjects = await TopicTest.find().select('sub');
      res.json(subjects);
  } catch (err) {
      res.status(500).send('Error fetching subjects');
  }
});

//TopicTest content pages

router.post('/', async (req, res) => {
  const { title, description, subject, sub_titles } = req.body;
  console.log(req.body);
  try {
    // Check if the subject exists
    // const existingSubject = await TopicTest.findById(subject);
    // if (!existingSubject) {
    //   return res.status(400).json({ message: 'Subject not found' });
    // }
    const newTopicTest = new TopicTestContent({
      title,
      description,
      subject,
      sub_titles,
    });
    await newTopicTest.save();
    res.status(201).json(newTopicTest);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating topic test' });
  }
});

// Update a topic test by ID
router.put('/:id', async (req, res) => {
  const { title, description, subject, sub_titles } = req.body;

  try {
    const updatedTopicTest = await TopicTestContent.findByIdAndUpdate(
      req.params.id,
      { title, description, subject, sub_titles },
      { new: true }
    );

    if (!updatedTopicTest) {
      return res.status(404).json({ message: 'Topic test not found' });
    }

    res.json(updatedTopicTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating topic test' });
  }
});

// Get all topic tests
router.get('/', async (req, res) => {
  try {
    const topicTests = await TopicTestContent.find().populate('subject');
    res.json(topicTests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching topic tests' });
  }
});

// Get a topic test by ID
router.get('/:id', async (req, res) => {
  try {
    const topicTest = await TopicTest.findById(req.params.id).populate('subject');
    if (!topicTest) {
      return res.status(404).json({ message: 'Topic test not found' });
    }
    res.json(topicTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching topic test' });
  }
});


module.exports = router;