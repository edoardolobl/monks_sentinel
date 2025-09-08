# Multi-stage build for Core Orchestrator Service
FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

# Install runtime dependencies including grpc_health_probe
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.20/grpc_health_probe-linux-amd64 \
    && chmod +x /bin/grpc_health_probe \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash --uid 1000 gtm && \
    chown -R gtm:gtm /app && \
    chmod -R 755 /app

# Switch to non-root user
USER gtm

# Health check for gRPC service using grpc_health_probe
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD grpc_health_probe -addr=localhost:8080 || exit 1

# Expose gRPC port
EXPOSE 8080

# Start the gRPC server
CMD ["python", "main.py"]