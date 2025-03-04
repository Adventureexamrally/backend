const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/helpers");
const Question = require("../models/Question");
// Signup
router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, phone ,role});

    await user.save();

    const token = generateToken(user);
    res
      .status(201)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "User registered successfully.",
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
});
router.put('/update-user/:id', async (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter
  const { name, email, phone, password, role } = req.body; // Get fields from request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields only if they are provided in the request
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) {
      // If password is provided, hash it before updating (use bcrypt)
      const salt = await bcrypt.genSalt(10); // Generate salt
      user.password = await bcrypt.hash(password, salt); // Hash the password
    }
    if (role) user.role = role; // Update the role if provided

    // Save the updated user document to the database
    const updatedUser = await user.save();

    // Return the updated user details in the response
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/users/:userId/questions/:questionId", async (req, res) => {
  try {
    const { userId, questionId } = req.params;

    // Validate User and Question exist
    const user = await User.findById(userId);
    const question = await Question.findById(questionId);
    if (!user || !question)
      return res.status(404).json({ error: "User or Question not found" });

    // Add Question to User's attemptedQuestions
    if (!user.attemptedQuestions.includes(questionId)) {
      user.attemptedQuestions.push(questionId);
      await user.save();
    }

    res.status(200).json({ message: "Question added to user", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to add question to user" });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "attemptedQuestions"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data" });
  }
});

// Route for Forgot Password
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const user = User.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "Email not found" });
  }

  // Send email with password reset link
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const resetLink = `http://localhost:5000/reset-password/${user.id}`;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: User.email,
    subject: "Password Reset",
    text: `Click here to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email" });
    }
    res.status(200).json({ message: "Password reset link sent to email" });
  });
});

// Route for Forgot Email (by username)
router.post("/forgot-email", (req, res) => {
  const { username } = req.body;

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Username not found" });
  }

  res.status(200).json({ message: `Your email is: ${user.email}` });
});



module.exports = router;
