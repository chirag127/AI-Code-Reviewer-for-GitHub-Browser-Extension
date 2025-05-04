# AI Code Reviewer for GitHub Browser Extension

A browser extension that enhances GitHub's PR interface by injecting inline AI code review suggestions using Gemini 2.0 Flash Lite.

## Features

-   🔍 **Inline AI Code Review Suggestions**: Injects AI-generated comments into GitHub diff views.
-   🔐 **Security Risk Detection**: Identifies and explains potential security issues.
-   ⚡ **Lightweight Review Mode**: Process only modified lines in PR with different review modes.
-   🌓 **Dark Mode Support**: Seamlessly integrates with GitHub's dark mode.

## Project Structure

```
project-root/
├── extension/           # Browser extension (Chrome, Edge, Firefox)
│   ├── manifest.json    # Extension manifest
│   ├── contentScript.js # Injects UI into GitHub PR pages
│   ├── background.js    # Background script
│   ├── popup.html       # Settings UI
│   └── styles.css       # Styling for injected UI
├── backend/             # Express.js API Server
│   ├── server.js        # Main server file
│   ├── routes/          # API routes
│   ├── services/        # Gemini integration
│   └── utils/           # Helper utilities
```

## Quick Start

### Windows

1. Clone this repository
2. Run `setup.bat` to install dependencies
3. Edit `backend/.env` to add your Gemini API key
4. Run `start-backend.bat` to start the backend server
5. Load the extension in your browser (see Installation section below)
6. Run `test-extension.bat` to verify the installation

### Linux/Mac

1. Clone this repository
2. Run `./setup.sh` to install dependencies
3. Edit `backend/.env` to add your Gemini API key
4. Start the backend server: `cd backend && npm start`
5. Load the extension in your browser (see Installation section below)

## Installation

### Extension

1. Open Chrome/Edge/Firefox and navigate to the extensions page
2. Enable developer mode
3. Click "Load unpacked" and select the `extension` folder

### Backend

1. Navigate to the `backend` folder
2. Create a `.env` file with your Gemini API key (see `.env.example`)
    - **Important**: You must get a valid Gemini API key from [Google AI Studio](https://ai.google.dev/)
    - See [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md) for detailed instructions
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Verify the API key is working by visiting `http://localhost:3000/test-gemini` in your browser

For more detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

## Usage

1. Navigate to any GitHub pull request
2. Click the "Review with AI" button in the PR header
3. Select your desired review mode (Full, Security, Optimization)
4. Wait for the AI to analyze the code changes
5. Review the inline suggestions

## Development

### Extension

The extension is built using vanilla JavaScript and follows the Manifest V3 specification.

### Backend

The backend is built with Express.js and uses the Gemini 2.0 Flash Lite API for code analysis.

### Helper Scripts

The repository includes several helper scripts to make development easier:

-   `setup.bat` / `setup.sh`: Install dependencies and set up the project
-   `start-backend.bat`: Start the backend server (Windows)
-   `test-extension.bat`: Open the test page to verify the extension (Windows)
-   `package-extension.bat`: Package the extension for distribution (Windows)

## License

MIT
