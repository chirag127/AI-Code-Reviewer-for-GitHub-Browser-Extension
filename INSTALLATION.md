# Installation Guide for AI Code Reviewer for GitHub

This guide will help you set up and install the AI Code Reviewer for GitHub browser extension.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Gemini API key (get one from [Google AI Studio](https://ai.google.dev/))
- Chrome, Edge, or Firefox browser

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ALLOWED_ORIGINS=chrome-extension://,moz-extension://,edge-extension://
   ```
   Replace `your_gemini_api_key_here` with your actual Gemini API key.

4. Start the backend server:
   ```
   npm start
   ```
   The server should start on port 3000 (or the port you specified in the `.env` file).

## Extension Setup

### Chrome/Edge

1. Open Chrome/Edge and navigate to `chrome://extensions` (Chrome) or `edge://extensions` (Edge).

2. Enable "Developer mode" by toggling the switch in the top-right corner.

3. Click "Load unpacked" and select the `extension` directory from this project.

4. The extension should now be installed and visible in your browser's toolbar.

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.

2. Click "Load Temporary Add-on" and select the `manifest.json` file in the `extension` directory.

3. The extension should now be installed and visible in your browser's toolbar.

## Testing the Installation

1. Open the `extension/test.html` file in your browser to verify that the extension and backend are working correctly.

2. Navigate to any GitHub pull request page to see the extension in action.

## Troubleshooting

### Backend Issues

- Make sure the backend server is running on the correct port.
- Check that your Gemini API key is valid and correctly set in the `.env` file.
- Verify that CORS is properly configured if you're experiencing connection issues.

### Extension Issues

- Make sure the extension is properly installed and enabled in your browser.
- Check the browser console for any error messages.
- Try reloading the extension if it's not working as expected.

## Development

For development purposes, you can use the following commands:

- Start the backend server in development mode:
  ```
  cd backend
  npm run dev
  ```

- Make changes to the extension files and reload the extension in your browser to see the changes.

## Building for Production

For production use, you may want to package the extension:

### Chrome/Edge

1. Zip the contents of the `extension` directory.
2. Upload the zip file to the Chrome Web Store or Edge Add-ons store.

### Firefox

1. Use the `web-ext` tool to build the extension:
   ```
   npm install -g web-ext
   cd extension
   web-ext build
   ```
2. Upload the generated `.zip` file to the Firefox Add-ons store.
