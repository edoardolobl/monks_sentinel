# Comprehensive gRPC Migration Plan

### 📋 **Migration Overview**
This plan migrates your GTM analysis system from HTTP/JSON to gRPC for true API agnosticism. The migration maintains backward compatibility during transition and enables universal module templates.

---

## **Phase 1: Foundation & Planning (Week 1)**

### **Step 1.1: Define Protobuf Schemas**
**Objective:** Create single source of truth for all APIs

**Tasks:**
- Analyze current `gtm_models.py` and extract all data structures
- Define `gtm_analysis.proto` with:
  - `GTMAnalysis` service interface
  - `AnalysisRequest` message (tags, triggers, variables, etc.)
  - `AnalysisResponse` message (ModuleResult format)
  - `HealthRequest/Response` for service health
  - `TestIssue` and supporting messages
- Include all GTM entity models (Tag, Trigger, Variable, etc.)
- Add version fields for API evolution

**Deliverables:**
- `proto/gtm_analysis.proto` - Complete service definition
- `proto/gtm_models.proto` - Data structure definitions

### **Step 1.2: Set Up Protobuf Compilation Pipeline**
**Objective:** Enable code generation for all supported languages

**Tasks:**
- Install protoc compiler and language-specific plugins
- Create build scripts for:
  - Python: `grpcio-tools` for generation
  - TypeScript: `@grpc/grpc-js` and `@grpc/proto-loader`
  - Future languages: Go, Rust, Java plugins
- Set up automated generation in CI/CD pipeline
- Create Makefile/Docker-based compilation

**Deliverables:**
- `scripts/generate_protobuf.sh` - Cross-language code generation
- Generated code directories: `generated/python/`, `generated/typescript/`

---

## **Phase 2: Core Orchestrator Migration (Week 2)**

### **Step 2.1: Update Core Dependencies**
**Objective:** Replace HTTP client with gRPC client

**Tasks:**
- Add gRPC dependencies to `core/requirements.txt`:
  - `grpcio==1.60.0`
  - `grpcio-tools==1.60.0`
- Update `core/Dockerfile` to include protobuf compilation
- Create gRPC client wrapper class

**Deliverables:**
- Updated `core/requirements.txt` and `core/Dockerfile`

### **Step 2.2: Implement gRPC Client Logic**
**Objective:** Replace HTTP calls with gRPC calls

**Tasks:**
- Create `grpc_client.py` with connection management
- Update `MODULE_REGISTRY` to use gRPC targets:
  ```python
  MODULE_REGISTRY = {
      "associations": {
          "target": "gtm-module-associations:50051",
          "stub_class": gtm_analysis_pb2_grpc.GTMAnalysisStub
      }
  }
  ```
- Replace `httpx.AsyncClient` with gRPC async stubs
- Implement connection pooling and error handling
- Update `run_analysis_modules()` to use gRPC calls

**Deliverables:**
- `core/grpc_client.py` - gRPC client implementation
- Updated `core/main.py` with gRPC integration

### **Step 2.3: Update Data Flow**
**Objective:** Adapt data extraction for gRPC messages

**Tasks:**
- Update `data_extractors.py` to return protobuf-compatible data
- Modify `extract_associations_data()` and others to use protobuf messages
- Ensure proper serialization of complex GTM structures
- Add protobuf message validation

**Deliverables:**
- Updated `core/data_extractors.py` for protobuf compatibility

---

## **Phase 3: Module Migration (Weeks 3-4)**

### **Step 3.1: Convert Module 1 (Python)**
**Objective:** First gRPC module implementation

**Tasks:**
- Add gRPC dependencies to `modules/module1/requirements.txt`
- Replace FastAPI with gRPC server:
  ```python
  from generated.python import gtm_analysis_pb2_grpc
  from generated.python.gtm_analysis_pb2 import AnalysisResponse

  class GTMAnalysisServicer(gtm_analysis_pb2_grpc.GTMAnalysisServicer):
      def Analyze(self, request, context):
          # Convert protobuf to dict for existing analyzer
          data = MessageToDict(request)
          analyzer = AssociationsAnalyzer(data)
          issues = analyzer.analyze_all()
          return AnalysisResponse(...)
  ```
- Update `modules/module1/main.py` to use gRPC server
- Implement gRPC health service
- Update Docker configuration for gRPC port (50051)

