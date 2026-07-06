const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    anonymousName: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [2000, "Post cannot exceed 2000 characters"],
    },

    category: {
      type: String,
      required: true,
      default: "general",
    },

    reactions: {
      heart: { type: Number, default: 0 },
      hug: { type: Number, default: 0 },
      same: { type: Number, default: 0 },
      strength: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const ForumPost = mongoose.model("ForumPost", forumPostSchema);

module.exports = ForumPost;