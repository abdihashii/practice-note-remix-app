# Notes Backend

## Setup

### Option 1: Local with Docker (recommended)

1. `bun install`: Install dependencies
2. `bun run db:generate`: Generate the database schema using Drizzle Kit
3. `docker compose up --build`: Build and start both the database container and the server
4. `bun run db:seed`: (Optional) Populate the database with test data

### Option 2: Local without Docker

1. `bun install`: Install dependencies
2. `bun run db:generate`: Generate the database schema using Drizzle Kit
3. `bun run db:push`: Push the database schema to the database
4. `bun run dev`: Runs migrations script, pushes the schema to the database, and starts the server in watch mode
5. `bun run db:seed`: (Optional) Populate the database with test data

## Database Management

### Seeding Test Data

When you run `bun run db:seed`, it will add:

- A test user (email: test@example.com)
- A welcome note associated with the test user

> Note: The seed data includes a test user with a pre-hashed password. In a real application, you should never commit real passwords or their hashes to version control.

### Drizzle Kit Studio

Drizzle Kit Studio is a visual tool for interacting with your database.

1. `bunx drizzle-kit studio`: Run Drizzle Kit Studio
