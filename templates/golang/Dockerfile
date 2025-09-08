# Multi-stage Dockerfile for GTM {MODULE_NAME.title()} Analyzer gRPC Server (Go)
# Optimized for production deployment with security best practices
#
# Template placeholders:
# - {MODULE_NAME}: Module name for container labels and environment
# - {PORT}: gRPC server port (e.g., 50051, 50052, 50053, 50054)

# Build stage
FROM golang:1.21-alpine AS builder

# Install build dependencies including protoc for protobuf compilation
RUN apk add --no-cache \
    git \
    protobuf-dev \
    protoc \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy go mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy proto files for compilation (from parent directory)
RUN mkdir -p ../proto
COPY ../proto/ ../proto/

# Install protoc-gen-go and protoc-gen-go-grpc
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Generate protobuf Go files
RUN mkdir -p pkg/proto
RUN protoc --proto_path=../proto \
    --go_out=./pkg/proto --go_opt=paths=source_relative \
    --go-grpc_out=./pkg/proto --go-grpc_opt=paths=source_relative \
    ../proto/*.proto

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd

# Production stage  
FROM alpine:latest AS production

# Install runtime dependencies including grpc_health_probe
RUN apk --no-cache add \
    ca-certificates \
    curl \
    wget \
    && wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.20/grpc_health_probe-linux-amd64 \
    && chmod +x /bin/grpc_health_probe \
    && rm -rf /var/cache/apk/*

# Create app user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser

# Set working directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder --chown=appuser:appuser /app/main .

# Switch to non-root user
USER appuser

# Expose gRPC port
EXPOSE {PORT}

# Environment variables for gRPC server
ENV MODULE_NAME={MODULE_NAME}
ENV PORT={PORT}
ENV HOST=0.0.0.0

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
CMD ["./main"]