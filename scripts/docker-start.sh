#!/bin/sh
set -e

echo "Starting ShopSmart..."

# Initialize database
cd /app/server
npx prisma db push --accept-data-loss 2>/dev/null || true

# Start backend in background
node src/index.js &

# Serve frontend
serve -s /app/client/dist -l 3000

wait
