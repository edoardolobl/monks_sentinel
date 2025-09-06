# Protocol Buffer Compilation Pipeline

This document describes the comprehensive Protocol Buffer compilation setup for the Monks Sentinel GTM Quality Assurance System.

## Overview

The protobuf compilation pipeline supports multiple programming languages and provides consistent code generation across development and CI/CD environments.

### Supported Languages
- **Python** (3.11+) - Primary backend language
- **TypeScript** (Node.js 20+) - Frontend and service interfaces
- **Go** (1.21+) - High-performance services
- **Rust** (1.75+) - Future system components

### Key Features
- Cross-platform compilation (macOS, Linux)
- Docker-based consistent environments
- Automated CI/CD integration
- Comprehensive validation and testing
- Easy-to-use development commands

## Quick Start

### 1. Install Dependencies

```bash
# Install protoc and language tools
./scripts/install_protoc.sh

# Or using Make
make proto-install
```

### 2. Generate Code

```bash
# Generate for all languages
make proto

# Generate for specific language
make proto-python
make proto-typescript
make proto-go
make proto-rust

# Using script directly
./scripts/generate_protobuf.sh --python
```

### 3. Using Docker (Alternative)

```bash
# Build Docker image
make proto-docker-build

# Generate using Docker
make proto-docker
```

## File Structure

```
gtm_project/
├── proto/                          # Protocol buffer definitions
│   ├── gtm_models.proto            # GTM data models
│   └── gtm_analysis.proto          # Analysis service definitions
├── generated/                      # Generated code (auto-created)
│   ├── python/gtm/                 # Python packages
│   ├── typescript/src/gtm/         # TypeScript modules
│   ├── go/gtm/                     # Go packages
│   └── rust/src/                   # Rust modules
├── scripts/
│   ├── install_protoc.sh           # Tool installation
│   └── generate_protobuf.sh        # Code generation
├── Dockerfile.protoc               # Docker compilation environment
├── Makefile                        # Development commands
├── requirements-proto.txt          # Python protobuf dependencies
└── .github/workflows/protobuf.yml  # CI/CD pipeline
```

## Proto Files

### gtm_models.proto
Defines comprehensive GTM data structures:
- **Tag, Trigger, Variable** - Core GTM elements
- **Container, ContainerVersion** - Container structure
- **Parameter, ConsentSettings** - Configuration and privacy
- **APIVersion** - Schema evolution support

### gtm_analysis.proto
Defines gRPC service interfaces:
- **GTMAnalysisService** - Main orchestrator
- **ModuleResult, TestIssue** - Analysis results
- **Module-specific services** - Specialized analyzers
- **Health checking** - Service monitoring

## Development Commands

### Using Makefile

```bash
# Protocol Buffer Commands
make proto                 # Generate all languages
make proto-clean          # Clean generated code
make proto-python         # Python only
make proto-typescript     # TypeScript only
make proto-go             # Go only
make proto-rust           # Rust only
make proto-docker         # Docker compilation
make proto-install        # Install tools

# Development
make help                 # Show all commands
make check-tools          # Verify tool installation
make status               # Show project status
```

### Using Scripts Directly

```bash
# Installation
./scripts/install_protoc.sh

# Generation with options
./scripts/generate_protobuf.sh --help
./scripts/generate_protobuf.sh --python --clean
./scripts/generate_protobuf.sh --typescript --no-validate
```

## Language-Specific Setup

### Python
```bash
# Install dependencies
pip install -r requirements-proto.txt

# Generated code location
generated/python/gtm/models/
generated/python/gtm/analysis/

# Usage in code
from gtm.models import *
from gtm.analysis import *
```

### TypeScript
```bash
# Install dependencies
npm install -g ts-proto @types/google-protobuf google-protobuf

# Generated code location
generated/typescript/src/gtm/

# Usage in code
import { GTMContainer } from './generated/typescript/src/gtm';
```

### Go
```bash
# Install dependencies
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Generated code location
generated/go/gtm/

# Usage in code
import "github.com/monks-sentinel/gtm-proto/gtm/models/v1"
```

