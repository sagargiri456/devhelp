const express = require("express");
const { getDoubts,markAsResolved, getDoubtsByStudent, getAllDoubts, addDoubt, deleteDoubt, reopenDoubt, getDoubtById } = require("../controllers/doubtControllers");
const { verifyMentor, protect, verifyStudent, verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getDoubts);
router.post("/", verifyToken, addDoubt);
router.get("/my", protect, getDoubtsByStudent);
router.get("/:id",getDoubtById)
router.delete("/:id", deleteDoubt);
router.get("/all", verifyMentor, getAllDoubts);
router.patch("/resolve/:id", verifyMentor, markAsResolved);
router.patch("reopen/:id",verifyStudent,reopenDoubt)


module.exports = router;
