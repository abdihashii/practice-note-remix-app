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
# Copy root package files first (monorepo setup)
# These paths are relative to the build context (monorepo root)
# Then save to the working directory (server directory - docker setup)
# The '.' is the working directory (server directory - docker setup)
# For Render: Copy from parent directories since build context is apps/server
COPY ../../package.json .
COPY ../../bun.lockb .

# Copy the server's package.json
COPY package.json ./apps/server/

# Install all dependencies (both root and server)
RUN bun install --frozen-lockfile

# --- Application Code ---
# Copy server source code to its directory
# In production, this contains all the code
# In development, this is partially overridden by volume mounts
COPY . ./apps/server/

# Ensure proper permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user for security
USER appuser

# Set working directory to server folder
# This is where all commands will run from
WORKDIR /app/apps/server

# Health check for container orchestration
# Used by both docker-compose and cloud platforms
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port for the Hono server
EXPOSE 8000

# Start the application using the script from package.json
# This runs migrations and starts the server
CMD ["bun", "run", "start"] 