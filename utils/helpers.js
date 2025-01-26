const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    "secretKey", // Replace "secretKey" with a strong secret key.
    { expiresIn: "1h" }
  );
};

module.exports = { hashPassword, comparePassword, generateToken };
