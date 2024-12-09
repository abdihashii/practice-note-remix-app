#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🚀 Setting up Notes App development environment..."

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists bun; then
    echo -e "${RED}❌ Bun is not installed. Please install it from https://bun.sh${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install it from https://www.docker.com/${NC}"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
bun install

# Set up environment files
echo "Setting up environment files..."

# Server environment
if [ ! -f "apps/server/.env" ]; then
    cp apps/server/.env.example apps/server/.env
    echo -e "${GREEN}✓ Created apps/server/.env${NC}"
fi

# Client environment
if [ ! -f "apps/client/.env" ]; then
    cp apps/client/.env.example apps/client/.env
    echo -e "${GREEN}✓ Created apps/client/.env${NC}"
fi

# Build shared packages
echo "Building shared packages..."
bun run build:types

# Start PostgreSQL
echo "Starting PostgreSQL..."
bun run postgres:up

# Generate migrations if needed
if [ ! "$(ls -A apps/server/drizzle)" ]; then
    echo "Generating database migrations..."
    cd apps/server && bun run db:generate
    cd ../..
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "To start development:"
echo "1. Run: bun run dev"
echo "2. Visit: http://localhost:5173 for the client"
echo "3. The server will be running at: http://localhost:8000" 