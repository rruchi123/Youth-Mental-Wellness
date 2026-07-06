const mongoose = require("mongoose");

const suggestedSongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      default: "",
      trim: true,
    },
    mood: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const musicMoodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    songTitle: {
      type: String,
      required: [true, "Song title is required"],
      trim: true,
      maxlength: [200, "Song title cannot exceed 200 characters"],
    },

    artist: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Artist name cannot exceed 200 characters"],
    },

    whyResonates: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Reflection cannot exceed 1000 characters"],
    },

    detectedMood: {
      type: String,
      trim: true,
      default: "",
    },

    aiInsight: {
      type: String,
      trim: true,
      default: "",
    },

    suggestedSongs: {
      type: [suggestedSongSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const MusicMood = mongoose.model("MusicMood", musicMoodSchema);

module.exports = MusicMood;