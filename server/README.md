# Notes Backend

## Setup

### Option 1: Local with Docker (recommended)

1. `bun install`: Install dependencies
2. `bun run db:generate`: Generate the database schema using Drizzle Kit
3. `docker compose up --build`: Build and start both the database container and the server

### Option 2: Local without Docker

1. `bun install`: Install dependencies
2. `bun run db:generate`: Generate the database schema using Drizzle Kit
3. `bun run db:push`: Push the database schema to the database
4. `bun run dev`: Runs migrations script, pushes the schema to the database, and starts the server in watch mode

### Run Drizzle Kit Studio

Drizzle Kit Studio is a visual tool for interacting with your database.

1. `bunx drizzle-kit studio`: Run Drizzle Kit Studio