**Deliverables:**
- gRPC-enabled `modules/module1/main.py`
- Updated `modules/module1/Dockerfile` and `modules/module1/requirements.txt`

### **Step 3.2: Convert Module 2 (TypeScript)**
**Objective:** Second gRPC module implementation

**Tasks:**
- Add gRPC dependencies to `modules/module2/package.json`:
  - `@grpc/grpc-js`
  - `@grpc/proto-loader`
- Replace Fastify with gRPC server:
  ```typescript
  import { loadSync } from '@grpc/proto-loader';
  import { loadPackageDefinition } from '@grpc/grpc-js';

  const packageDefinition = loadSync('proto/gtm_analysis.proto');
  const gtmProto = loadPackageDefinition(packageDefinition);

  class GTMAnalysisService implements gtmProto.GTMAnalysis {
      Analyze(call: any, callback: any) {
          // Implementation
      }
  }
  ```
- Update `modules/module2/src/main.ts` for gRPC
- Implement TypeScript gRPC server with proper typing
- Update Docker configuration for gRPC port (50052)

**Deliverables:**
- gRPC-enabled `modules/module2/src/main.ts`
- Updated `modules/module2/package.json` and `modules/module2/Dockerfile`

---

## **Phase 4: Infrastructure & Testing (Week 5)**

### **Step 4.1: Update Docker Compose**
**Objective:** Configure gRPC networking

**Tasks:**
- Update `docker-compose.yml`:
  - Change module ports to gRPC standard (50051, 50052, etc.)
  - Add gRPC health checks
  - Update service dependencies
  - Configure gRPC networking options
- Update environment variables for gRPC targets
- Add protobuf compilation to Docker builds

**Deliverables:**
- Updated `docker-compose.yml` with gRPC configuration

### **Step 4.2: Implement Health Checks & Service Discovery**
**Objective:** gRPC-native health monitoring

**Tasks:**
- Implement gRPC health service in all modules
- Update orchestrator to use gRPC health checks
- Add service discovery for dynamic module registration
- Implement connection retry logic and circuit breakers

**Deliverables:**
- gRPC health service implementations
- Updated service discovery logic

### **Step 4.3: Create Universal Module Template**
**Objective:** Enable easy module creation in any language

**Tasks:**
- Create template repository with:
  - Generated protobuf code for multiple languages
  - Basic server implementation skeleton
  - Docker configuration
  - Test setup
  - Documentation
- Include language-specific examples (Python, TypeScript, Go)
- Add template generation script

**Deliverables:**
- `templates/module-template/` - Universal module starter
- `scripts/create_module.sh` - Template generator

---

## **Phase 5: Documentation & Validation (Week 6)**

### **Step 5.1: Update Documentation**
**Objective:** Complete developer guides for gRPC

**Tasks:**
- Update README.md with gRPC architecture
- Create developer guide for module creation
- Update API documentation for protobuf interfaces
- Add migration guide for existing modules

**Deliverables:**
- Updated `README.md` and module documentation
- `docs/grpc-migration-guide.md`

### **Step 5.2: Integration Testing**
**Objective:** Validate end-to-end gRPC functionality

**Tasks:**
- Test orchestrator-to-module communication
- Performance benchmarking (gRPC vs HTTP)
- Load testing with large GTM containers
- Error handling and recovery testing
- Cross-language compatibility testing

**Deliverables:**
- Test results and performance benchmarks
- Updated test suites for gRPC

---

## **Migration Considerations**

### **Risk Mitigation**
- **Backward Compatibility**: Keep HTTP endpoints during transition
- **Gradual Rollout**: Migrate one module at a time
- **Fallback Strategy**: Ability to revert to HTTP if issues arise
- **Monitoring**: Comprehensive logging and metrics

### **Timeline & Resources**
- **Total Duration**: 6 weeks
- **Team Requirements**: 1-2 developers with gRPC experience
- **Testing**: 1 week dedicated testing phase
- **Documentation**: Ongoing throughout migration

### **Success Metrics**
- All modules communicating via gRPC
- Universal template working in 3+ languages
- Performance improvement (target: 20-30% faster)
- Developer onboarding time reduced by 50%

This plan provides a complete migration path while maintaining system stability and enabling the language-agnostic framework you envisioned.