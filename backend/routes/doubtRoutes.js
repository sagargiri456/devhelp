const express = require("express");
const { getDoubts,markAsResolved, getAllDoubts, addDoubt, deleteDoubt, reopenDoubt, getDoubtById } = require("../controllers/doubtControllers");
const { verifyMentor, protect, verifyStudent, verifyToken } = require("../middlewares/authMiddleware");
const { getDoubtsByStudent } = require("../controllers/doubtController");

const router = express.Router();

router.get("/", getDoubts);
router.post("/", verifyToken, addDoubt);
router.get("/:id",getDoubtById)
router.delete("/:id", deleteDoubt);
router.get("/all", verifyMentor, getAllDoubts);
router.patch("/resolve/:id", verifyMentor, markAsResolved);
router.patch("reopen/:id",verifyStudent,reopenDoubt)
router.get("/my", protect, getDoubtsByStudent);

module.exports = router;
