# GTM Analysis System - Protobuf & gRPC Build System

.PHONY: proto proto-clean proto-python help

# Default target
all: proto

# Generate all protobuf code
proto:
	@echo "🔄 Generating protobuf code for all languages..."
	@chmod +x scripts/generate_protobuf.sh
	@./scripts/generate_protobuf.sh

# Generate Python protobuf code only
proto-python:
	@echo "🐍 Generating Python protobuf code..."
	@mkdir -p generated/python/gtm/{models,analysis}
	@pip install grpcio-tools
	@python -m grpc_tools.protoc \
		--proto_path=proto \
		--python_out=generated/python \
		--grpc_python_out=generated/python \
		proto/gtm_models.proto proto/gtm_analysis.proto
	@find generated/python -name "*.py" -exec sed -i '' 's/import gtm_/from . import gtm_/g' {} \; || true
	@echo "# Generated protobuf models" > generated/python/gtm/__init__.py
	@echo "# Generated protobuf models" > generated/python/gtm/models/__init__.py  
	@echo "# Generated protobuf analysis" > generated/python/gtm/analysis/__init__.py
	@echo "✅ Python protobuf generation complete!"

# Clean generated code
proto-clean:
	@echo "🧹 Cleaning generated protobuf code..."
	@rm -rf generated/
	@echo "✅ Clean complete!"

# Install protoc compiler
proto-install:
	@echo "📦 Installing protobuf compiler..."
	@if command -v brew >/dev/null 2>&1; then \
		brew install protobuf; \
	else \
		echo "Please install protoc manually"; \
	fi

# Update core dependencies for gRPC
update-deps:
	@echo "📦 Updating core dependencies for gRPC..."
	@pip install grpcio grpcio-tools grpcio-status googleapis-common-protos

# Help
help:
	@echo "GTM Analysis System - Protobuf & gRPC Build Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  proto          - Generate protobuf code for all languages"
	@echo "  proto-python   - Generate Python protobuf code only"
	@echo "  proto-clean    - Clean all generated protobuf code"
	@echo "  proto-install  - Install protobuf compiler"
	@echo "  update-deps    - Update core dependencies for gRPC"
	@echo "  help           - Show this help message"