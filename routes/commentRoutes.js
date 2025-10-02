const express = require('express');
const { 
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.post('/', authMiddleware, addComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;