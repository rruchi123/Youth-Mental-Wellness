const ForumComment = require("../models/ForumComment");
const ForumPost = require("../models/ForumPost");

const anonymousNames = [
  "Gentle Cloud",
  "Quiet River",
  "Soft Moon",
  "Warm Breeze",
  "Bright Star",
  "Calm Wave",
  "Kind Heart",
  "Peaceful Mind",
  "Brave Soul",
  "Hopeful Light",
  "Silent Storm",
  "Tender Leaf",
  "Wise Owl",
  "Swift Fox",
  "Steady Mountain",
];

const getRandomName = () => {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
};

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const post = await ForumPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await ForumComment.create({
      post: postId,
      user: req.user._id,
      anonymousName: getRandomName(),
      content: content.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Comment added anonymously",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to add comment",
    });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await ForumComment.find({ post: postId }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch comments",
    });
  }
};

module.exports = {
  createComment,
  getCommentsForPost,
};