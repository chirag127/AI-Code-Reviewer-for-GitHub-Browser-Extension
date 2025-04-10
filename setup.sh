#!/bin/bash

# AI Code Reviewer for GitHub - Setup Script

echo "Setting up AI Code Reviewer for GitHub..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm and try again."
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit the .env file and add your Gemini API key."
fi

echo "Setup complete!"
echo "To start the backend server, run: cd backend && npm start"
echo "To install the extension, follow the instructions in INSTALLATION.md"
