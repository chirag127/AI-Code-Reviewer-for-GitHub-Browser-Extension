@echo off
REM AI Code Reviewer for GitHub - Icon Generator Script for Windows

echo Installing Sharp library...
call npm install sharp

echo Generating icons...
node generate-icons.js

echo Done!
