const mongoose = require("mongoose");

const moodEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mood: {
      type: String,
      required: [true, "Mood is required"],
      trim: true,
    },

    intensity: {
      type: Number,
      required: true,
      min: [1, "Intensity must be between 1 and 5"],
      max: [5, "Intensity must be between 1 and 5"],
      default: 3,
    },

    activities: {
      type: [String],
      default: [],
    },

    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note cannot exceed 500 characters"],
      default: "",
    },

    journalType: {
      type: String,
      enum: ["quick_note", "reflection"],
      default: "quick_note",
    },
  },
  {
    timestamps: true,
  }
);

const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);

module.exports = MoodEntry;