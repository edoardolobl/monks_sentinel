# Module 1: Associations & Orphaned Elements Analyzer

> **📢 Migration Notice**: This module has been migrated from FastAPI to gRPC. The documentation below contains legacy HTTP endpoint examples that are no longer functional. Please use the gRPC interface via the orchestrator at the project root. See the main README.md for current usage instructions.

A standalone microservice that analyzes Google Tag Manager (GTM) containers for association issues, orphaned elements, and dangling references.

## 🎯 What It Analyzes

- **Orphaned Triggers**: Triggers that exist but aren't used by any tags
- **Unused Variables**: Variables that aren't referenced anywhere in your container
- **Dangling References**: Tags trying to use triggers/variables that don't exist ⚠️ **Critical**
- **Built-in Variable Issues**: Built-in variables used but not enabled
- **Setup/Blocking Issues**: Configuration problems with setup and blocking tags

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Your GTM container export JSON file

### Installation & Setup

```bash
# Navigate to Module 1 directory
cd modules/module1

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --host 0.0.0.0 --port 8001

# Test health check
curl http://localhost:8001/health
```

### Basic Usage

**1. Export your GTM container:**
- GTM Workspace → Admin → Export Container
- Save the JSON file

**2. Analyze your container:**
```bash
curl -X POST http://localhost:8001/analyze/associations \
  -H "Content-Type: application/json" \
  -d @your-gtm-export.json
```

## 📖 Complete Tutorial

### Step 1: Environment Setup

```bash
# Navigate to module directory
cd modules/module1

# Install gRPC and module dependencies
pip install grpcio grpcio-tools protobuf
pip install -r requirements.txt

# Generate gRPC stubs
python -m grpc_tools.protoc \
    -I. \
    --python_out=. \
    --grpc_python_out=. \
    proto/gtm_associations.proto
```

### Step 2: Get Your GTM Container Export

**From Google Tag Manager:**
1. Open your GTM workspace
2. Click **Admin** → **Export Container**
3. Choose **Export Version** (recommended) or **Export Workspace**
4. Download and save the JSON file

### Step 3: Start the gRPC Service

```bash
# Launch the gRPC service
python main.py

# With optional environment configuration
ANALYSIS_MODE=strict python main.py
```

**Service Verification:**
```bash
# Using gRPC health check
grpc_health_probe -addr=localhost:50051

# Alternatively, use the test pipeline
python /Users/user/Desktop/gtm_project/test_grpc_pipeline.py \
    --module associations
```

### Step 4: Run Associations Analysis

#### Option A: Direct gRPC Client
```python
import grpc
import gtm_associations_pb2
import gtm_associations_pb2_grpc

# Create gRPC channel
channel = grpc.insecure_channel('localhost:50051')
stub = gtm_associations_pb2_grpc.AssociationsAnalyzerStub(channel)

# Prepare GTM container export
with open('your-container-export.json', 'r') as f:
    gtm_data = f.read()

# Create request
request = gtm_associations_pb2.AnalyzeRequest(
    gtm_container_json=gtm_data,
    analysis_mode='strict'
)

# Execute analysis
response = stub.AnalyzeAssociations(request)

# Process results
print(response.analysis_results)
```

#### Option B: CLI Wrapper
```bash
# Using centralized test pipeline
python /Users/user/Desktop/gtm_project/test_grpc_pipeline.py \
    --module associations \
    --input your-container-export.json \
    --output analysis_results.json
```

#### Option C: Orchestrator Integration
```bash
# Centralized analysis through main orchestrator
python /Users/user/Desktop/gtm_project/core/analyze.py \
    --module associations \
    --input your-container-export.json \
    --verbosity debug
```

### Supported Analysis Modes
- `strict`: Comprehensive, performance-focused analysis
- `detailed`: In-depth analysis with verbose logging
- `quick`: Lightweight, fast scanning

**Example Configuration:**
```bash
ANALYSIS_MODE=detailed python main.py
```

### Step 5: Understanding Results

```json
{
  "status": "success",
  "analysis": {
    "orphaned_triggers": [
      {"triggerId": "123", "name": "Unused Trigger"}
    ],
    "unused_variables": [
      {"variableId": "456", "name": "Unused Variable"}
    ],
    "dangling_references": [
      {
        "tagId": "789",
        "tagName": "Broken Tag",
        "missing_trigger": "999",
        "reference_type": "firingTriggerId"
      }
    ],
    "builtin_variable_issues": [],
    "setup_blocking_issues": []
  }
}
```

