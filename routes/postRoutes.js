const express = require('express');
const { 
  createPost, 
  getAllPosts,
  getPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload'); // Multer setup

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/', getAllPosts);
router.get('/:id', getPost);
router.put('/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;