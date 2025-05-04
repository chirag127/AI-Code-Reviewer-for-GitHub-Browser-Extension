@echo off
REM AI Code Reviewer for GitHub - Extension Packaging Script for Windows

echo Packaging AI Code Reviewer extension...

REM Create a zip file of the extension directory
powershell Compress-Archive -Path extension\* -DestinationPath ai-code-reviewer-extension.zip -Force

echo Extension packaged as ai-code-reviewer-extension.zip
