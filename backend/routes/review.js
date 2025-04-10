/**
 * AI Code Reviewer for GitHub - Review Routes
 * 
 * This module handles the review endpoint and processing logic
 */

const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini');
const parserUtil = require('../utils/parser');

/**
 * POST /review
 * 
 * Receives code diff data and returns AI review suggestions
 */
router.post('/', async (req, res, next) => {
  try {
    const { diffData, reviewMode } = req.body;
    
    if (!diffData || !Array.isArray(diffData) || diffData.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Missing or invalid diffData'
      });
    }
    
    // Parse the diff data into a format suitable for the AI
    const parsedDiff = parserUtil.parseDiffForAI(diffData);
    
    // Get review suggestions from Gemini
    const suggestions = await geminiService.getReviewSuggestions(parsedDiff, reviewMode);
    
    // Return the suggestions
    res.status(200).json({
      suggestions
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