### Step 6: Taking Action

| Issue Type | Priority | Action |
|------------|----------|--------|
| **dangling_references** | 🚨 **CRITICAL** | Fix immediately - can break tracking |
| **builtin_variable_issues** | ⚠️ Medium | Enable required built-in variables |
| **setup_blocking_issues** | ⚠️ Medium | Fix tag configuration |
| **orphaned_triggers** | 📋 Low | Clean up unused triggers |
| **unused_variables** | 📋 Low | Remove to reduce bloat |

#### Fixing Dangling References (Priority 1)
1. **In GTM, find the tag** using `tagId` or `tagName`
2. **Check firing triggers** - update to correct trigger ID or create missing trigger
3. **Re-export and re-analyze** to verify fix

## 🔧 Advanced Usage

### Batch Analysis
```python
import glob
import requests
import json

# Analyze multiple containers
for export_file in glob.glob("exports/*.json"):
    with open(export_file, 'r') as f:
        gtm_data = json.load(f)
    
    response = requests.post(
        'http://localhost:8000/analyze/associations',
        json=gtm_data
    )
    
    results = response.json()
    critical_issues = len(results['analysis']['dangling_references'])
    print(f"{export_file}: {critical_issues} critical issues")
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Analyze GTM Container Health
  run: |
    curl -X POST http://localhost:8000/analyze/associations \
      -H "Content-Type: application/json" \
      -d @container-export.json \
      --fail-with-body
```

## 🛠 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: No module named 'fastapi'` | Run `pip install -r requirements.txt` |
| `Connection refused` | Ensure server runs on port 8000 |
| `Invalid GTM container format` | Verify full GTM container export |
| Analysis timeout | Large containers may need timeout adjustment |

## 📝 API Reference

### Endpoints

#### `GET /health`
Health check endpoint.

**Response:**
```json
{"status": "healthy", "service": "gtm-associations-analyzer"}
```

#### `POST /analyze/associations`
Analyze GTM container for association issues.

**Request**: GTM container export JSON  
**Response**: Analysis results with issue categories

### Response Codes
- **200**: Analysis completed successfully
- **400**: Invalid GTM container format
- **500**: Internal server error

## 🏗 Technical Architecture

### Project Structure
- `main.py`: gRPC service implementation
- `proto/gtm_associations.proto`: Service and message definitions
- `services/associations_analyzer.py`: Core business logic
- `models/`: Data model implementations
- `requirements.txt`: Dependency specifications

### Core Dependencies
- `grpcio`: Core gRPC framework
- `protobuf`: Protocol Buffers implementation
- `grpc-stubs`: Type hints for gRPC

### Performance Characteristics
- **Concurrency**: Supports multiple simultaneous analysis requests
- **Serialization**: Efficient Protocol Buffers encoding
- **Memory Management**: Streaming support for large container exports

### Monitoring and Observability
- Prometheus metrics endpoint
- Structured logging
- OpenTelemetry tracing support

### Security Features
- TLS support for secure communication
- Configurable authentication mechanisms
- Request-level access controls

## 🔄 Modular Microservices Ecosystem

### Module Catalog
- **Module 1**: Associations & Orphaned Elements Analysis ← *Current Module*
- **Module 2**: Naming Conventions Validation (AI-Enhanced)
- **Module 3**: JavaScript Quality Assessment
- **Module 4**: HTML Security Risk Analysis

### Interconnection Patterns
- **Orchestrator-Managed**: Centralized request routing
- **Language Agnostic**: Polyglot service communication via gRPC
- **Contract-First Design**: Protobuf as the integration contract

### Interaction Mechanisms
1. **Direct gRPC Call**
   - Point-to-point module communication
   - Lowest latency, highest performance

2. **Orchestrator-Mediated**
   - Centralized request management
   - Enhanced logging and tracing
   - Simplified authentication

3. **Event-Driven**
   - Publish/subscribe model
   - Asynchronous inter-module communication

### Extensibility
New modules can be seamlessly added by implementing the standard gRPC service contract and registering with the central orchestrator.

---

**Start analyzing your GTM containers for critical issues!** 🎯
