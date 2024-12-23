# Notes Backend

## Setup

### Development Setup

1. Install dependencies:

```bash
bun install
```

2. Start PostgreSQL:

```bash
bun run postgres:up
```

3. Generate database schema (if needed):

```bash
bun run db:generate
```

4. Start development server:

```bash
bun run dev
```

This will:

- Run migrations
- Push schema changes
- Start server in watch mode

### Database Management

#### Drizzle Kit Studio

Drizzle Kit Studio is a visual tool for interacting with your database:

```bash
bunx drizzle-kit studio
```

#### Common Commands

Generate migrations:

```bash
bun run db:generate
```

Push schema changes:

```bash
bun run db:push
```

Run migrations:

```bash
bun run db:migrate
```

### Clean Up

Stop PostgreSQL:

```bash
bun run postgres:down
```

Remove dependencies:

```bash
bun run clean
```

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 8000)
- `HOST`: Server host (default: 0.0.0.0)
- `FRONTEND_URL`: Frontend URL for CORS (production only)
