const express = require("express");
const { sendChatMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendChatMessage);

module.exports = router;