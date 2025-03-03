const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const TestTopic = require("../models/TopicTest");
const Question = require("../models/Question");

// Create a new exam
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { title, description, duration, questions } = req.body;
    const exam = new Exam({ title, description, duration, questions });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create exam." });
  }
});

// Get all exams
router.get("/get", async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Default to page 1, limit 5 per page
  const exams = await Exam.find()
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalExams = await Exam.countDocuments();
  res.json({
    exams,
    totalPages: Math.ceil(totalExams / limit),
    currentPage: Number(page),
  });
});
router.get("/getAllExam", async (req, res) => {
  try {
    const exams = await Exam.find().select("_id title exam_name show_name  ");
    res.json(exams);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get exams." });
  }
});

router.put("/:id/UpdateExam", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const exam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
    await exam.save();
    res.status(201).json({ message: "updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create exam." });
  }
});
router.put("/update/:id", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const exam = await Exam.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    await exam.save();
    res.status(201).json({ message: "updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update exam." });
  }
});

router.post("/Many", async (req, res) => {
  console.log(req.body);
  try {
    // Using insertMany directly on the Exam model
    const exams = await Exam.insertMany(req.body);
    res.status(201).json(exams);
  } catch (error) {
    console.error("Error inserting exams:", error);
    res.status(500).json({ error: "Failed to create exams." });
  }
});
router.post("/AddExam", async (req, res) => {
  console.log(req.body);
  const { id } = req.body; // Ensure `id` is present

  try {
    // Correct the query for finding an exam
    const exam = await Exam.findOne({ id: id });
    if (exam) {
      return res.status(200).json({ message: "exists" });
    }

    // Creating a new exam
    const newExam = await Exam.create(req.body);
    res.status(201).json({ message: "created" });
  } catch (error) {
    console.error("Error inserting exam:", error);
    res.status(500).json({ error: "Failed to create exam." });
  }
});

router.get("/:id/exams-with-questions", async (req, res) => {
  console.log(req.params.id);

  const { id } = req.params;

  try {
    const result = await Exam.aggregate([
      {
        $lookup: {
          from: "questions", // Name of the Question collection
          localField: "id",
          foreignField: "id",
          as: "questions",
        },
      },
      // { $unwind: "$questions" }, // Flattens the array
      { $match: { "questions.id": parseInt(id) } }, // Filters only hard questions
    ]);

    res.json(result).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Aggregation failed" });
  }
});

