#!/bin/bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Start backend
echo ">> Starting backend on port 5001..."
cd "$PROJECT_ROOT/server"
npm run dev &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

# Start frontend
echo ">> Starting frontend..."
cd "$PROJECT_ROOT/client"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend running at  http://localhost:5001"
echo "Frontend running at http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Trap to kill both on exit
trap "echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
