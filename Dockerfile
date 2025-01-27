# syntax=docker/dockerfile:1

# Build stage for shared types
FROM node:20-alpine AS types-builder
WORKDIR /app
# Install typescript globally for building
RUN npm install -g pnpm typescript

# Copy root workspace files
COPY package.json pnpm-lock.yaml tsconfig.json pnpm-workspace.yaml ./

# Copy types package
COPY packages/types/ ./packages/types/

# Install and build types
RUN pnpm install --frozen-lockfile && \
    cd packages/types && \
    pnpm build && \
    cd ../.. && \
    pnpm install --frozen-lockfile

# Development dependencies stage
FROM node:20-alpine AS development-dependencies
WORKDIR /app
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/remix-frontend/package.json ./apps/remix-frontend/
COPY --from=types-builder /app/packages/types ./packages/types
COPY --from=types-builder /app/node_modules ./node_modules

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy all necessary files
COPY . .
COPY --from=development-dependencies /app/node_modules ./node_modules
COPY --from=development-dependencies /app/packages/types/dist ./packages/types/dist
COPY --from=development-dependencies /app/apps/remix-frontend/node_modules ./apps/remix-frontend/node_modules

# Build the application
WORKDIR /app/apps/remix-frontend
RUN pnpm build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

# Copy necessary files for production
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/remix-frontend/package.json ./apps/remix-frontend/
COPY --from=types-builder /app/packages/types ./packages/types
COPY --from=builder /app/apps/remix-frontend/build ./apps/remix-frontend/build
COPY --from=builder /app/apps/remix-frontend/public ./apps/remix-frontend/public

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Set up the runtime environment
WORKDIR /app/apps/remix-frontend

EXPOSE 3000
CMD ["pnpm", "start"]