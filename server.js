const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const postRoutes = require('./routes/post');
const likeRoutes = require('./routes/like');
const commentRoutes = require('./routes/comment');
const cleanupService = require('./services/cleanup');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Start cleanup service
cleanupService.start();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;