### Rust
```bash
# Install dependencies
cargo install protobuf-codegen

# Generated code location
generated/rust/src/

# Usage in code
use gtm_proto::{gtm_models, gtm_analysis};
```

## Docker Compilation

### Build Image
```bash
docker build -f Dockerfile.protoc -t gtm-protoc .
```

### Generate Code
```bash
# All languages
docker run --rm -v $(pwd):/workspace gtm-protoc

# Specific language
docker run --rm -v $(pwd):/workspace gtm-protoc --python
```

### Docker Features
- **Multi-language support** - All tools pre-installed
- **Consistent environment** - Same results across machines
- **Version pinning** - Specific tool versions
- **Health checks** - Verify tool functionality

## CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/protobuf.yml` provides:
- **Automatic compilation** on proto file changes
- **Multi-language matrix** builds
- **Validation and testing** of generated code
- **Docker compilation** testing
- **Artifact storage** for generated code

### Triggers
- Push to `main` or `develop` branches
- Pull requests with proto changes
- Manual workflow dispatch
- Scheduled weekly runs

### Configuration
```yaml
env:
  PROTOBUF_VERSION: '25.1'
  GO_VERSION: '1.21'
  NODE_VERSION: '20'
  PYTHON_VERSION: '3.11'
  RUST_VERSION: '1.75.0'
```

## Troubleshooting

### Common Issues

#### 1. protoc not found
```bash
# Install protoc
./scripts/install_protoc.sh

# Add to PATH
export PATH="$HOME/.local/bin:$PATH"
```

#### 2. Language plugin missing
```bash
# Python
pip install grpcio-tools

# TypeScript
npm install -g ts-proto

# Go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

# Rust
cargo install protobuf-codegen
```

#### 3. Import errors in generated Python code
The generation script automatically fixes relative imports in Python files.

#### 4. Docker build fails
Check that Docker is running and has sufficient resources.

### Validation

The system includes comprehensive validation:
- **Syntax checking** - Proto file validation
- **Compilation testing** - Language-specific validation  
- **Import resolution** - Cross-file dependency checks
- **API compatibility** - Version compatibility verification

## Best Practices

### Proto File Organization
- Use semantic versioning in package names
- Reserve field numbers for future use
- Document all messages and fields
- Use appropriate field numbering strategy

### Code Generation
- Always run generation after proto changes
- Commit generated code to version control
- Use CI/CD to ensure consistency
- Validate generated code before deployment

### Development Workflow
1. Modify proto files
2. Run `make proto` or language-specific command
3. Test generated code compilation
4. Commit both proto and generated files
5. CI/CD validates changes

## Version Management

### Tool Versions
- **protoc**: 25.1 (latest stable)
- **grpcio-tools**: 1.60.0
- **ts-proto**: 1.165.0
- **protoc-gen-go**: latest
- **protobuf-codegen**: 3.4.0

### Upgrading
1. Update version numbers in scripts
2. Test compilation with new versions
3. Update CI/CD configuration
4. Regenerate all code
5. Validate system compatibility

## Performance Considerations

### Large Proto Files
- Use field numbering efficiently
- Consider message splitting for very large definitions
- Enable compiler optimizations where available

### Build Times
- Cache tool installations
- Use Docker for consistent environments
- Parallelize language-specific generation
- Skip validation during development if needed

## Support

### Getting Help
- Check this documentation first
- Run `make help` for command reference
- Use `./scripts/generate_protobuf.sh --help` for script options
- Check CI/CD logs for debugging

### Reporting Issues
Include:
- Operating system and version
- Tool versions (`protoc --version`, etc.)
- Full error messages
- Steps to reproduce

## Future Enhancements

- **C#/.NET** language support
- **Swift** for iOS integration  
- **Kotlin** for Android services
- **Protocol buffer plugins** for custom validation
- **Buf** integration for advanced proto management
- **gRPC-Web** for browser compatibility