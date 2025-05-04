/**
 * AI Code Reviewer for GitHub - Gemini AI Service
 *
 * This module handles interaction with the Gemini AI API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY;
let genAI;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.error('Error initializing Gemini API:', error);
}

// Review mode prompts
const REVIEW_PROMPTS = {
  full: `
    You are an expert code reviewer analyzing GitHub PR code changes.
    Provide specific, actionable feedback on:
    1. Code quality issues
    2. Potential bugs or logic flaws
    3. Security vulnerabilities
    4. Performance optimizations
    5. Readability and maintainability

    For each issue, include:
    - The specific line or code segment with the issue
    - A clear explanation of the problem
    - A suggested improvement or fix
    - Severity level (info, warning, error, security)

    Keep suggestions concise and focused on the most important issues.
  `,
  security: `
    You are a security-focused code reviewer analyzing GitHub PR code changes.
    Focus exclusively on identifying security vulnerabilities such as:
    1. Injection flaws (SQL, NoSQL, command injection, etc.)
    2. Authentication/authorization issues
    3. Sensitive data exposure
    4. XSS, CSRF, and other web vulnerabilities
    5. Insecure dependencies or API usage
    6. Input validation issues

    For each security issue, include:
    - The specific line or code segment with the vulnerability
    - A clear explanation of the security risk
    - A suggested secure implementation
    - Risk severity (low, medium, high, critical)

    Only report security concerns, ignore other code quality issues.
  `,
  optimization: `
    You are a performance optimization expert analyzing GitHub PR code changes.
    Focus exclusively on identifying performance issues such as:
    1. Inefficient algorithms or data structures
    2. Redundant computations
    3. Memory leaks or excessive memory usage
    4. Unnecessary network requests or database queries
    5. Rendering performance issues
    6. Resource-intensive operations that could be optimized

    For each performance issue, include:
    - The specific line or code segment with the issue
    - A clear explanation of the performance impact
    - A suggested optimization with expected improvement
    - Priority level (low, medium, high)

    Only report performance concerns, ignore other code quality or security issues.
  `
};

/**
 * Get review suggestions from Gemini AI
 *
 * @param {Object} diffData - Parsed diff data
 * @param {string} reviewMode - Review mode (full, security, optimization)
 * @returns {Array} - Array of review suggestions
 */
async function getReviewSuggestions(diffData, reviewMode = 'full') {
  if (!genAI) {
    throw new Error('Gemini API not initialized. Check your API key.');
  }

  try {
    // Select the appropriate model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });

    // Get the prompt for the selected review mode
    const prompt = REVIEW_PROMPTS[reviewMode] || REVIEW_PROMPTS.full;

    // Prepare the context with diff data
    const context = prepareContext(diffData, reviewMode);

    // Generate review suggestions
    const result = await model.generateContent(`
      ${prompt}

      Here is the code to review:
      ${context}

      Provide your review suggestions in the following JSON format:
      [
        {
          "filePath": "path/to/file.js",
          "lineNumber": 42,
          "message": "Your suggestion here",
          "severity": "info|warning|error|security"
        }
      ]

      Only respond with valid JSON. Do not include any other text.
    `);

    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', text);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error getting review suggestions from Gemini:', error);
    throw error;
  }
}

/**
 * Prepare context for the AI with diff data
 *
 * @param {Object} diffData - Parsed diff data
 * @param {string} reviewMode - Review mode
 * @returns {string} - Formatted context
 */
function prepareContext(diffData, reviewMode) {
  let context = '';

  diffData.forEach(file => {
    context += `File: ${file.filePath}\n\n`;

    file.chunks.forEach(chunk => {
      context += `@@ ${chunk.header} @@\n`;

      chunk.changes.forEach(change => {
        const prefix = change.type === 'add' ? '+' :
                      change.type === 'remove' ? '-' : ' ';
        context += `${prefix} ${change.content} (Line ${change.lineNumber})\n`;
      });

      context += '\n';
    });

    context += '\n---\n\n';
  });

  return context;
}

module.exports = {
  getReviewSuggestions
};
