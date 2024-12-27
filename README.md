# Notes App Monorepo

A full-stack notes application with a React frontend and Cloudflare Workers backend.

## Prerequisites

- [Bun](https://bun.sh) (for development)
- [Node.js](https://nodejs.org/) 18+ (recommended)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up) (for backend deployment)
- [Neon Database Account](https://neon.tech) (for PostgreSQL)

## Project Structure

```bash
notes-app/
├── apps/
│ ├── frontend/    # Next.js frontend
│ └── backend/     # Cloudflare Workers backend (Hono + Drizzle)
└── packages/
  └── types/       # Shared TypeScript types
```

## Quick Start

1. Install dependencies:

```bash
bun install
```

2. Set up environment variables:

- Copy `.env.example` to `.env` in both `apps/backend` and `apps/frontend`
- For backend, also create `.dev.vars` for Cloudflare Workers development
- Update variables as needed

3. Build shared packages:

```bash
bun run build:types
```

4. Optional: generate migrations (if drizzle folder is empty)

```bash
# Generate migrations from root
bun run db:generate
```

## Development

### Option 1: Full Stack Development (Recommended)

Run both the frontend and backend in development mode:

```bash
bun run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8787](http://localhost:8787)

### Option 2: Individual Apps

#### Frontend Only

```bash
bun run dev:frontend
```

#### Backend Only

```bash
bun run dev:server
```

## Database Management

### Drizzle ORM Commands

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Run Drizzle Studio (DB GUI)
cd apps/backend
bunx drizzle-kit studio
```

## Clean Up

Remove all build artifacts and dependencies:

```bash
bun run clean
```

## Production Deployment

### Frontend

Deploy the Next.js frontend to your preferred hosting platform.

### Backend

1. Authenticate with Cloudflare:

```bash
npx wrangler login
```

2. Set up production environment variables:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put FRONTEND_URL
```

3. Deploy to Cloudflare Workers:

```bash
bun run --cwd apps/backend worker:deploy
```

### Environment Variables

Make sure to set these in your production environment:

```env
# Frontend (.env)
NEXT_PUBLIC_API_URL=your_workers_url

# Backend (Cloudflare Workers secrets)
DATABASE_URL=your_neon_db_url
FRONTEND_URL=your_frontend_url
```

## Additional Notes

- The backend is deployed to Cloudflare Workers for global edge computing
- Database runs on Neon's serverless PostgreSQL platform
- The frontend is built with Next.js for optimal performance
- TypeScript is used throughout the project for type safety
