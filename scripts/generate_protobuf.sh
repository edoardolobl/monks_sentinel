#!/bin/bash

# Generate protobuf code for GTM Analysis System
set -e

echo "🔄 Generating protobuf code..."

# Create directories
mkdir -p generated/python/gtm/models
mkdir -p generated/python/gtm/analysis
mkdir -p generated/typescript/src/gtm

# Check if protoc is available
if ! command -v protoc &> /dev/null; then
    echo "❌ protoc not found. Installing..."
    # Install protoc on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install protobuf
    else
        echo "Please install protoc manually"
        exit 1
    fi
fi

# Install Python gRPC tools if not available
pip install grpcio-tools

# Generate Python code
echo "🐍 Generating Python code..."
python -m grpc_tools.protoc \
    --proto_path=proto \
    --python_out=generated/python \
    --grpc_python_out=generated/python \
    proto/gtm_models.proto proto/gtm_analysis.proto

# Fix Python imports
find generated/python -name "*.py" -exec sed -i '' 's/import gtm_/from . import gtm_/g' {} \;

# Create __init__.py files
echo "# Generated protobuf models" > generated/python/gtm/__init__.py
echo "# Generated protobuf models" > generated/python/gtm/models/__init__.py
echo "# Generated protobuf analysis" > generated/python/gtm/analysis/__init__.py

# Generate TypeScript if ts-proto is available
if command -v protoc-gen-ts &> /dev/null; then
    echo "🟦 Generating TypeScript code..."
    protoc \
        --proto_path=proto \
        --ts_out=generated/typescript/src \
        proto/gtm_models.proto proto/gtm_analysis.proto
else
    echo "⚠️  ts-proto not found, skipping TypeScript generation"
fi

echo "✅ Protobuf code generation complete!"
echo "📁 Python code: generated/python/"
echo "📁 TypeScript code: generated/typescript/"