/**
 * AI Code Reviewer for GitHub - Content Script
 * 
 * This script is injected into GitHub PR pages and handles:
 * 1. Detecting when a user is viewing a PR
 * 2. Injecting the "Review with AI" button
 * 3. Parsing the diff content when review is requested
 * 4. Sending diff data to the backend
 * 5. Displaying review comments inline with the code
 */

// Configuration
const API_ENDPOINT = 'http://localhost:3000/review';
const REVIEW_MODES = {
  FULL: 'full',
  SECURITY: 'security',
  OPTIMIZATION: 'optimization'
};

// State
let currentReviewMode = REVIEW_MODES.FULL;
let isReviewInProgress = false;

/**
 * Initialize the extension when the page is loaded
 */
function initialize() {
  // Check if we're on a GitHub PR page
  if (isGitHubPRPage()) {
    console.log('AI Code Reviewer: GitHub PR page detected');
    
    // Set up MutationObserver to detect when PR content is loaded
    setupMutationObserver();
    
    // Try to inject UI immediately in case the page is already loaded
    injectReviewUI();
  }
}

/**
 * Check if the current page is a GitHub PR page
 */
function isGitHubPRPage() {
  return window.location.href.match(/github\.com\/.*\/.*\/pull\/\d+/);
}

/**
 * Set up MutationObserver to detect when PR content is loaded
 */
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        // Check if the PR diff has been loaded
        if (document.querySelector('.js-diff-progressive-container')) {
          injectReviewUI();
        }
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Inject the "Review with AI" button and review mode selector
 */
function injectReviewUI() {
  // Check if UI is already injected
  if (document.querySelector('.ai-code-reviewer-button')) {
    return;
  }
  
  // Find the PR header where we'll inject our button
  const prHeader = document.querySelector('.pr-toolbar');
  if (!prHeader) {
    console.log('AI Code Reviewer: PR header not found');
    return;
  }
  
  // Create container for our UI
  const container = document.createElement('div');
  container.className = 'ai-code-reviewer-container';
  
  // Create the "Review with AI" button
  const reviewButton = document.createElement('button');
  reviewButton.className = 'ai-code-reviewer-button btn btn-sm';
  reviewButton.textContent = 'Review with AI';
  reviewButton.addEventListener('click', handleReviewButtonClick);
  
  // Create review mode selector
  const modeSelector = document.createElement('select');
  modeSelector.className = 'ai-code-reviewer-mode-selector form-select';
  
  const modes = [
    { value: REVIEW_MODES.FULL, text: 'Full Review' },
    { value: REVIEW_MODES.SECURITY, text: 'Security Only' },
    { value: REVIEW_MODES.OPTIMIZATION, text: 'Optimization Tips' }
  ];
  
  modes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode.value;
    option.textContent = mode.text;
    modeSelector.appendChild(option);
  });
  
  modeSelector.addEventListener('change', (e) => {
    currentReviewMode = e.target.value;
  });
  
  // Add elements to container
  container.appendChild(modeSelector);
  container.appendChild(reviewButton);
  
  // Add container to PR header
  prHeader.appendChild(container);
  
  console.log('AI Code Reviewer: UI injected successfully');
}

/**
 * Handle click on the "Review with AI" button
 */
async function handleReviewButtonClick() {
  if (isReviewInProgress) {
    alert('A review is already in progress. Please wait.');
    return;
  }
  
  isReviewInProgress = true;
  updateReviewButtonState(true);
  
  try {
    // Parse the diff content
    const diffData = parseDiffContent();
    
    if (diffData.length === 0) {
      alert('No code changes found to review.');
      isReviewInProgress = false;
      updateReviewButtonState(false);
      return;
    }
    
    // Send diff data to backend
    const reviewResults = await sendDiffToBackend(diffData);
    
    // Display review comments
    displayReviewComments(reviewResults);
    
  } catch (error) {
    console.error('AI Code Reviewer: Error during review:', error);
    alert(`Error during review: ${error.message}`);
  } finally {
    isReviewInProgress = false;
    updateReviewButtonState(false);
  }
}

/**
 * Update the review button state (loading/normal)
 */
function updateReviewButtonState(isLoading) {
  const button = document.querySelector('.ai-code-reviewer-button');
  if (button) {
    if (isLoading) {
      button.textContent = 'Reviewing...';
      button.disabled = true;
    } else {
      button.textContent = 'Review with AI';
      button.disabled = false;
    }
  }
}

