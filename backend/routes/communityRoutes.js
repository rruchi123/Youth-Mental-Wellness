const express = require("express");
const {
  createPost,
  getPosts,
  reactToPost,
} = require("../controllers/communityController");
const {
  createComment,
  getCommentsForPost,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Community posts
router.post("/posts", protect, createPost);
router.get("/posts", getPosts);
router.post("/posts/:postId/reactions", protect, reactToPost);

// Comments for one post
router.get("/posts/:postId/comments", getCommentsForPost);
router.post("/posts/:postId/comments", protect, createComment);

module.exports = router;