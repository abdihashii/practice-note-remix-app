FROM oven/bun:latest

# Set up working directory for the app (monorepo root)
WORKDIR /app

# Install system dependencies including curl for healthcheck
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r appgroup && \
    useradd -r -g appgroup -d /app appuser && \
    chown -R appuser:appgroup /app

# --- Dependencies Installation ---
# Copy root package files
COPY package.json .
# Only copy lockfile if it exists
RUN [ -f "../bun.lockb" ] && cp ../bun.lockb . || true

# Copy the server's package.json
COPY apps/server/package.json ./apps/server/

# Install all dependencies (both root and server)
RUN bun install

# --- Application Code ---
# Copy server source code to its directory
COPY apps/server ./apps/server/

# Ensure proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user for security
USER appuser

# Set working directory to server folder
WORKDIR /app/apps/server

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port for the Hono server
EXPOSE 8000

# Start the application using the script from package.json
CMD ["bun", "run", "start"] 