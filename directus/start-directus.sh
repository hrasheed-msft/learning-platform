#!/bin/bash

# Islamic Learning Platform - Directus Startup Script
# This script starts Directus with Docker Compose

echo "Starting Islamic Learning Platform - Directus Admin..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first."
    exit 1
fi

# Start containers
echo "🚀 Starting Directus containers..."
docker-compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for Directus to initialize (this may take 30-60 seconds)..."
sleep 10

# Check if containers are running
if docker ps | grep -q "islamic-learning-directus"; then
    echo ""
    echo "✅ Directus is now running!"
    echo ""
    echo "📱 Admin Panel: http://localhost:8055"
    echo "📊 Default Email: admin@example.com"
    echo "🔑 Default Password: AdminPassword123!"
    echo ""
    echo "💡 Tip: Update the password after first login!"
    echo ""
    echo "To stop Directus, run: docker-compose down"
else
    echo "❌ Failed to start Directus. Check Docker installation."
    docker-compose logs
    exit 1
fi
