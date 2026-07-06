const Expert = require("../models/Expert");
const Booking = require("../models/Booking");

const demoExperts = [
  {
    name: "Dr. Ananya Sharma",
    title: "Counselling Psychologist",
    specializations: ["Anxiety", "Stress Management", "Academic Pressure"],
    experience: "8 years experience",
    about:
      "Supports young adults with anxiety, stress, and academic pressure.",
    image: "",
    isDemo: true,
  },
  {
    name: "Dr. Rohan Mehta",
    title: "Clinical Psychologist",
    specializations: ["Depression", "Self-Esteem", "Life Transitions"],
    experience: "10 years experience",
    about:
      "Focuses on emotional wellbeing, confidence, and life transitions.",
    image: "",
    isDemo: true,
  },
  {
    name: "Dr. Priya Nair",
    title: "Relationship Counsellor",
    specializations: ["Relationships", "Family Issues", "Grief"],
    experience: "7 years experience",
    about:
      "Helps people navigate relationships, family concerns, and grief.",
    image: "",
    isDemo: true,
  },
];

const seedDemoExperts = async () => {
  const count = await Expert.countDocuments();

  if (count === 0) {
    await Expert.insertMany(demoExperts);
  }
};

const getExperts = async (req, res) => {
  try {
    await seedDemoExperts();

    const experts = await Expert.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      experts,
    });
  } catch (error) {
    console.error("Get experts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load experts.",
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { expertId, date, timeSlot, notes, isAnonymous } = req.body;

    if (!expertId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Expert, date, and time are required.",
      });
    }

    const expert = await Expert.findById(expertId);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found.",
      });
    }

    const alreadyBooked = await Booking.findOne({
      expert: expertId,
      date,
      timeSlot,
      status: "confirmed",
    });

    if (alreadyBooked) {
      return res.status(409).json({
        success: false,
        message: "This time slot has already been booked. Please choose another.",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      expert: expertId,
      date,
      timeSlot,
      notes: notes ? notes.trim() : "",
      isAnonymous: isAnonymous !== false,
    });

    return res.status(201).json({
      success: true,
      message: "Demo booking confirmed successfully.",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create booking.",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("expert", "name title specializations")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings.",
    });
  }
};

module.exports = {
  getExperts,
  createBooking,
  getMyBookings,
};