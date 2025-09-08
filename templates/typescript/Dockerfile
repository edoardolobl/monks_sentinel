# Multi-stage Dockerfile for GTM {MODULE_NAME.title()} Analyzer gRPC Server (TypeScript)
# Optimized for production deployment with security best practices
#
# Template placeholders:
# - {MODULE_NAME}: Module name for container labels and environment
# - {PORT}: gRPC server port (e.g., 50052, 50053, 50054)

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies including protoc for protobuf compilation
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    protobuf-dev \
    && rm -rf /var/cache/apk/*

# Copy package files and config
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production=false

# Copy proto files for compilation (from parent directory)
RUN mkdir -p ../proto
COPY ../proto/ ../proto/

# Copy source code
COPY src/ ./src/

# Build the TypeScript application (includes protobuf generation)
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

# Install production runtime dependencies including grpc_health_probe
RUN apk add --no-cache \
    curl \
    wget \
    && wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.20/grpc_health_probe-linux-amd64 \
    && chmod +x /bin/grpc_health_probe \
    && rm -rf /var/cache/apk/*

# Copy built application and dependencies from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/generated ./generated
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Switch to non-root user
USER nodejs

# Expose gRPC port
EXPOSE {PORT}

# Environment variables for gRPC server
ENV NODE_ENV=production
ENV MODULE_NAME={MODULE_NAME}
ENV PORT={PORT}
ENV HOST=0.0.0.0
ENV LOG_LEVEL=info

# Health check for gRPC server using grpc_health_probe
HEALTHCHECK --interval=15s --timeout=5s --start-period=45s --retries=5 \
  CMD grpc_health_probe -addr=localhost:{PORT} || exit 1

# Container labels for identification
LABEL org.opencontainers.image.title="GTM {MODULE_NAME.title()} Analyzer"
LABEL org.opencontainers.image.description="gRPC microservice for GTM {MODULE_NAME} analysis"
LABEL org.opencontainers.image.source="https://github.com/monks-sentinel/gtm-quality-system"
LABEL org.opencontainers.image.vendor="Monks Sentinel"
LABEL org.opencontainers.image.version="1.0.0"

# Start the application
CMD ["node", "dist/main.js"]