// Search Route for Exam
router.get("/search", async (req, res) => {
  const { search } = req.query;

  if (!search || search.trim().length === 0) {
    return res.status(400).json({ message: "Invalid search query" });
  }

  console.log("Search term:", search, "Type:", typeof search);

  try {
    const searchNum = Number(search); // Convert to number if possible

    const query = isNaN(searchNum)
      ? { title: { $regex: search, $options: "i" } } // If not a number, search in text fields
      : {
        $or: [
          { id: searchNum },
          { title: { $regex: search, $options: "i" } },
        ],
      }; // Search in both fields

    const result = await Exam.find(query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// test topic Add route
router.post("/addtopic", async (req, res) => {
  const { sub, topics } = req.body;  // Assuming 'topics' is an array

  try {
    // Ensure topics is an array of objects, each with a 'name' field
    if (!Array.isArray(topics) || topics.some(t => !t.name)) {
      return res.status(400).json({ message: "Each topic must have a 'name' field." });
    }

    // Find the subject document (by 'sub')
    let result = await TestTopic.findOne({ sub: sub });

    // If the subject does not exist, create it
    if (!result) {
      result = new TestTopic({
        sub: sub,
        topics: topics.map(topic => ({
          name: topic.name,  // Ensure 'name' is correctly passed
          sub_topics: topic.sub_topics || []
        }))
      });

      await result.save();  // Save the new document
      return res.status(201).json({ message: "New subject and topics added successfully" });
    }

    // If the subject exists, add the new topics
    result.topics = [...result.topics, ...topics]; // Append new topics to existing ones
    await result.save();  // Save the updated document
    return res.status(200).json({ message: "Topics added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while adding the topics" });
  }
});

// Search Topic 

async function searchTopics(sub, topic, sub_topic) {
  try {
    // Build the search query dynamically based on the provided parameters
    const searchQuery = {};

    if (sub) {
      searchQuery.sub = { $regex: sub, $options: 'i' }; // Search for sub
    }

    if (topic) {
      searchQuery['topics.name'] = { $regex: topic, $options: 'i' }; // Search for topic name
    }

    if (sub_topic) {
      searchQuery['topics.sub_topic'] = { $elemMatch: { $regex: sub_topic, $options: 'i' } }; // Search for sub-topic
    }

    // Perform the search with the constructed query
    const results = await TestTopic.find(searchQuery).exec();

    // Refine results to include only matching topics
    const refinedResults = results.map(doc => {
      const filteredTopics = doc.topics.filter(topicObj => {
        // Check if topic name or sub_topic matches the search parameters
        const topicMatches = topicObj.name.match(new RegExp(topic, 'i'));
        const subTopicMatches = topicObj.sub_topic.some(sub => sub.match(new RegExp(sub_topic, 'i')));

        return (sub && topicMatches) || (topic && subTopicMatches) || (sub_topic && subTopicMatches);
      });

      return {
        sub: doc.sub,
        topics: filteredTopics
      };
    });

    return refinedResults;
  } catch (err) {
    console.error('Error during search:', err);
    return [];
  }
}



router.get("/searchsubtopic", async (req, res) => {
  // const { sub, topic, sub_topic } = req.query;
  const { sub, topic, sub_topic } = req.params// Get the query parameter from the URL

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const results = await searchTopics(sub, topic, sub_topic);
  res.status(200).json({ results });
});

router.get("/getExam/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    // Fetch the exam and populate questions in the sections
    const exam = await Exam.findOne({ "_id": id })
      .populate({
        path: 'section.questions',  // Populate the 'questions' array inside 'section'
        model: 'Question'           // Ensure it uses the 'Question' model
      });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Return the populated exam data (including all questions in sections)
    res.status(200).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




router.get("/getSec/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const exam = await Exam.findOne({ "section._id": id }).populate("section.questions");

    if (!exam) {
      return res.status(404).json({ message: "Section not found" });
    }
 
    // Extract the specific section with populated questions
    const section = exam.section.find(sec => sec._id.toString() === id);
    
    res.status(200).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addQuestion/:examId/:sectionId", async (req, res) => {
  const { examId, sectionId } = req.params;
  const { questionId } = req.body; // Expecting questionId in request body

  console.log(questionId);
  
//  return res.status(200).json({ message: "Question added successfully" });
  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Find the section by ID
    const section = exam.section.find(sec => sec._id.toString() === sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Add the question ID if it doesn't already exist
    if (!section.questions.includes(questionId)) {
      section.questions.push(questionId);
    } else {
      return res.status(400).json({ message: "Question already exists in the section" });
    }

    await exam.save();
    res.status(200).json({ message: "Question added successfully", section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/removeQuestion/:examId/:sectionId", async (req, res) => {
  const { examId, sectionId } = req.params;
  const { questionId } = req.body; // Expecting questionId in request body

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Find the section by ID
    const section = exam.section.find(sec => sec._id.toString() === sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Check if the question exists in the section's questions array
    const questionIndex = section.questions.indexOf(questionId);
    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found in this section" });
    }

    // Remove the question from the section
    section.questions.splice(questionIndex, 1); // Remove the question at the found index

    await exam.save(); // Save the updated exam document
    res.status(200).json({ message: "Question removed successfully", section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



//Add Question from section

router.post("/addQuestionFromSection/:examId/:id", async (req, res) => {
  const { examId, id } = req.params;
  console.log(req.params);

  console.log(req.body);


  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Find the section by ID
    const section = exam.section.find(sec => sec._id.toString() === id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Step 1: Store the new question in the Question model
    const newQuestion = new Question(req.body);

    // Save the new question to the database
    await newQuestion.save();

    // Step 2: Update the exam's section to include the new question's ID
    section.questions.push(newQuestion._id);

    // Save the updated exam document
    await exam.save();

    // Return the updated section with the new question
    res.status(200).json({ message: "Question added successfully", section });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Question from section

router.delete("/deleteQuestionFromSection/:examId/:sectionId/:questionId", async (req, res) => {
  const { examId, sectionId, questionId } = req.params;
  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    // Find the section by ID
    const section = exam.section.find(sec => sec._id.toString() === sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    // Remove the question ID from the section's questions array
    section.questions = section.questions.filter(qId => qId.toString() !== questionId);
    // Save the updated exam document
    await exam.save();
    // Return the updated section after deleting the question
    res.status(200).json({ message: "Question deleted successfully", section });

  } catch (error) {

  }
})

module.exports = router;
