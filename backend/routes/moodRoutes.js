const express = require("express");
const {
  createMoodEntry,
  getMyMoodEntries,
} = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createMoodEntry);
router.get("/", protect, getMyMoodEntries);

module.exports = router;