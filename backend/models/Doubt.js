const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  screenshotUrl: {
    type: String, // ✅ optional
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("Doubt", doubtSchema);

