# Troubleshooting Guide for AI Code Reviewer for GitHub

If you're experiencing issues with the AI Code Reviewer for GitHub browser extension, this guide will help you troubleshoot common problems.

## Extension Not Appearing on GitHub PR Pages

### Check if the extension is properly installed

1. Open your browser's extension management page:

    - Chrome: `chrome://extensions`
    - Edge: `edge://extensions`
    - Firefox: `about:addons`

2. Make sure the AI Code Reviewer extension is enabled.

3. Check for any error messages in the extension details.

### Check if the content script is loading

1. Open a GitHub PR page (e.g., https://github.com/microsoft/vscode/pull/1).

2. Open the browser's developer console (F12 or right-click > Inspect > Console).

3. Look for messages starting with "AI Code Reviewer:".

4. If you don't see any messages, try reloading the page.

### Check if the extension has the correct permissions

1. Open your browser's extension management page.

2. Find the AI Code Reviewer extension and click on "Details" or "Permissions".

3. Make sure the extension has permission to access GitHub pages.

## Review Button Not Working

### Check if the backend server is running

1. Make sure the backend server is running:

    ```
    cd backend
    npm start
    ```

2. Check if the server is accessible by opening `http://localhost:3000/health` in your browser.

3. If the server is not running or not accessible, check the server logs for errors.

### Check for connection errors

1. Open the browser's developer console.

2. Look for any error messages related to network requests.

3. Make sure the extension has permission to access `http://localhost:3000`.

## No Review Suggestions Appearing

### Check if the Gemini API key is valid

1. Make sure you have a valid Gemini API key in the `backend/.env` file.

    - You must get a valid API key from [Google AI Studio](https://ai.google.dev/)
    - See [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md) for detailed instructions

2. Test if your API key is working by visiting `http://localhost:3000/test-gemini` in your browser.

    - If you see a success message, your API key is valid
    - If you see an error message, your API key is invalid or has other issues

3. Check the backend server logs for any API-related errors.

### Check if the diff parsing is working

1. Open the browser's developer console.

2. Look for messages related to parsing diff content.

3. If there are no diff chunks found, the extension might not be able to identify the code changes.

## Debug Mode

You can enable debug mode to get more detailed logs:

1. Open the extension popup by clicking on the extension icon.

2. Enable the "Debug Mode" option.

3. Reload the GitHub PR page.

4. Check the browser console for more detailed logs.

## Common Error Messages and Solutions

### "No file elements found"

This error occurs when the extension can't find any file elements on the page. This might happen if:

-   The GitHub UI has changed
-   The PR doesn't have any file changes
-   The page is still loading

Try reloading the page or opening a different PR.

### "Error during review: Failed to fetch"

This error occurs when the extension can't connect to the backend server. Make sure:

-   The backend server is running
-   The server is accessible at `http://localhost:3000`
-   There are no network issues

### "Invalid review results"

This error occurs when the backend returns invalid results. Check:

-   The Gemini API key is valid
-   The backend server logs for any errors
-   The diff data being sent to the backend

## Still Having Issues?

If you're still experiencing issues after trying these troubleshooting steps, please:

1. Check the GitHub repository for known issues.
2. Open a new issue with detailed information about the problem.
3. Include browser console logs and backend server logs if possible.
