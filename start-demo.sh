#!/bin/bash

# One-command demo startup script
# Starts all services and opens the browser

set -e

echo "🚀 Starting SqueezeWeasel Demo..."
echo ""

# Check if Docker is installed
if ! command -v docker > /dev/null 2>&1; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker daemon is accessible (may need sudo or docker group)
DOCKER_CMD="docker"
if ! docker ps > /dev/null 2>&1; then
    # Try with sudo
    if sudo docker ps > /dev/null 2>&1; then
        echo "⚠️  Docker requires sudo. Using sudo for Docker commands..."
        DOCKER_CMD="sudo docker"
    else
        echo "🐳 Docker daemon not accessible. Checking status..."

        # Check if Docker is installed via snap
        if snap list docker > /dev/null 2>&1; then
            echo "   Docker is installed via snap. Checking service..."
            if snap services docker | grep -q "active" 2>/dev/null; then
                echo "   Docker service is active but you may need sudo or docker group access."
                echo ""
                echo "   To fix permissions, run:"
                echo "   sudo usermod -aG docker $USER"
                echo "   Then log out and back in, or run: newgrp docker"
                echo ""
                echo "   Or use sudo for now: sudo docker ps"
                DOCKER_CMD="sudo docker"
            else
                echo "   Starting Docker via snap..."
                echo "   (You may be prompted for sudo password)"
                sudo snap start docker 2>/dev/null || true
                sleep 3
                DOCKER_CMD="sudo docker"
            fi
        # Try systemd service
        elif systemctl list-unit-files 2>/dev/null | grep -q docker.service; then
            echo "   Starting Docker with systemctl..."
            echo "   (You may be prompted for sudo password)"
            sudo systemctl start docker 2>/dev/null || true
            sleep 2
            DOCKER_CMD="sudo docker"
        else
            echo "❌ Docker is not accessible and could not be started automatically."
            echo ""
            echo "   Please ensure Docker is running:"
            if snap list docker > /dev/null 2>&1; then
                echo "   sudo snap start docker"
            else
                echo "   sudo systemctl start docker"
            fi
            echo ""
            echo "   Or add yourself to docker group (then log out/in):"
            echo "   sudo usermod -aG docker $USER"
            exit 1
        fi
    fi
fi

# Test Docker access
if ! $DOCKER_CMD ps > /dev/null 2>&1; then
    echo "❌ Cannot access Docker. Please check Docker is running and you have permissions."
    exit 1
fi

echo "✅ Docker is running"

# Start PostgreSQL if not running
if ! $DOCKER_CMD ps | grep -q squeezeweasel-postgres; then
    echo "📦 Starting PostgreSQL..."
    $DOCKER_CMD compose -f docker-compose.demo.yml up -d
    echo "⏳ Waiting for database to be ready..."
    sleep 5
fi

# Check if database is seeded
cd apps/api
if ! pnpm tsx -e "import { prisma } from './src/db/client.js'; prisma.agent.findFirst({ where: { slug: 'squeezeweasel-radar' } }).then(() => process.exit(0)).catch(() => process.exit(1))" 2>/dev/null; then
    echo "🌱 Seeding database..."
    pnpm seed-demo
fi
cd ../..

echo ""
echo "✅ Database ready!"
echo ""
echo "Starting services..."
echo ""

# Start API in background
echo "🔧 Starting API server..."
DEMO_MODE=true pnpm --filter api dev > /tmp/squeezeweasel-api.log 2>&1 &
API_PID=$!

# Start Worker in background
echo "⚙️  Starting Worker..."
DEMO_MODE=true pnpm --filter worker dev > /tmp/squeezeweasel-worker.log 2>&1 &
WORKER_PID=$!

# Start Web in background
echo "🌐 Starting Web app..."
NEXT_PUBLIC_DEMO_MODE=true PORT=3002 pnpm --filter web dev > /tmp/squeezeweasel-web.log 2>&1 &
WEB_PID=$!

# Wait for services to start
echo ""
echo "⏳ Waiting for services to start..."
sleep 8

# Check if services are running
if ! curl -s http://localhost:4000/healthz > /dev/null 2>&1; then
    echo "⚠️  API might not be ready yet. Check logs: tail -f /tmp/squeezeweasel-api.log"
fi

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Demo URL: http://localhost:3002/radar"
echo ""
echo "📊 Service logs:"
echo "   API:    tail -f /tmp/squeezeweasel-api.log"
echo "   Worker: tail -f /tmp/squeezeweasel-worker.log"
echo "   Web:    tail -f /tmp/squeezeweasel-web.log"
echo ""
echo "🛑 To stop all services: pkill -f 'pnpm.*dev'"
echo ""

# Try to open browser (works on Linux/Mac)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3002/radar 2>/dev/null &
elif command -v open > /dev/null; then
    open http://localhost:3002/radar 2>/dev/null &
fi

# Keep script running
wait $API_PID $WORKER_PID $WEB_PID

