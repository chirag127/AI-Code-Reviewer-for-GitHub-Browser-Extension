/**
 * AI Code Reviewer for GitHub - Popup Script
 * 
 * This script handles the popup UI for extension settings
 */

// DOM elements
const reviewModeSelect = document.getElementById('reviewMode');
const apiEndpointInput = document.getElementById('apiEndpoint');
const enableDarkModeCheckbox = document.getElementById('enableDarkMode');
const saveButton = document.getElementById('saveButton');

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', loadSettings);

// Save settings when save button is clicked
saveButton.addEventListener('click', saveSettings);

/**
 * Load settings from storage
 */
function loadSettings() {
  chrome.storage.sync.get({
    apiEndpoint: 'http://localhost:3000/review',
    reviewMode: 'full',
    enableDarkMode: true
  }, (settings) => {
    // Populate form with settings
    reviewModeSelect.value = settings.reviewMode;
    apiEndpointInput.value = settings.apiEndpoint;
    enableDarkModeCheckbox.checked = settings.enableDarkMode;
    
    // Apply dark mode if enabled
    if (settings.enableDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}

/**
 * Save settings to storage
 */
function saveSettings() {
  const settings = {
    reviewMode: reviewModeSelect.value,
    apiEndpoint: apiEndpointInput.value,
    enableDarkMode: enableDarkModeCheckbox.checked
  };
  
  chrome.storage.sync.set(settings, () => {
    // Show save confirmation
    const saveStatus = document.createElement('div');
    saveStatus.textContent = 'Settings saved!';
    saveStatus.className = 'save-status';
    document.querySelector('.button-container').appendChild(saveStatus);
    
    // Remove confirmation after 2 seconds
    setTimeout(() => {
      saveStatus.remove();
    }, 2000);
    
    // Apply dark mode immediately if changed
    if (settings.enableDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}
