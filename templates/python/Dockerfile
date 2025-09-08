# Multi-stage Dockerfile for GTM {MODULE_NAME.title()} Analyzer gRPC Server (Python)
# Optimized for production deployment with security best practices
#
# Template placeholders:
# - {MODULE_NAME}: Module name for container labels and environment
# - {PORT}: gRPC server port (e.g., 50051, 50052, 50053, 50054)

# Build stage
FROM python:3.11-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies including protoc for protobuf compilation
RUN apk add --no-cache \
    gcc \
    musl-dev \
    linux-headers \
    protobuf-dev \
    protoc \
    && rm -rf /var/cache/apk/*

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy proto files for compilation (from parent directory)
RUN mkdir -p ../proto
COPY ../proto/ ../proto/

# Copy source code
COPY *.py ./

# Create generated directory for protobuf files
RUN mkdir -p generated

# Generate protobuf Python files
RUN python -m grpc_tools.protoc \
    --proto_path=../proto \
    --python_out=generated \
    --grpc_python_out=generated \
    ../proto/*.proto

# Production stage
FROM python:3.11-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser

# Install runtime dependencies including grpc_health_probe
RUN apk add --no-cache \
    curl \
    wget \
    && wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.20/grpc_health_probe-linux-amd64 \
    && chmod +x /bin/grpc_health_probe \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy Python dependencies from builder stage
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Copy application code and generated protobuf files from builder stage
COPY --from=builder --chown=appuser:appuser /app/*.py ./
COPY --from=builder --chown=appuser:appuser /app/generated ./generated

# Make sure scripts in .local are usable
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/app:/app/generated:$PYTHONPATH

# Switch to non-root user
USER appuser

# Expose gRPC port
EXPOSE {PORT}

# Environment variables for gRPC server
ENV MODULE_NAME={MODULE_NAME}
ENV PORT={PORT}
ENV HOST=0.0.0.0
ENV LOG_LEVEL=INFO

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
CMD ["python", "main.py"]