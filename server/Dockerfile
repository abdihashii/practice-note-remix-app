FROM oven/bun:latest

WORKDIR /app

# Copy package manager files and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the app's source code
COPY . .

# Generate database code with Drizzle Kit
RUN bun run db:generate

CMD ["bun", "run", "dev"]
