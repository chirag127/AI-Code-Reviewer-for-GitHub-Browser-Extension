# Using AI Code Reviewer on GitHub Pull Requests

This guide will help you use the AI Code Reviewer extension effectively on GitHub Pull Requests.

## Prerequisites

1. Make sure the extension is installed in your browser
2. Make sure the backend server is running
3. Navigate to a GitHub Pull Request page

## Step 1: Navigate to the "Files changed" Tab

The AI Code Reviewer works best on the "Files changed" tab of a GitHub Pull Request. This tab shows all the code changes in the PR.

1. Open a GitHub Pull Request (e.g., https://github.com/Harsh98992/digitalMenu/pull/2)
2. Click on the "Files changed" tab

## Step 2: Wait for the Page to Fully Load

GitHub loads PR diffs progressively, especially for large PRs. Make sure the page is fully loaded before using the extension.

1. Wait for all file diffs to load
2. Look for the "Review with AI" button in the PR header

## Step 3: Use the Extension

Once the page is fully loaded and the "Review with AI" button is visible:

1. Select the review mode from the dropdown (Full Review, Security Only, or Optimization Tips)
2. Click the "Review with AI" button
3. Wait for the AI to analyze the code changes
4. Review the inline suggestions

## Troubleshooting

### Button Not Appearing

If the "Review with AI" button doesn't appear:

1. Make sure you're on the "Files changed" tab
2. Try refreshing the page
3. Check the browser console for any error messages (F12 or right-click > Inspect > Console)
4. Make sure the extension is enabled in your browser

### No Code Changes Found

If you get a "No code changes found to review" error:

1. Make sure you're on the "Files changed" tab
2. Make sure the PR actually contains code changes
3. Try refreshing the page and waiting for all diffs to load
4. Check the browser console for more detailed error messages

### Backend Connection Issues

If you get a "Failed to fetch" error:

1. Make sure the backend server is running
2. Check that the server is accessible at http://localhost:3000
3. Make sure the extension has permission to access the backend server

## Tips for Better Results

1. **Use on Smaller PRs**: The extension works best on PRs with fewer than 500 lines of code changes.
2. **Wait for Full Load**: Make sure the page is fully loaded before clicking the "Review with AI" button.
3. **Try Different Modes**: Different review modes focus on different aspects of the code.
4. **Check the Summary**: The extension shows a summary of all issues found in the top-right corner.

## Understanding the Results

The AI Code Reviewer provides different types of suggestions:

- **Info** (ℹ️): General suggestions for code improvement
- **Warning** (⚠️): Potential issues that might cause problems
- **Error** (❌): Serious issues that should be fixed
- **Security** (🔒): Security vulnerabilities that need attention

Each suggestion includes:
- The severity level
- A description of the issue
- A suggested fix or improvement
