const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    specializations: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expert", expertSchema);