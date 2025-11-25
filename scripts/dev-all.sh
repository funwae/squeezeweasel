#!/bin/bash

# Start all services in development mode
# This script starts the API, worker, and web app concurrently

echo "Starting SqueezeWeasel development environment..."

# Start API
pnpm --filter api dev &
API_PID=$!

# Start Worker
pnpm --filter worker dev &
WORKER_PID=$!

# Start Web
pnpm --filter web dev &
WEB_PID=$!

echo "All services started!"
echo "API: http://localhost:4000"
echo "Web: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all processes
wait $API_PID $WORKER_PID $WEB_PID

