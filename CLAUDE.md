# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monks Sentinel is a modular GTM (Google Tag Manager) container quality assurance system. It's built as a microservice architecture using Python, gRPC, and Protobuf for analyzing GTM container exports to identify quality issues, orphaned elements, and security risks.

**Current Status:** Module 1 (Associations & Orphaned Elements) is complete and production-ready. Modules 2-4 are planned.

## Architecture

The system follows a **modular microservice design** where each analysis type runs as an independent gRPC service:

- **Module 1**: `modules/module1/` - Associations & Orphaned Elements Analyzer (✅ Complete)  
- **Module 2**: Naming Conventions Analysis (AI-powered via Gemini API) - Planned
- **Module 3**: JavaScript Quality Assessment (Hybrid: Procedural + AI) - Planned
- **Module 4**: HTML Security Risk Analysis (Hybrid: Procedural + AI) - Planned

Each module is self-contained with its own gRPC server, protobuf models, analyzer logic, and dependencies.

## Development Commands

### Global Orchestrator
```bash
# Start the central gRPC orchestrator
cd /Users/user/Desktop/gtm_project/core
python main.py
```

### Module 1: Associations Analyzer
```bash
# Navigate to Module 1
cd modules/module1

# Install dependencies
pip install -r requirements.txt

# Start Module 1 gRPC Service
python main.py
```

### Workspace-wide Development
```bash
# Code Quality
black .
flake8 .
mypy .

# Testing
python -m pytest
python -m pytest -v
python -m pytest --cov=.

# Generate Protobuf Stubs
python -m grpc_tools.protoc \
    -I. \
    --python_out=. \
    --grpc_python_out=. \
    proto/*.proto
```

### gRPC Service Testing
```bash
# Test individual module services
python test_grpc_pipeline.py --module associations
python test_grpc_pipeline.py --module naming
```

## Code Structure and Conventions

### Modular Architecture Overview

#### Global Orchestrator
- Centralized gRPC management service
- Module discovery and registration
- Cross-module request routing
- Unified configuration management

#### Module Structure (Reference: Module 1)
- `main.py`: gRPC service implementation
- `proto/`: Protobuf definitions
- `services/`: Core business logic
- `analyzers/`: Specific analysis implementations
- `requirements.txt`: Module dependencies
- `README.md`: Comprehensive documentation

### Architecture and Coding Standards

#### Design Principles
- **Language Agnostic**: Protobuf enables polyglot services
- **Typed Contracts**: Strict interface definitions
- **Independent Scalability**: Modules can scale independently

#### Coding Standards
- **Type Safety**: Full type annotations required
- **Interface Definition**: Protobuf as the source of truth
- **Documentation**: 
  - Google-style docstrings
  - Comprehensive protobuf comments
- **Code Quality**:
  - Strict PEP 8 compliance
  - Consistent naming conventions

#### Naming Conventions
- `snake_case`: Functions, variables, file names
- `PascalCase`: Classes, protobuf message types
- `UPPER_SNAKE_CASE`: Constants

#### Service Design Patterns
- **Single Responsibility**: One clear purpose per module
- **Stateless Services**: Minimize shared state
- **Idempotent Operations**: Safe to retry
- **Comprehensive Error Handling**: Structured error responses

### gRPC and Protobuf Best Practices
- Define clear, minimal service interfaces
- Use streaming for large payloads
- Implement robust authentication
- Design for observability (logging, metrics)
- Support graceful degradation

### Performance and Scalability
- Lightweight, compiled protobuf messages
- Concurrent request handling
- Minimal serialization overhead
- Support for horizontal scaling

## Testing GTM Analysis

The project includes `GTM-N6X9DBL_workspace677.json` as a sample GTM container export for testing analysis functionality.

## AI Integration (Future Modules)

Modules 2-4 will integrate Google Gemini API (google-genai SDK) for AI-powered analysis:
- Module 2: Company taxonomy validation and naming consistency
- Modules 3-4: Hybrid approach combining procedural checks with AI enhancement

## Important Files

- `GTM_QUALITY_SYSTEM_PLAN.md` - Detailed project architecture and planning
- `README.md` - Main project documentation
- `modules/module1/README.md` - Complete Module 1 setup and usage guide