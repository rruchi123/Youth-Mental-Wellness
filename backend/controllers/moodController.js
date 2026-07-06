const MoodEntry = require("../models/MoodEntry");

const createMoodEntry = async (req, res) => {
  try {
    const { mood, intensity, activities, note, journalType } = req.body;

    if (!mood || !mood.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a mood",
      });
    }

    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      mood: mood.trim(),
      intensity: intensity || 3,
      activities: Array.isArray(activities) ? activities : [],
      note: note ? note.trim() : "",
      journalType: journalType || "quick_note",
    });

    return res.status(201).json({
      success: true,
      message: "Mood check-in saved successfully",
      moodEntry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to save mood check-in",
    });
  }
};

const getMyMoodEntries = async (req, res) => {
  try {
    const moodEntries = await MoodEntry.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: moodEntries.length,
      moodEntries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch mood check-ins",
    });
  }
};

module.exports = { createMoodEntry, getMyMoodEntries };