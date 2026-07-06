const express = require("express");
const {
  analyzeMusicMood,
  getMyMusicMoodHistory,
} = require("../controllers/musicController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze", protect, analyzeMusicMood);
router.get("/history", protect, getMyMusicMoodHistory);

module.exports = router;