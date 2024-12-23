# Notes App Monorepo

A full-stack notes application with a React frontend and Bun/Hono backend.

## Prerequisites

- [Bun](https://bun.sh) (for both client and server)
- [Node.js](https://nodejs.org/) 18+ (recommended)
- [Docker](https://www.docker.com/) (for PostgreSQL database)

## Project Structure

```bash
notes-app/
├── apps/
│ ├── client/ # Remix frontend
│ └── server/ # Bun/Hono backend
└── packages/
  └── types/ # Shared TypeScript types
```

## Quick Start

### Option 1: Interactive Setup (Recommended)

Run the interactive setup script:

```bash
bun run setup
```

This will guide you through:

- Installing dependencies
- Setting up environment files
- Building shared packages
- Choosing your development configuration:
  1. Full stack (Frontend + Backend)
     - Local server with PostgreSQL in container
     - Server in Docker container
  2. Frontend only
  3. Backend only
     - Local server with PostgreSQL in container
     - Server in Docker container

### Option 2: Manual Setup

1. Install dependencies:

```bash
bun install
```

2. Set up environment variables:

- Copy `.env.example` to `.env` in both `apps/server` and `apps/client`
- Update variables as needed

3. Build shared packages:

```bash
bun run build:types
```

4. Optional: generate migrations (if drizzle folder is empty)

```bash
# Navigate to server directory
cd apps/server

# Generate migrations
bun run db:generate
```

## Development

### Option 1: Full Stack Development (Recommended)

Run both the client and server in development mode:

```bash
# Start PostgreSQL container in detached mode
bun run postgres:up

# Start both frontend and backend
bun run dev

# In a new terminal, ensure the server is running with a health check
curl http://localhost:8000/health
```

- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:8000](http://localhost:8000)

### Option 2: Individual Apps

#### Client Only

```bash
bun run dev:client
```

#### Server Only

```bash
# Start PostgreSQL container in detached mode
bun run postgres:up

# Start hono server
bun run dev:server
```

## Database Management

### Drizzle ORM Commands

```bash
# Generate migrations
bun run --cwd apps/server db:generate

# Push schema changes
bun run --cwd apps/server db:push

# Run Drizzle Studio (DB GUI)
cd apps/server
bunx drizzle-kit studio
```

## Clean Up

Remove all build artifacts and dependencies:

```bash
bun run clean
```

Stop PostgreSQL container:

```bash
bun run postgres:down
```

## Additional Notes

- PostgreSQL runs in a Docker container for development
- The server uses Bun for fast performance and modern JavaScript features
- Hot Module Reloading (HMR) is available for both client and server
- The client is built with Remix and includes a rich text editor
- TypeScript is used throughout the project for type safety
