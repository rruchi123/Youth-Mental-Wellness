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

const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const post = await ForumPost.create({
      user: req.user._id,
      anonymousName: getRandomName(),
      title: title.trim(),
      content: content.trim(),
      category: category || "general",
    });

    return res.status(201).json({
      success: true,
      message: "Post shared anonymously",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create post",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "all" ? { category } : {};

    const posts = await ForumPost.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch posts",
    });
  }
};

const reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reaction } = req.body;

    const allowedReactions = ["heart", "hug", "same", "strength"];

    if (!allowedReactions.includes(reaction)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction",
      });
    }

    const post = await ForumPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.reactions[reaction] += 1;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Reaction added",
      reactions: post.reactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to add reaction",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  reactToPost,
};