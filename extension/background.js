/**
 * AI Code Reviewer for GitHub - Background Script
 * 
 * This script runs in the background and handles:
 * 1. Extension initialization
 * 2. Communication with the content script
 * 3. Storage of user preferences
 */

// Default settings
const DEFAULT_SETTINGS = {
  apiEndpoint: 'http://localhost:3000/review',
  reviewMode: 'full',
  enableDarkMode: true
};

// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
    console.log('AI Code Reviewer: Default settings initialized');
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SETTINGS') {
    // Return settings to content script
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
      sendResponse({ settings });
    });
    return true; // Required for async response
  }
  
  if (request.type === 'SAVE_SETTINGS') {
    // Save new settings
    chrome.storage.sync.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true; // Required for async response
  }
});

// Listen for browser action click (extension icon)
chrome.action.onClicked.addListener((tab) => {
  // Only activate on GitHub PR pages
  if (tab.url.match(/github\.com\/.*\/.*\/pull\/\d+/)) {
    // Send message to content script to toggle review panel
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_REVIEW_PANEL' });
  } else {
    // Show notification that this is only for GitHub PR pages
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'AI Code Reviewer',
      message: 'This extension only works on GitHub Pull Request pages.'
    });
  }
});
