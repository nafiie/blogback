require('dotenv').config();
const multer = require('multer');
const path = require('path');
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGODB_URI not found in .env');
  process.exit(1);
}
const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db'); 
 // Your MongoDB connection file
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Database connection
connectDb(); 

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json()); 

// Routes
app.use('/api/users', userRoutes);     // User registration/login/profile
app.use('/api/posts', postRoutes);     // Blog post CRUD operations
app.use('/api/comments', commentRoutes); // Post comments

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  }
  next(err);
});
// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});