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

# Function to setup backend with Docker
setup_backend_docker() {
    echo "Setting up backend (Docker)..."
    
    # Check Docker prerequisites
    if ! command_exists docker; then
        handle_error 1 "Docker is not installed. Please install it from https://www.docker.com"
    fi

    if ! docker info >/dev/null 2>&1; then
        handle_error 1 "Docker daemon is not running. Please start Docker and try again."
    fi
    
    run_command "bun run docker:up" "Failed to start Docker containers"
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
    echo "1) Full stack (Frontend + Backend) [Recommended]"
    echo "2) Frontend only"
    echo "3) Backend only"
    read -p "Enter your choice (1-3): " setup_choice

    case $setup_choice in
        1)
            echo -e "\n${BLUE}Choose backend configuration:${NC}"
            echo "1) Run server locally with PostgreSQL in container [Recommended]"
            echo "2) Run server in Docker container (No Hot Reload)"
            read -p "Enter your choice (1-2): " backend_choice
            
            setup_frontend
            
            case $backend_choice in
                1)
                    setup_backend_local
                    echo -e "\n${GREEN}✅ Full stack setup complete! (Local server)${NC}"
                    echo -e "\nTo start development:"
                    echo "Run: bun run dev"
                    echo "Frontend: http://localhost:5173"
                    echo "Backend: http://localhost:8000"
                    ;;
                2)
                    setup_backend_docker
                    echo -e "\n${GREEN}✅ Full stack setup complete! (Docker)${NC}"
                    echo -e "\nTo start development:"
                    echo "1. Backend is running at: http://localhost:8000"
                    echo "2. Run: bun run dev:client"
                    echo "3. Visit: http://localhost:5173"
                    echo "Note: Backend Hot Module Reloading is not available in Docker mode"
                    ;;
                *)
                    handle_error 1 "Invalid backend configuration choice"
                    ;;
            esac
            ;;
        2)
            setup_frontend
            echo -e "\n${GREEN}✅ Frontend setup complete!${NC}"
            echo -e "\nTo start frontend development:"
            echo "Run: bun run dev:client"
            echo "Visit: http://localhost:5173"
            ;;
        3)
            echo -e "\n${BLUE}Choose backend configuration:${NC}"
            echo "1) Run server locally with PostgreSQL in container [Recommended]"
            echo "2) Run server in Docker container (No Hot Reload)"
            read -p "Enter your choice (1-2): " backend_choice
            
            case $backend_choice in
                1)
                    setup_backend_local
                    echo -e "\n${GREEN}✅ Backend setup complete! (Local server)${NC}"
                    echo -e "\nTo start backend development:"
                    echo "Run: bun run dev:server"
                    echo "Server will be running at: http://localhost:8000"
                    ;;
                2)
                    setup_backend_docker
                    echo -e "\n${GREEN}✅ Backend setup complete! (Docker)${NC}"
                    echo -e "\nServer is running at: http://localhost:8000"
                    echo "Note: Hot Module Reloading is not available in Docker mode"
                    ;;
                *)
                    handle_error 1 "Invalid backend configuration choice"
                    ;;
            esac
            ;;
        *)
            handle_error 1 "Invalid setup choice"
            ;;
    esac
}

# Run the setup
main_setup 