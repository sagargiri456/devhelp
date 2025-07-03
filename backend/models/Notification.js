const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doubtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doubt",
    required: true,
  },
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
