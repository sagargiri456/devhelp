const Doubt = require("../models/Doubt");
const Notification = require("../models/Notification");
const cloudinary = require("../utils/cloudinary");

// Get all doubts
exports.getDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find();
    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new doubt
exports.addDoubt = async (req, res) => {
  try {
    
    const { title, description } = req.body;
    let imageUrl = null;
    if (req.files && req.files.screenshot) {
      console.log("req.files chal pada")
      const result = await cloudinary.uploader.upload(req.files.screenshot.tempFilePath, {
        folder: "devhelp_doubts",
      });
      imageUrl = result.secure_url;
      
    }
    const newDoubt = new Doubt({
      title,
      description,
      studentId: req.user.id,
      screenshotUrl: imageUrl,
    });
    await newDoubt.save();
    res.status(201).json(newDoubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a doubt
exports.deleteDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    await Doubt.findByIdAndDelete(id);
    res.status(200).json({ message: "Doubt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all the doubts route for the mentor view.

exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsResolved = async (req,res)=>{
  try{
    const {Id} = req.params;
    const updated = await Doubt.findByIdAndUpdate(id,{status:"resolved"},{new:true});
    res.status(200).json(updated);
  }catch(error){
    res.status(500).json({message:error.message})
  }
}

exports.markAsResolved = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Doubt.findByIdAndUpdate(id, { status: "resolved" }, { new: true });

    // ✅ Create a notification for the student
    const notification = new Notification({
      studentId: updated.studentId, // Make sure you store studentId in the Doubt model
      doubtId: updated._id,
      message: `Your doubt "${updated.title}" has been resolved.`,
    });
    await notification.save();

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.reopenDoubt = async (req, res) => {
  try {
    const { id } = req.params;

    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    if (doubt.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your doubt" });
    }

    doubt.status = "open";
    await doubt.save();

    res.status(200).json(doubt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getDoubtById = async (req, res) => {
  try {
    const { id } = req.params;
    const doubt = await Doubt.findById(id).populate("studentId", "name _id");
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }
    res.status(200).json(doubt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getDoubtsByStudent = async (req, res) => {
  try {
    const doubts = await Doubt.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(doubts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};