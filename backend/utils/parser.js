/**
 * AI Code Reviewer for GitHub - Parser Utilities
 * 
 * This module handles parsing and formatting diff data
 */

/**
 * Parse diff data from the extension into a format suitable for the AI
 * 
 * @param {Array} diffData - Raw diff data from the extension
 * @returns {Array} - Parsed diff data
 */
function parseDiffForAI(diffData) {
  return diffData.map(file => {
    // Group diff chunks by file
    const chunks = [];
    let currentChunk = null;
    
    file.diffChunks.forEach(chunk => {
      // If this is a new chunk header, create a new chunk
      if (chunk.codeContent.startsWith('@@')) {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        
        currentChunk = {
          header: chunk.codeContent.trim(),
          changes: []
        };
      } 
      // Otherwise, add the line to the current chunk
      else if (currentChunk) {
        const lineContent = chunk.codeContent;
        const lineNumber = chunk.newLineNumber || chunk.oldLineNumber;
        
        // Determine if this is an added, removed, or context line
        let type = 'context';
        if (lineContent.startsWith('+')) {
          type = 'add';
        } else if (lineContent.startsWith('-')) {
          type = 'remove';
        }
        
        currentChunk.changes.push({
          type,
          content: lineContent.substring(1), // Remove the +/- prefix
          lineNumber
        });
      }
    });
    
    // Add the last chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return {
      filePath: file.filePath,
      chunks
    };
  });
}

/**
 * Format review suggestions for the frontend
 * 
 * @param {Array} suggestions - Raw suggestions from the AI
 * @returns {Array} - Formatted suggestions
 */
function formatSuggestions(suggestions) {
  return suggestions.map(suggestion => {
    // Map severity levels to standardized values
    let severity = suggestion.severity.toLowerCase();
    
    // Normalize severity values
    if (['low', 'info', 'information'].includes(severity)) {
      severity = 'info';
    } else if (['medium', 'warn', 'warning'].includes(severity)) {
      severity = 'warning';
    } else if (['high', 'critical', 'error'].includes(severity)) {
      severity = 'error';
    } else if (['security', 'vulnerability'].includes(severity)) {
      severity = 'security';
    } else {
      severity = 'info'; // Default
    }
    
    return {
      ...suggestion,
      severity
    };
  });
}

module.exports = {
  parseDiffForAI,
  formatSuggestions
};
