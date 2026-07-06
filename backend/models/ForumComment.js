const mongoose = require("mongoose");

const forumCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumPost",
      required: true,
    },

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

    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    reactions: {
      heart: { type: Number, default: 0 },
      hug: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const ForumComment = mongoose.model("ForumComment", forumCommentSchema);

module.exports = ForumComment;