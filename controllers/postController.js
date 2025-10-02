const Post = require('../models/post');
const cloudinary = require('../config/cloudinary');

// Create Post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  let imageUrl = '';
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog-posts',
        resource_type: 'image'
      });
      imageUrl = result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      if (err.response && err.response.body) {
        console.error('Cloudinary response body:', err.response.body);
      }
      return res.status(500).json({ error: 'Image upload failed', details: err.message, stack: err.stack });
    }
  }
  const post = await Post.create({
    title,
    content,
    image: imageUrl,
    author: req.userId
  });
  res.status(201).json(post);
};

// Get All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    // Attach comment count to each post
    const postsWithCommentCount = posts.map(post => {
      const postObj = post.toObject();
      postObj.commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
      return postObj;
    });
    res.json(postsWithCommentCount);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' }
      });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin only: Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    const updates = { ...req.body };
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'blog-posts',
          resource_type: 'image'
        });
        updates.image = result.secure_url;
      } catch (err) {
        return res.status(500).json({ error: 'Image upload failed', details: err.message });
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error updating post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting post' });
  }
};

