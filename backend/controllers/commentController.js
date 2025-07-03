const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const { message } = req.body;
    const mentorId = req.user.id; 

    const comment = new Comment({ doubtId, mentorId, message });
    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const comments = await Comment.find({ doubtId }).populate("mentorId", "name");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
