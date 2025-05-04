/**
 * AI Code Reviewer for GitHub - Extension Test Script
 * 
 * This script helps test the extension on a real GitHub PR page.
 * It opens a GitHub PR page in the default browser.
 */

const { exec } = require('child_process');
const os = require('os');

// Sample GitHub PR URL
const githubPrUrl = 'https://github.com/microsoft/vscode/pull/1';

// Function to open URL in the default browser
function openUrl(url) {
  const platform = os.platform();
  let command;

  switch (platform) {
    case 'win32':
      command = `start ${url}`;
      break;
    case 'darwin':
      command = `open ${url}`;
      break;
    default:
      command = `xdg-open ${url}`;
      break;
  }

  console.log(`Opening ${url} in your default browser...`);
  exec(command, (error) => {
    if (error) {
      console.error(`Error opening URL: ${error.message}`);
      return;
    }
    console.log('Browser opened successfully.');
    console.log('Please check that the "Review with AI" button appears in the PR header.');
  });
}

// Open the GitHub PR page
openUrl(githubPrUrl);

console.log('\nInstructions:');
console.log('1. Make sure the extension is loaded in your browser.');
console.log('2. Make sure the backend server is running (cd backend && npm start).');
console.log('3. Look for the "Review with AI" button in the PR header.');
console.log('4. Click the button to test the extension.');
console.log('5. Check the browser console for debug messages.');
