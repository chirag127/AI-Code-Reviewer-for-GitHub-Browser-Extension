/**
 * AI Code Reviewer for GitHub - Backend Server
 * 
 * This Express.js server handles:
 * 1. Receiving code diff data from the extension
 * 2. Processing the diff with Gemini AI
 * 3. Returning review suggestions
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reviewRoutes = require('./routes/review');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/review', reviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Code Reviewer backend running on port ${PORT}`);
});
