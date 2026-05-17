@echo off
REM Islamic Learning Platform - Directus Startup Script (Windows)
REM This script starts Directus with Docker Compose

echo Starting Islamic Learning Platform - Directus Admin...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available. Please update Docker Desktop.
    exit /b 1
)

REM Start containers
echo 🚀 Starting Directus containers...
docker-compose up -d

REM Wait for containers to be ready
echo ⏳ Waiting for Directus to initialize (this may take 30-60 seconds)...
timeout /t 10 /nobreak

REM Check if containers are running
docker ps | findstr "islamic-learning-directus" >nul
if %errorlevel% equ 0 (
    echo.
    echo ✅ Directus is now running!
    echo.
    echo 📱 Admin Panel: http://localhost:8055
    echo 📊 Default Email: admin@example.com
    echo 🔑 Default Password: AdminPassword123!
    echo.
    echo 💡 Tip: Update the password after first login!
    echo.
    echo To stop Directus, run: docker-compose down
) else (
    echo.
    echo ❌ Failed to start Directus. Check Docker Desktop is running.
    docker-compose logs
    exit /b 1
)
