@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. Get it from https://nodejs.org ^(LTS^) & pause & exit /b)
if not exist ".env" echo No .env file yet - Glimmer will run in DEMO mode.
node server.js
pause
