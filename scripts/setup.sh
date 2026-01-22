#!/bin/bash
set -e

if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Error: Node.js 18+ is required. Found v$(node -v)"
  exit 1
fi

echo "Node.js $(node -v) detected"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo ">> Installing backend dependencies..."
cd "$PROJECT_ROOT/server"
npm install

if [ ! -f .env ]; then
  echo ""
  echo ">> No server/.env found — creating from .env.example"
  cp .env.example .env
  echo ""
  echo "   Edit server/.env before continuing:"
  echo "   - DATABASE_URL + DIRECT_URL from Supabase (Project Settings → Database → Connection pooling)"
  echo "   - SUPABASE_URL + SUPABASE_ANON_KEY from Supabase (Project Settings → API)"
  echo "   - IMAGE_PROVIDER defaults to 'pollinations' (free)"
  echo ""
  echo "   Then re-run this script."
  exit 0
fi

echo ""
echo ">> Generating Prisma client + pushing schema to Supabase..."
npx prisma generate
npx prisma db push

echo ""
echo ">> Seeding Moji products..."
node prisma/seed.js || echo "   Seed skipped (may already exist)"

echo ""
echo ">> Installing frontend dependencies..."
cd "$PROJECT_ROOT/client"
npm install

echo ""
echo "Setup done. Next steps:"
echo "  1. In the Supabase dashboard, create a public bucket named 'product-images'"
echo "  2. Add storage policies allowing anon INSERT + SELECT on bucket_id = 'product-images'"
echo "  3. Run: ./scripts/dev.sh"
