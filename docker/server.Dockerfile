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

# Set production environment
ENV NODE_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0
ENV DRIZZLE_OUT=./drizzle
ENV DATABASE_CONNECTION_RETRIES=5
ENV DATABASE_CONNECTION_RETRY_DELAY=5

# Create a script to handle startup
COPY <<-"EOF" /app/apps/server/start.sh
#!/bin/sh
set -e

echo "Waiting for database..."
retries=${DATABASE_CONNECTION_RETRIES:-5}
delay=${DATABASE_CONNECTION_RETRY_DELAY:-5}

# Use DATABASE_URL for connection check if available
if [ -n "$DATABASE_URL" ]; then
    until PGPASSWORD=$DB_PASSWORD pg_isready -d $DATABASE_URL || [ $retries -eq 0 ]; do
        echo "Waiting for database... $((retries)) remaining attempts..."
        retries=$((retries-1))
        sleep $delay
    done
else
    # Fallback to individual parameters
    until pg_isready -U ${DB_USER:-postgres} -h ${DB_HOST:-localhost} || [ $retries -eq 0 ]; do
        echo "Waiting for database... $((retries)) remaining attempts..."
        retries=$((retries-1))
        sleep $delay
    done
fi

if [ $retries -eq 0 ]; then
    echo "Error: Could not connect to database"
    echo "Database URL: ${DATABASE_URL:-not set}"
    echo "Database Host: ${DB_HOST:-not set}"
    echo "Database User: ${DB_USER:-not set}"
    exit 1
fi

echo "Running database migrations..."
bun run db:migrate

echo "Starting server..."
exec bun run src/main.ts
EOF

RUN chmod +x /app/apps/server/start.sh

# Ensure proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user for security
USER appuser

# Set working directory to server folder
WORKDIR /app/apps/server

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD if [ -n "$DATABASE_URL" ]; then \
        PGPASSWORD=$DB_PASSWORD pg_isready -d $DATABASE_URL && \
        curl -f http://localhost:8000/health || exit 1; \
    else \
        pg_isready -U ${DB_USER:-postgres} -h ${DB_HOST:-localhost} && \
        curl -f http://localhost:8000/health || exit 1; \
    fi

# Expose port for the Hono server
EXPOSE 8000

# Start the application using the script
CMD ["/app/apps/server/start.sh"] 