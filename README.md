# Notes App Monorepo

A full-stack notes application with a React frontend and Bun/Hono backend.

## Prerequisites

- [Bun](https://bun.sh) (for both client and server)
- [Docker](https://www.docker.com/) (optional, for server)
- [Node.js](https://nodejs.org/) 18+ (recommended)

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

## Development

### Option 1: Full Stack Development (Recommended)

Run both the client and server in development mode:

```bash
bun run dev
```

- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:8000](http://localhost:8000)

### Option 2: Individual Apps

#### Client Only

```bash
bun run dev:client
```

#### Server Only

**With Local PostgresSQL:**

```bash
bun run dev:server
```

**With Docker (Note: No Hot Module Reloading):**

```bash
# Start server + PostgreSQL
bun run docker:up-server && bun run dev:server
```

```bash
# Stop server + PostgreSQL containers
bun run docker:down-server
```

## Database Management

### Drizzle ORM Commands

```bash
# Generate migrations
bun run --cwd apps/server db:generate

# Push schema changes
bun run --cwd apps/server db:push

# Run Drizzle Studio (DB GUI)
bunx --cwd apps/server drizzle-kit studio
```

## Clean Up

Remove all build artifacts and dependencies:

```bash
bun run clean
```

## Additional Notes

- The server supports both Docker and local development modes
- Docker mode is great for production-like environment but doesn't support HMR
- Local development mode provides the best developer experience with HMR
- The client is built with Remix and includes a rich text editor
- TypeScript is used throughout the project for type safety
