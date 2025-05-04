@echo off
REM AI Code Reviewer for GitHub - Cleanup Script for Windows

echo Cleaning up AI Code Reviewer for GitHub...

REM Remove node_modules
echo Removing node_modules...
cd backend
if exist node_modules rmdir /s /q node_modules

REM Remove package-lock.json
if exist package-lock.json del package-lock.json

REM Remove any generated files
cd ..
if exist ai-code-reviewer-extension.zip del ai-code-reviewer-extension.zip

echo Cleanup complete!
