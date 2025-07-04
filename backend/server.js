require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const doubtRoutes = require("./routes/doubtRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoute");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// ✅ Middlewares
app.use(cors({
  origin: ["http://localhost:5173","https://devhelp-taupe.vercel.app"], // ✅ replace with your actual frontend URL
  credentials: true,
}));

app.use(express.json()); // preferred over body-parser
app.use(fileUpload({ useTempFiles: true }));

// ✅ Routes
app.use("/api/doubts", doubtRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Serve frontend in production (safe version)
try {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} catch (e) {
  console.log("Skipping frontend serving (dev mode)");
}

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
