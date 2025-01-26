const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);
  

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "secretKey"); // Replace "secretKey" with a strong secret key.
    req.user = decoded;
    console.log(req.user);
    
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
