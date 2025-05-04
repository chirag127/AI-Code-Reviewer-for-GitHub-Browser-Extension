# Getting Started with AI Code Reviewer for GitHub

This guide will help you get started with the AI Code Reviewer for GitHub browser extension.

## Prerequisites

Before you begin, make sure you have the following:

- A Gemini API key (get one from [Google AI Studio](https://ai.google.dev/))
- Node.js and npm installed
- Chrome, Edge, or Firefox browser

## Step 1: Set Up the Project

### Windows

1. Run `setup.bat` to install dependencies
2. Edit `backend/.env` to add your Gemini API key

### Linux/Mac

1. Run `./setup.sh` to install dependencies
2. Edit `backend/.env` to add your Gemini API key

## Step 2: Start the Backend Server

### Windows

Run `start-backend.bat`

### Linux/Mac

```
cd backend
npm start
```

## Step 3: Install the Extension

1. Open Chrome/Edge/Firefox and navigate to the extensions page
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Firefox: `about:debugging#/runtime/this-firefox`

2. Enable "Developer mode"

3. Click "Load unpacked" (Chrome/Edge) or "Load Temporary Add-on" (Firefox) and select the `extension` folder

## Step 4: Test the Extension

### Windows

Run `test-extension.bat` to open the test page

### Linux/Mac

Open `extension/test.html` in your browser

## Step 5: Use the Extension

1. Navigate to any GitHub pull request
2. You should see a "Review with AI" button in the PR header
3. Select your desired review mode (Full, Security, Optimization)
4. Click the button to start the review
5. Wait for the AI to analyze the code changes
6. Review the inline suggestions

## Troubleshooting

### Backend Issues

- Make sure the backend server is running on port 3000
- Check that your Gemini API key is valid and correctly set in the `.env` file
- Verify that CORS is properly configured if you're experiencing connection issues

### Extension Issues

- Make sure the extension is properly installed and enabled in your browser
- Check the browser console for any error messages
- Try reloading the extension if it's not working as expected

## Next Steps

- Customize the extension settings in the popup menu
- Explore different review modes
- Check out the code to understand how it works

For more detailed information, see the [README.md](README.md) and [INSTALLATION.md](INSTALLATION.md) files.
