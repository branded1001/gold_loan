// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

const isValuer = (req, res, next) => {
  if (req.user.role !== 'valuer') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { auth, isAdmin, isValuer };