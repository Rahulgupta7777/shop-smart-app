#!/bin/bash
set -e


# Check Node.js
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

# Install backend dependencies
echo ""
echo ">> Installing backend dependencies..."
cd "$(dirname "$0")/../server"
npm install

# Set up environment file
if [ ! -f .env ]; then
    echo ">> Creating .env file..."
    cat > .env << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="shopie-dev-secret-change-in-production"
PORT=5001
EOF
    echo "   .env file created"
else
    echo "   .env file already exists, skipping"
fi

# Generate Prisma client and push schema
echo ""
echo ">> Setting up database..."
npx prisma generate
npx prisma db push

# Seed database
echo ""
echo ">> Seeding database..."
node prisma/seed.js || echo "   Seed skipped (data may already exist)"

# Install frontend dependencies
echo ""
echo ">> Installing frontend dependencies..."
cd ../client
npm install