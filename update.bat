@echo off
REM AI Code Reviewer for GitHub - Update Script for Windows

echo Updating AI Code Reviewer for GitHub...

REM Pull latest changes from git
git pull

REM Update backend dependencies
echo Updating backend dependencies...
cd backend
call npm install

echo Update complete!
echo To restart the backend server, run: start-backend.bat
echo You may need to reload the extension in your browser.

cd ..
