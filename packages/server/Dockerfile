FROM oven/bun:latest

WORKDIR /app

# Create a non-root user
RUN groupadd -r appgroup && \
    useradd -r -g appgroup -d /app appuser && \
    chown -R appuser:appgroup /app

# Copy workspace files first
COPY package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/server/package.json ./packages/server/

# Install dependencies without lockfile
RUN bun install

# Copy the rest of the source code
COPY packages/types ./packages/types
COPY packages/server ./packages/server

# Switch to server directory
WORKDIR /app/packages/server

# Switch to non-root user
USER appuser

# Generate database code
RUN bun run db:generate

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Use production command
CMD ["bun", "run", "start"] 