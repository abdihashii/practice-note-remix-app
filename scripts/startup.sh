 #!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to handle errors
handle_error() {
    local exit_code=$1
    local error_msg=$2
    echo -e "${RED}❌ Error: ${error_msg}${NC}"
    echo -e "${YELLOW}Setup failed. Please fix the error and try again.${NC}"
    exit $exit_code
}

# Function to run command with error handling
run_command() {
    local cmd=$1
    local error_msg=$2
    
    echo "Running: $cmd"
    if ! eval "$cmd"; then
        handle_error 1 "$error_msg"
    fi
}

echo "🚀 Setting up Notes App development environment..."

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists bun; then
    handle_error 1 "Bun is not installed. Please install it from https://bun.sh"
fi

if ! command_exists docker; then
    handle_error 1 "Docker is not installed. Please install it from https://www.docker.com"
fi

# Check if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
    handle_error 1 "Docker daemon is not running. Please start Docker and try again."
fi

# Install dependencies
echo "Installing dependencies..."
run_command "bun install" "Failed to install dependencies"

# Set up environment files
echo "Setting up environment files..."

# Server environment
if [ ! -f "apps/server/.env" ]; then
    if [ ! -f "apps/server/.env.example" ]; then
        handle_error 1 "Server .env.example file not found"
    fi
    run_command "cp apps/server/.env.example apps/server/.env" "Failed to create server .env file"
    echo -e "${GREEN}✓ Created apps/server/.env${NC}"
fi

# Client environment
if [ ! -f "apps/client/.env" ]; then
    if [ ! -f "apps/client/.env.example" ]; then
        handle_error 1 "Client .env.example file not found"
    fi
    run_command "cp apps/client/.env.example apps/client/.env" "Failed to create client .env file"
    echo -e "${GREEN}✓ Created apps/client/.env${NC}"
fi

# Build shared packages
echo "Building shared packages..."
run_command "bun run build:types" "Failed to build shared packages"

# Start PostgreSQL with timeout
echo "Starting PostgreSQL..."
run_command "bun run postgres:up" "Failed to start PostgreSQL container"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
RETRIES=30
until docker exec notes-app-postgres-db pg_isready -U myuser -d mydatabase || [ $RETRIES -eq 0 ]; do
    echo "Waiting for PostgreSQL to be ready... ($RETRIES attempts remaining)"
    RETRIES=$((RETRIES-1))
    sleep 1
done

if [ $RETRIES -eq 0 ]; then
    handle_error 1 "PostgreSQL failed to start within the timeout period"
fi

# Generate migrations if needed
if [ ! "$(ls -A apps/server/drizzle 2>/dev/null)" ]; then
    echo "Generating database migrations..."
    (cd apps/server && run_command "bun run db:generate" "Failed to generate database migrations")
    cd - > /dev/null
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "To start development:"
echo "1. Run: bun run dev"
echo "2. Visit: http://localhost:5173 for the client"
echo "3. The server will be running at: http://localhost:8000" 