# Contributing to Notes App

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `bun install`
3. Copy environment files:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

4. Start development environment: `bun run setup`

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests (when implemented)
4. Update documentation if needed
5. Submit a pull request

## Project Structure

```bash
notes-app/
├── apps/
│   ├── client/         # Remix frontend
│   │   ├── app/        # Application code
│   │   └── public/     # Static assets
│   └── server/         # Bun/Hono backend
│       ├── src/        # Source code
│       └── drizzle/    # Database migrations
└── packages/
    └── types/          # Shared TypeScript types
```

## Scripts

Common development commands:

```bash
# Start development servers
bun run dev

# Start only frontend
bun run dev:client

# Start only backend
bun run dev:server

# Database commands
bun run --cwd apps/server db:generate  # Generate migrations
bun run --cwd apps/server db:push      # Push schema changes
```

## Code Style

- Use TypeScript for all code
- Follow existing patterns in the codebase
- Use ESLint and Prettier configurations

## Commit Messages

Follow conventional commits specification:

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Build process or auxiliary tool changes

## Need Help?

- Check existing issues
- Create a new issue for discussions
- Read the documentation in README.md files
