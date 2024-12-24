FROM oven/bun:latest

# Set up working directory for the app (monorepo root)
WORKDIR /app

# Install system dependencies including curl for healthcheck
RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r appgroup && \
    useradd -r -g appgroup -d /app appuser && \
    chown -R appuser:appgroup /app

# First copy only package files and configs from root for better layer caching
COPY package.json ./
COPY tsconfig.json ./

# Then copy server and types package files and configs
COPY apps/server/package.json ./apps/server/
COPY apps/server/tsconfig.json ./apps/server/
COPY packages/types/package.json ./packages/types/
COPY packages/types/tsconfig.json ./packages/types/

# Copy scripts directory
COPY scripts ./scripts

# Install all dependencies (both root and server)
RUN bun install --no-cache

# Copy source code and other necessary files
COPY packages/types ./packages/types
COPY apps/server ./apps/server
COPY apps/server/drizzle.config.ts ./apps/server/

# Build the application
RUN bun run build:types && bun run build:server

# Clean up dev dependencies
RUN rm -rf node_modules && \
    bun install --production --no-cache && \
    rm -rf ~/.bun/install/cache

# Ensure proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user for security
USER appuser

# Set working directory to server folder
WORKDIR /app/apps/server

# Set production environment
ENV NODE_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0
ENV DRIZZLE_OUT=./drizzle

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD pg_isready -U ${DB_USER:-postgres} -h ${DB_HOST:-localhost} && \
        curl -f http://localhost:8000/health || exit 1

# Expose port for the Hono server
EXPOSE 8000

# Start the application using the script from package.json
CMD ["sh", "-c", "\
    echo 'Waiting for database...' && \
    until pg_isready -U ${DB_USER:-postgres} -h ${DB_HOST:-localhost}; do \
      sleep 1; \
    done && \
    echo 'Database is ready!' && \
    bun run db:migrate && \
    bun run start \
"] 