# Notes App Backend

Backend service for the Notes application, built with Hono and deployed on Cloudflare Workers.

## Development Setup

1. Install dependencies:

```bash
bun install
```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the required variables:

```env
DATABASE_URL=your_database_url
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Run the development server:

```bash
bun run dev
```

## Development with Cloudflare Workers

### Local Testing

To test the worker locally with Cloudflare's environment:

```bash
bun run worker:dev
```

This will start a local development server that mimics the Cloudflare Workers environment. You'll need to configure your environment variables in `.dev.vars` (create if it doesn't exist):

```env
DATABASE_URL="your_database_url"
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your_jwt_secret"
```

### Deployment

TODO: Add deployment instructions

## Environment Variables

- `DATABASE_URL` (required): Connection string for the Neon PostgreSQL database
- `NODE_ENV`: Environment mode (`development` or `production`)
- `FRONTEND_URL`: URL of the frontend application for CORS configuration
- `JWT_SECRET`: Secret key for JWT token generation

## Available Scripts

- `bun run dev`: Run local development server
- `bun run worker:deploy`: Deploy to Cloudflare Workers
- `bun run worker:dev`: Run Cloudflare Workers development environment
- `bun run db:generate`: Generate database migrations
- `bun run db:migrate`: Run database migrations
- `bun run test`: Run tests

## Project Structure

```
src/
├── db/                 # Database configuration and schema
├── middleware/         # Hono middleware
├── routes/            # API route handlers
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── index.ts          # Main application entry
└── local.ts          # Local development entry
```