/**
 * Parse the diff content from the GitHub PR page
 */
function parseDiffContent() {
  const diffFiles = [];
  const fileElements = document.querySelectorAll('.file');
  
  fileElements.forEach(fileElement => {
    // Get file name
    const filePathElement = fileElement.querySelector('.file-header .file-info a');
    if (!filePathElement) return;
    
    const filePath = filePathElement.textContent.trim();
    
    // Get diff chunks
    const diffChunks = [];
    const diffHunks = fileElement.querySelectorAll('.js-file-content .js-file-line-container tr.js-expandable-line');
    
    diffHunks.forEach(hunk => {
      const lineElements = hunk.querySelectorAll('td.blob-code');
      if (lineElements.length < 2) return;
      
      // Get line numbers
      const oldLineNumber = lineElements[0].getAttribute('data-line-number');
      const newLineNumber = lineElements[1].getAttribute('data-line-number');
      
      // Get code content
      const codeContent = lineElements[1].textContent.trim();
      
      diffChunks.push({
        oldLineNumber,
        newLineNumber,
        codeContent
      });
    });
    
    if (diffChunks.length > 0) {
      diffFiles.push({
        filePath,
        diffChunks
      });
    }
  });
  
  return diffFiles;
}

/**
 * Send diff data to the backend for review
 */
async function sendDiffToBackend(diffData) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        diffData,
        reviewMode: currentReviewMode
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('AI Code Reviewer: Error sending diff to backend:', error);
    throw error;
  }
}

/**
 * Display review comments inline with the code
 */
function displayReviewComments(reviewResults) {
  if (!reviewResults || !reviewResults.suggestions) {
    console.error('AI Code Reviewer: Invalid review results');
    return;
  }
  
  // Clear any existing review comments
  clearExistingReviewComments();
  
  // Process each suggestion
  reviewResults.suggestions.forEach(suggestion => {
    const { filePath, lineNumber, message, severity } = suggestion;
    
    // Find the corresponding line in the diff
    const lineElement = findLineElement(filePath, lineNumber);
    if (!lineElement) {
      console.warn(`AI Code Reviewer: Could not find line ${lineNumber} in file ${filePath}`);
      return;
    }
    
    // Create and insert comment
    insertReviewComment(lineElement, message, severity);
  });
  
  console.log('AI Code Reviewer: Review comments displayed');
}

/**
 * Clear any existing review comments
 */
function clearExistingReviewComments() {
  const existingComments = document.querySelectorAll('.ai-code-reviewer-comment');
  existingComments.forEach(comment => comment.remove());
}

/**
 * Find the DOM element for a specific line in a file
 */
function findLineElement(filePath, lineNumber) {
  // Find the file element
  const fileElements = document.querySelectorAll('.file');
  let targetFileElement = null;
  
  for (const fileElement of fileElements) {
    const filePathElement = fileElement.querySelector('.file-header .file-info a');
    if (filePathElement && filePathElement.textContent.trim() === filePath) {
      targetFileElement = fileElement;
      break;
    }
  }
  
  if (!targetFileElement) return null;
  
  // Find the line element
  const lineElements = targetFileElement.querySelectorAll('.js-file-line');
  for (const lineElement of lineElements) {
    const lineNumberElement = lineElement.querySelector('.blob-num');
    if (lineNumberElement && lineNumberElement.getAttribute('data-line-number') === String(lineNumber)) {
      return lineElement;
    }
  }
  
  return null;
}

/**
 * Insert a review comment after a specific line
 */
function insertReviewComment(lineElement, message, severity) {
  // Create comment element
  const commentElement = document.createElement('tr');
  commentElement.className = `ai-code-reviewer-comment ai-severity-${severity || 'info'}`;
  
  // Create comment content
  const commentContent = document.createElement('td');
  commentContent.className = 'ai-code-reviewer-comment-content';
  commentContent.setAttribute('colspan', '3');
  commentContent.textContent = message;
  
  // Add icon based on severity
  const iconSpan = document.createElement('span');
  iconSpan.className = `ai-code-reviewer-icon ai-severity-${severity || 'info'}-icon`;
  commentContent.prepend(iconSpan);
  
  // Add comment content to comment element
  commentElement.appendChild(commentContent);
  
  // Insert comment after the line
  lineElement.parentNode.insertBefore(commentElement, lineElement.nextSibling);
}

// Initialize the extension
initialize();
