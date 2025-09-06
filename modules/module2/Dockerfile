# Multi-stage Dockerfile for GTM Governance Analyzer (TypeScript)
# Optimized for production deployment with security best practices

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production=false

# Copy source code
COPY src/ ./src/

# Build the TypeScript application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Production stage
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Install production runtime dependencies only
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Copy built application and dependencies from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Switch to non-root user
USER nodejs

# Expose port 8002 (matching the module port)
EXPOSE 8002

# Environment variables
ENV NODE_ENV=production
ENV PORT=8002
ENV HOST=0.0.0.0
ENV LOG_LEVEL=info

# Health check matching the same pattern as Python modules
HEALTHCHECK --interval=15s --timeout=5s --start-period=45s --retries=5 \
  CMD curl -f http://localhost:8002/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]