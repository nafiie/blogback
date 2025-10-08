const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const comment = await Comment.create({
      post: postId,
      user: req.userId,
      text,
    });
    // Add comment to post's comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }
    comment.text = text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

