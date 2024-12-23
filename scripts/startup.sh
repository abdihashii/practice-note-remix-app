#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to get valid user input
get_valid_input() {
    local prompt=$1
    local max=$2
    local choice

    while true; do
        read -p "$prompt" choice
        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "$max" ]; then
            echo "$choice"
            return
        else
            echo -e "${YELLOW}Please enter a number between 1 and $max${NC}"
        fi
    done
}

# Function to setup frontend
setup_frontend() {
    echo "Setting up frontend..."
    
    # Client environment
    if [ ! -f "apps/client/.env" ]; then
        if [ ! -f "apps/client/.env.example" ]; then
            handle_error 1 "Client .env.example file not found"
        fi
        run_command "cp apps/client/.env.example apps/client/.env" "Failed to create client .env file"
        echo -e "${GREEN}✓ Created apps/client/.env${NC}"
    fi
}

# Function to setup backend with local server
setup_backend_local() {
    echo "Setting up backend (local server)..."
    
    # Check Docker prerequisites
    if ! command_exists docker; then
        handle_error 1 "Docker is not installed. Please install it from https://www.docker.com"
    fi

    if ! docker info >/dev/null 2>&1; then
        handle_error 1 "Docker daemon is not running. Please start Docker and try again."
    fi
    
    # Server environment
    if [ ! -f "apps/server/.env" ]; then
        if [ ! -f "apps/server/.env.example" ]; then
            handle_error 1 "Server .env.example file not found"
        fi
        run_command "cp apps/server/.env.example apps/server/.env" "Failed to create server .env file"
        echo -e "${GREEN}✓ Created apps/server/.env${NC}"
    fi
    
    # Create root .env file for Docker Compose
    if [ ! -f ".env" ]; then
        echo "Creating root .env file for Docker Compose..."
        cat > .env << EOL
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
PORT=8000
HOST=0.0.0.0
EOL
        echo -e "${GREEN}✓ Created root .env file${NC}"
    fi
    
    # Start PostgreSQL
    echo "Starting PostgreSQL container..."
    run_command "bun run postgres:up" "Failed to start PostgreSQL container"
    
    # Wait for PostgreSQL
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
}

# Main setup function
main_setup() {
    echo "🚀 Setting up Notes App development environment..."

    # Check Bun prerequisite
    if ! command_exists bun; then
        handle_error 1 "Bun is not installed. Please install it from https://bun.sh"
    fi

    # Install dependencies
    echo "Installing dependencies..."
    run_command "bun install" "Failed to install dependencies"

    # Build shared packages
    echo "Building shared packages..."
    run_command "bun run build:types" "Failed to build shared packages"

    # Show setup options
    echo -e "\n${BLUE}Please choose your setup configuration:${NC}"
    echo "1) Full stack (Frontend + Backend)"
    echo "2) Frontend only"
    echo "3) Backend only"
    setup_choice=$(get_valid_input "Enter your choice (1-3): " 3)

    case $setup_choice in
        1)
            setup_frontend
            setup_backend_local
            echo -e "\n${GREEN}✅ Full stack setup complete!${NC}"
            echo -e "\n${BLUE}Starting development servers...${NC}"
            echo "Frontend will be available at: http://localhost:5173"
            echo "Backend will be available at: http://localhost:8000"
            echo -e "\n${YELLOW}Press Ctrl+C to stop the servers${NC}"
            run_command "bun run dev" "Failed to start development servers"
            ;;
        2)
            setup_frontend
            echo -e "\n${GREEN}✅ Frontend setup complete!${NC}"
            echo -e "\n${BLUE}Starting frontend development server...${NC}"
            echo "Frontend will be available at: http://localhost:5173"
            echo -e "\n${YELLOW}Press Ctrl+C to stop the server${NC}"
            run_command "bun run dev:client" "Failed to start frontend server"
            ;;
        3)
            setup_backend_local
            echo -e "\n${GREEN}✅ Backend setup complete!${NC}"
            echo -e "\n${BLUE}Starting backend development server...${NC}"
            echo "Backend will be available at: http://localhost:8000"
            echo -e "\n${YELLOW}Press Ctrl+C to stop the server${NC}"
            run_command "bun run dev:server" "Failed to start backend server"
            ;;
        *)
            handle_error 1 "Invalid setup choice"
            ;;
    esac
}

# Run the setup
main_setup 