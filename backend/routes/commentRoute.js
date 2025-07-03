const express = require("express");
const router = express.Router();
const { createComment, getComments } = require("../controllers/commentController");
const { verifyMentor } = require("../middlewares/authMiddleware");

router.post("/:doubtId", verifyMentor, createComment); 
router.get("/:doubtId", getComments);                    

module.exports = router;