const express = require("express");
const {
  getExperts,
  createBooking,
  getMyBookings,
} = require("../controllers/expertController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: show demo/sample professionals
router.get("/", getExperts);

// Protected: create and view the logged-in user's bookings
router.post("/bookings", protect, createBooking);
router.get("/bookings/my", protect, getMyBookings);

module.exports = router;