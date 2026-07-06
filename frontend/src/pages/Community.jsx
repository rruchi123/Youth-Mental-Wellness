import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ForumCard, { categoryConfig } from "@/components/community/ForumCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Shield,
  Users,
  Loader2,
  ArrowLeft,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import API_BASE_URL from "@/api";

export default function Community() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [error, setError] = useState("");

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
  });

  const loadCommentCount = async (postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}/comments`
      );
      const data = await response.json();

      if (response.ok) {
        setCommentCounts((previous) => ({
          ...previous,
          [postId]: data.count || 0,
        }));
      }
    } catch (error) {
      console.error("Unable to load comment count:", error);
    }
  };

  const loadPosts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const query =
        selectedCategory !== "all"
          ? `?category=${encodeURIComponent(selectedCategory)}`
          : "";

      const response = await fetch(
        `${API_BASE_URL}/community/posts${query}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load community posts.");
        return;
      }

      const loadedPosts = data.posts || [];
      setPosts(loadedPosts);

      loadedPosts.forEach((post) => {
        loadCommentCount(post._id);
      });
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const openPost = async (post) => {
    setSelectedPost(post);
    setComments([]);
    setIsLoadingComments(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${post._id}/comments`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load comments.");
        return;
      }

      setComments(data.comments || []);
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/Login");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError("Please add both a title and content.");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/community/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPost),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create post.");
        return;
      }

      setIsCreateOpen(false);
      setNewPost({
        title: "",
        content: "",
        category: "general",
      });

      await loadPosts();
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateComment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/Login");
      return;
    }

    if (!newComment.trim() || !selectedPost) {
      return;
    }

    setIsCommenting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${selectedPost._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newComment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to add comment.");
        return;
      }

      setNewComment("");

      const commentsResponse = await fetch(
        `${API_BASE_URL}/community/posts/${selectedPost._id}/comments`
      );

      const commentsData = await commentsResponse.json();

      if (commentsResponse.ok) {
        setComments(commentsData.comments || []);
        setCommentCounts((previous) => ({
          ...previous,
          [selectedPost._id]: commentsData.count || 0,
        }));
      }
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleReact = async (postId, reaction) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/Login");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/community/posts/${postId}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reaction }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to add reaction.");
        return;
      }

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? { ...post, reactions: data.reactions }
            : post
        )
      );
    } catch (error) {
      setError("Unable to connect to the server. Please try again.");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const search = searchQuery.trim().toLowerCase();

    if (!search) {
      return true;
    }

    const title = String(post.title || "").toLowerCase();
    const content = String(post.content || "").toLowerCase();
    const category = String(post.category || "").toLowerCase();
    const anonymousName = String(post.anonymousName || "").toLowerCase();

    return (
      title.includes(search) ||
      content.includes(search) ||
      category.includes(search) ||
      anonymousName.includes(search)
    );
  });

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-rose-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => {
              setSelectedPost(null);
              setComments([]);
              setError("");
            }}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Community</span>
          </button>

          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl">
                  {categoryConfig[selectedPost.category]?.icon || "💬"}
                </div>

                <div>
                  <span className="font-medium text-slate-700">
                    {selectedPost.anonymousName}
                  </span>
                  <p className="text-sm text-slate-500">
                    {formatDistanceToNow(new Date(selectedPost.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-slate-800 mb-4">
                {selectedPost.title}
              </h1>

              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-slate-700">
              Responses ({comments.length})
            </h3>

            {isLoadingComments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No responses yet. Be the first to offer support.
              </p>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="text-sm">💭</span>
                        </div>

                        <span className="text-sm font-medium text-slate-600">
                          {comment.anonymousName}
                        </span>

                        <span className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      <p className="text-slate-700">{comment.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {error && (
            <p className="mb-4 text-center text-sm text-red-600">{error}</p>
          )}

          <Card>
            <CardContent className="p-5">
              <div className="flex gap-3">
                <Textarea
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Share your support or thoughts..."
                  className="flex-1 min-h-[80px] resize-none"
                />

                <Button
                  onClick={handleCreateComment}
                  disabled={!newComment.trim() || isCommenting}
                  className="bg-gradient-to-r from-violet-500 to-violet-600 self-end"
                >
                  {isCommenting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </Link>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
              <Users className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">
                Anonymous Community
              </span>
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              You're Not Alone
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Connect with others who understand. Share your story, find
              support, and know that someone else has been there too.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-teal-500" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-700">
              Your privacy is protected
            </h3>
            <p className="text-sm text-slate-500">
              All posts are anonymous. Your real identity is never shared.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search posts..."
              className="pl-12 h-12 rounded-xl border-slate-200"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>

              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.icon} {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Share Your Story
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Share Your Story</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Topic
                  </label>

                  <Select
                    value={newPost.category}
                    onValueChange={(value) =>
                      setNewPost({ ...newPost, category: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.icon} {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Title
                  </label>

                  <Input
                    value={newPost.title}
                    onChange={(event) =>
                      setNewPost({ ...newPost, title: event.target.value })
                    }
                    placeholder="Give your post a title..."
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    What's on your mind?
                  </label>

                  <Textarea
                    value={newPost.content}
                    onChange={(event) =>
                      setNewPost({ ...newPost, content: event.target.value })
                    }
                    placeholder="Share as much or as little as you'd like..."
                    className="min-h-[150px] rounded-xl resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button
                  onClick={handleCreatePost}
                  disabled={
                    !newPost.title.trim() ||
                    !newPost.content.trim() ||
                    isCreating
                  }
                  className="w-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl"
                >
                  {isCreating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Post Anonymously
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && !isCreateOpen && (
          <p className="mb-6 text-center text-sm text-red-600">{error}</p>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">
              No posts yet. Be the first to share your story.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ForumCard
                key={post._id}
                post={{
                  ...post,
                  id: post._id,
                  anonymous_name: post.anonymousName,
                  created_date: post.createdAt,
                }}
                onClick={() => openPost(post)}
                onReact={(postId, reaction) => handleReact(postId, reaction)}
                commentCount={commentCounts[post._id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}