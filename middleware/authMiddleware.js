// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token mavjud emas" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Yaroqsiz token" });
  }
}

module.exports = authenticateUser;

