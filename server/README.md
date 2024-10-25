# Notes Backend

## Setup

### Option 1: Local with Docker (recommended)

1. `bun install`
2. `bun run db:generate`
3. `docker compose up --build`

### Option 2: Local without Docker

1. `bun install`
2. `bun run db:generate`
3. `bun run db:push`
4. `bun run dev`

### Run Drizzle Kit Studio

Drizzle Kit Studio is a visual tool for interacting with your database.

1. `bunx drizzle-kit studio`
