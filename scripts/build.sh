#!/bin/bash
set -e

echo "=============================="
echo "  ShopSmart - Production Build"
echo "=============================="

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Build backend (generate prisma client)
echo ""
echo ">> Building backend..."
cd "$PROJECT_ROOT/server"
npm ci --omit=dev
npx prisma generate
echo "   Backend ready"

# Build frontend
echo ""
echo ">> Building frontend..."
cd "$PROJECT_ROOT/client"
npm ci
npm run build
echo "   Frontend built to client/dist/"

echo ""
echo "=============================="
echo "  Build Complete!"
echo "=============================="
