@echo off
REM Resume Builder - Complete Startup Script
REM This script starts both backend and frontend in separate windows

echo.
echo ======================================
echo  AI Resume Builder - Full Setup
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ NPM is not installed!
    echo Please reinstall Node.js
    pause
    exit /b 1
)

echo ✅ Node.js and NPM are installed
echo.

REM Set paths
set SERVER_DIR=%CD%\server
set CLIENT_DIR=%CD%\client

REM Check if directories exist
if not exist "%SERVER_DIR%" (
    echo ❌ Server directory not found
    pause
    exit /b 1
)

if not exist "%CLIENT_DIR%" (
    echo ❌ Client directory not found
    pause
    exit /b 1
)

echo.
echo 📋 Before starting, make sure:
echo    1. You have created .env file in server directory
echo    2. Firebase credentials are added to server\.env
echo    3. Internet connection is available
echo.

REM Check .env file
if not exist "%SERVER_DIR%\.env" (
    echo ❌ Server .env file not found!
    echo.
    echo Please create server\.env with:
    echo   FIREBASE_PROJECT_ID=your_value
    echo   FIREBASE_PRIVATE_KEY=your_value
    echo   ... (see .env.example for all fields)
    echo.
    pause
    exit /b 1
)

echo ✅ Server .env file found
echo.

REM Install dependencies if node_modules don't exist
if not exist "%SERVER_DIR%\node_modules" (
    echo 📦 Installing server dependencies...
    cd /d "%SERVER_DIR%"
    call cmd /c npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install server dependencies
        pause
        exit /b 1
    )
)

if not exist "%CLIENT_DIR%\node_modules" (
    echo 📦 Installing client dependencies...
    cd /d "%CLIENT_DIR%"
    call cmd /c npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install client dependencies
        pause
        exit /b 1
    )
)

echo.
echo ✅ All dependencies installed!
echo.
echo 🚀 Starting Resume Builder...
echo.

REM Start backend in new window
echo Starting Backend Server on http://localhost:5000
timeout /t 2 >nul
start "Resume Builder - Backend" cmd /k "cd /d "%SERVER_DIR%" && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 >nul

REM Start frontend in new window
echo Starting Frontend on http://localhost:5173
start "Resume Builder - Frontend" cmd /k "cd /d "%CLIENT_DIR%" && npm run dev"

echo.
echo ======================================
echo  Services Starting...
echo ======================================
echo.
echo 📝 Backend:   http://localhost:5000
echo 🖥️  Frontend:  http://localhost:5173
echo.
echo Frontend will open in a few seconds...
echo.
echo Press Ctrl+C in either window to stop that service
echo.
timeout /t 3 >nul

REM Open browser to frontend
start http://localhost:5173

echo.
echo ✅ Resume Builder is ready!
echo.
