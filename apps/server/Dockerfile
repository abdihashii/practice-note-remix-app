FROM oven/bun:latest

WORKDIR /app

# Install system dependencies including curl for healthcheck
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN groupadd -r appgroup && \
    useradd -r -g appgroup -d /app appuser && \
    chown -R appuser:appgroup /app

# Copy package files
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Set permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Start the application
CMD ["bun", "run", "start"] 