const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'mening_maxfiy_kalitim_123';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token yuborilmagan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Yaroqsiz token" });
  }
};

module.exports = verifyToken;