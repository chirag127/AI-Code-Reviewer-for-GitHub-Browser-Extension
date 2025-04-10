# Contributing to AI Code Reviewer for GitHub

Thank you for considering contributing to the AI Code Reviewer for GitHub browser extension! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section.
- If not, create a new issue with a clear title and description.
- Include steps to reproduce the bug, expected behavior, and actual behavior.
- Include screenshots if applicable.

### Suggesting Enhancements

- Check if the enhancement has already been suggested in the Issues section.
- If not, create a new issue with a clear title and description.
- Explain why this enhancement would be useful to most users.

### Pull Requests

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Run tests to ensure your changes don't break existing functionality.
5. Submit a pull request with a clear description of the changes.

## Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/AI-Code-Reviewer-for-GitHub-Browser-Extension.git
   cd AI-Code-Reviewer-for-GitHub-Browser-Extension
   ```

2. Install dependencies:
   ```
   ./setup.sh
   ```

3. Start the backend server:
   ```
   cd backend
   npm start
   ```

4. Load the extension in your browser (see [INSTALLATION.md](INSTALLATION.md)).

## Project Structure

- `extension/`: Browser extension files
  - `manifest.json`: Extension manifest
  - `contentScript.js`: Injects UI into GitHub PR pages
  - `background.js`: Background script
  - `popup.html`: Settings UI
  - `styles.css`: Styling for injected UI
- `backend/`: Express.js API Server
  - `server.js`: Main server file
  - `routes/`: API routes
  - `services/`: Gemini integration
  - `utils/`: Helper utilities

## Coding Guidelines

- Follow the existing code style.
- Write clear, descriptive commit messages.
- Add comments to explain complex logic.
- Write tests for new features.

## Testing

- Test your changes in Chrome, Edge, and Firefox.
- Test with different GitHub PR layouts.
- Test with different code languages.

## Documentation

- Update documentation if you change functionality.
- Document new features.

## Questions?

If you have any questions, feel free to create an issue or contact the maintainers.
