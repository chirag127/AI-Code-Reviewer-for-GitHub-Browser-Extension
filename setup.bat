@echo off
REM AI Code Reviewer for GitHub - Setup Script for Windows

echo Setting up AI Code Reviewer for GitHub...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install npm and try again.
    exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install

REM Check if .env file exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit the .env file and add your Gemini API key.
)

echo Setup complete!
echo To start the backend server, run: cd backend ^&^& npm start
echo To install the extension, follow the instructions in INSTALLATION.md

cd ..
