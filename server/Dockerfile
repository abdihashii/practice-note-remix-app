FROM oven/bun:latest

WORKDIR /app

# Create a non-root user
RUN groupadd -r appgroup && \
    useradd -r -g appgroup -d /app appuser && \
    chown -R appuser:appgroup /app

# Install dependencies
COPY --chown=appuser:appgroup package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the app's source code
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

# Generate database code
RUN bun run db:generate

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Use production command instead of dev for better stability
CMD ["bun", "run", "start"]
