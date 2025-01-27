# syntax=docker/dockerfile:1

# Build stage for shared types
FROM node:20-alpine AS types-builder
WORKDIR /app
# Install typescript globally for building
RUN npm install -g pnpm typescript

# Copy package files and configs
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/types ./packages/types

# Install dependencies and build types
RUN pnpm install --frozen-lockfile && \
    cd packages/types && \
    pnpm build && \
    cd ../.. && \
    pnpm install --frozen-lockfile # Reinstall to link the built package

# Development dependencies stage
FROM node:20-alpine AS development-dependencies
WORKDIR /app
RUN npm install -g pnpm

# Copy package files and built types
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/remix-frontend/package.json ./apps/remix-frontend/
COPY --from=types-builder /app/packages/types ./packages/types
COPY --from=types-builder /app/node_modules ./node_modules

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy all source files and dependencies
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

EXPOSE 5173
CMD ["pnpm", "start"]