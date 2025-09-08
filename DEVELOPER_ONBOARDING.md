# Monks Sentinel: Developer Onboarding Guide

## Overview

Monks Sentinel is a modular, language-agnostic GTM (Google Tag Manager) container quality assurance system built on gRPC microservices architecture.

## Prerequisites

### Development Environment
- Python 3.9+ (Primary Language)
- Go 1.18+ (Optional)
- TypeScript 4.5+ (Optional)
- Docker 20.10+
- Protocol Buffers Compiler (protoc)

### Required Tools
```bash
# Install global dependencies
pip install \
    grpcio \
    grpcio-tools \
    protobuf \
    mypy \
    black \
    flake8
```

## Project Structure

```
gtm_project/
├── core/           # Central orchestrator
├── modules/        # Independent analysis modules
│   ├── module1/    # Associations Analysis
│   ├── module2/    # Naming Conventions
│   ├── module3/    # JavaScript Quality
│   └── module4/    # HTML Security
├── protos/         # Shared Protocol Buffer definitions
└── templates/      # Module creation templates
```

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/monks-sentinel.git
cd monks-sentinel
```

### 2. Set Up Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Generate Protobuf Stubs
```bash
# Generate Python stubs
python -m grpc_tools.protoc \
    -I./protos \
    --python_out=. \
    --grpc_python_out=. \
    protos/*.proto

# For Go (optional)
protoc \
    -I./protos \
    --go_out=. \
    --go-grpc_out=. \
    protos/*.proto
```

## Creating a New Module

### Option 1: Use Template Generator
```bash
# Generate new module
python create_module.py \
    --name=module5 \
    --language=python \
    --type=analysis
```

### Option 2: Manual Module Creation
1. Copy module template
2. Update `proto/service.proto`
3. Implement core logic
4. Add tests
5. Update documentation

## Module Development Workflow

### Standard Module Structure
```
module_name/
├── proto/              # Service definition
│   └── service.proto
├── services/           # Core business logic
├── models/             # Data models
├── tests/              # Unit and integration tests
├── main.py             # gRPC service entry point
└── requirements.txt    # Module dependencies
```

### Implementing a New Analysis Module
1. Define protobuf service contract
2. Implement service in chosen language
3. Add comprehensive tests
4. Update central orchestrator configuration

## Testing

### Module-Level Testing
```bash
# Run module tests
python -m pytest modules/module1/tests/

# Run coverage
python -m pytest --cov=. --cov-report=xml
```

### End-to-End Testing
```bash
# Run full system test
python test_grpc_pipeline.py \
    --all-modules \
    --sample-container path/to/gtm_export.json
```

## Debugging and Monitoring

### Local Development
```bash
# Start local module
GRPC_VERBOSITY=debug \
GRPC_TRACE=all \
python main.py

# Check service health
grpc_health_probe -addr=localhost:50051
```

### Observability
- Prometheus metrics at `/metrics`
- OpenTelemetry tracing
- Structured logging

## Contributing Guidelines

### Code Quality
- 100% type coverage
- 90%+ test coverage
- Follow Google style guide
- Mandatory code reviews

### Commit Message Format
```
type(scope): brief description

- Detailed explanation of changes
- Motivation and context

Closes #issue_number
```

## Deployment

### Docker Deployment
```bash
# Build module image
docker build -t monks-sentinel-module:latest .

# Run module container
docker run -p 50051:50051 monks-sentinel-module
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: monks-sentinel-module
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: module
        image: monks-sentinel-module
        ports:
        - containerPort: 50051
```

## Troubleshooting

### Common Issues
- Protobuf version mismatches
- gRPC connection problems
- Module registration failures

### Debugging Resources
- [gRPC Python Docs](https://grpc.io/docs/languages/python/)
- [Protobuf Language Guide](https://developers.google.com/protocol-buffers/docs/overview)

## Support and Community

- [Slack Channel](https://monks-sentinel.slack.com)
- [GitHub Discussions](https://github.com/your-org/monks-sentinel/discussions)
- Weekly Community Call: Every Thursday, 2 PM UTC

## License
Apache 2.0 - See LICENSE file for details

**Happy Analyzing!** 🕵️‍♀️