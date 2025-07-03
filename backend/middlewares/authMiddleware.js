const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Generic token verification (used everywhere)
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Restrict to students only
exports.verifyStudent = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student") {
      return res.status(403).json({ message: "Students only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Restrict to mentors only
exports.verifyMentor = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "mentor") {
      return res.status(403).json({ message: "Access denied. Mentors only." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Protect middleware: fetch full user from DB
exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // this contains full user object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
