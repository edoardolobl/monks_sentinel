# GTM Analysis Module Templates

Universal gRPC module templates for the Monks Sentinel GTM Quality Assurance System. These templates enable developers to quickly create new analysis modules in Python, TypeScript/Node.js, or Go.

## Overview

The GTM Quality Assurance System uses a **pure gRPC microservice architecture** where each analysis module runs as an independent gRPC service. Protocol Buffers serve as the single source of truth for all service definitions and data structures.

### Architecture Benefits

- **Language Agnostic**: Implement modules in any language that supports gRPC
- **High Performance**: Binary protocol with efficient serialization
- **Type Safety**: Strongly typed interfaces via Protocol Buffers
- **Scalability**: Independent services can scale horizontally
- **Maintainability**: Clear service boundaries and standardized interfaces

## Template Structure

```
templates/
├── python/           # Python gRPC module template
│   ├── main.py      # gRPC server implementation
│   ├── models.py    # Pydantic models for type safety
│   ├── {MODULE_NAME}_analyzer.py  # Core analysis logic
│   ├── requirements.txt
│   ├── Dockerfile
│   └── module.json
├── typescript/       # TypeScript/Node.js gRPC module template
│   ├── src/
│   │   ├── main.ts  # gRPC server implementation
│   │   ├── models.ts # TypeScript interfaces
│   │   └── {MODULE_NAME}Analyzer.ts # Core analysis logic
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── module.json
├── golang/          # Go gRPC module template
│   ├── cmd/
│   │   └── main.go  # gRPC server implementation
│   ├── internal/
│   │   ├── models/  # Data models
│   │   └── {MODULE_NAME}analyzer/ # Core analysis logic
│   ├── go.mod
│   ├── Dockerfile
│   └── module.json
└── README.md        # This file
```

## Quick Start

### 1. Choose Your Language

Select the template that matches your preferred programming language:
- **Python**: Best for rapid development, data analysis, AI/ML integration
- **TypeScript**: Great for web-based analysis, JSON processing
- **Go**: Optimal for high-performance, low-resource usage

### 2. Copy Template

```bash
# Copy your chosen template
cp -r templates/python modules/my-new-module
# OR
cp -r templates/typescript modules/my-new-module  
# OR
cp -r templates/golang modules/my-new-module
```

### 3. Replace Placeholders

Replace these placeholders throughout all files:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{MODULE_NAME}` | Module name (lowercase) | `javascript`, `security` |
| `{SERVICE_NAME}` | Service class name | `JavascriptAnalysisService` |
| `{ANALYZER_CLASS}` | Analyzer class name | `JavascriptAnalyzer` |
| `{REQUEST_TYPE}` | gRPC request type | `JavascriptAnalysisRequest` |
| `{PORT}` | gRPC server port | `50053`, `50054` |

### 4. Implement Analysis Logic

Each template includes placeholder methods where you implement your specific analysis:

- **Python**: `_analyze_example_pattern()` in `{MODULE_NAME}_analyzer.py`
- **TypeScript**: `analyzeExamplePattern()` in `{MODULE_NAME}Analyzer.ts`
- **Go**: `analyzeExamplePattern()` in `internal/{MODULE_NAME}analyzer/analyzer.go`

### 5. Update Proto Definitions

Add your module's service and message definitions to:
- `/proto/gtm_analysis.proto` - Service definitions
- `/proto/gtm_models.proto` - Data models (if needed)

## Template Features

### All Templates Include

✅ **gRPC Server Implementation**
- Async/concurrent request handling
- Health check endpoints
- Graceful shutdown
- Error handling and recovery

✅ **Protobuf Integration**
- Generated client/server code
- Type-safe message handling
- Request/response conversion utilities

✅ **Analysis Framework**
- Standardized issue reporting (`TestIssue`)
- Module result structure (`ModuleResult`)
- Severity levels and categorization

✅ **Production Ready**
- Docker containerization
- Health checks and monitoring
- Security best practices (non-root user)
- Logging and observability

✅ **Development Tools**
- Build scripts and automation
- Testing framework setup
- Code formatting and linting
- Development server with hot reload

## Language-Specific Features

### Python Template
- **Pydantic Models**: Type validation and serialization
- **AsyncIO**: High-performance async gRPC server
- **Structured Logging**: Configurable logging levels
- **Virtual Environment**: Isolated dependencies

### TypeScript Template
- **Type Safety**: Full TypeScript type checking
- **Modern Node.js**: Latest ES features and async patterns
- **NPM Scripts**: Automated build and development workflows
- **ESLint + Prettier**: Code quality tools

### Go Template
- **Performance**: Minimal resource usage and fast startup
- **Standard Library**: Leverages Go's built-in concurrency
- **Module System**: Clean dependency management
- **Static Binary**: Self-contained deployment artifact

## Development Workflow

### 1. Initial Setup

```bash
# Navigate to your new module
cd modules/my-new-module

# Install dependencies (language-specific)
pip install -r requirements.txt        # Python
npm install                            # TypeScript
go mod download                        # Go
```

### 2. Generate Protobuf Code

```bash
# From project root, regenerate protobuf files
make proto-generate
```

### 3. Implement Analysis Logic

Edit the analyzer file and implement your specific analysis patterns:

```python
# Python example
def _analyze_example_pattern(self) -> List[TestIssue]:
    issues = []
    for tag in self.tags:
        if not tag.get("name"):
            issues.append(create_issue(
                "missing_name",
                "medium",
                tag,
                f"Tag {tag.get('id')} is missing a name",
                "Add a descriptive name to the tag"
            ))
    return issues
```

### 4. Test Your Module

```bash
# Run development server (language-specific)
python main.py                         # Python
npm run dev                           # TypeScript  
go run cmd/main.go                    # Go
```

### 5. Containerize

```bash
# Build Docker image
docker build -t gtm-my-module .

# Test container
docker run -p 50053:50053 gtm-my-module
```

## Integration with GTM System

### Service Discovery

Update your `module.json` to specify:
- Required GTM elements (`needs`)
- Output data types (`produces`)  
- Resource requirements
- Capabilities

### gRPC Orchestrator Integration

The core orchestrator will:
1. Discover your module via `module.json`
2. Extract required data based on `needs`
3. Convert to your module's protobuf format
4. Send gRPC requests to your service
5. Aggregate results with other modules

### Port Allocation

Use these port conventions:
- `50051`: Module 1 (Associations)
- `50052`: Module 2 (Governance)  
- `50053`: Module 3 (JavaScript)
- `50054`: Module 4 (HTML Security)
- `5005X`: Additional modules

## Best Practices

### Analysis Implementation

1. **Fail Fast**: Validate input data early
2. **Structured Issues**: Use consistent issue types and severities
3. **Performance**: Process data efficiently, avoid N+1 patterns
4. **Error Handling**: Gracefully handle malformed data
5. **Logging**: Include contextual information for debugging

### gRPC Services

1. **Health Checks**: Always implement health check endpoints
2. **Timeouts**: Set appropriate request timeouts
3. **Resource Management**: Clean up resources properly
4. **Versioning**: Use semantic versioning for proto changes
5. **Documentation**: Document service methods and message fields

### Deployment

1. **Security**: Run as non-root user in containers
2. **Monitoring**: Expose metrics and health endpoints
3. **Resource Limits**: Set appropriate memory/CPU limits
4. **Graceful Shutdown**: Handle termination signals properly
5. **Configuration**: Use environment variables for config

## Testing

### Unit Tests

Each template includes testing framework setup:
- **Python**: `pytest` with async support
- **TypeScript**: `jest` with TypeScript integration  
- **Go**: Built-in `go test` framework

### Integration Tests

Test your gRPC service:

```bash
# Use grpcurl to test endpoints
grpcurl -plaintext localhost:50053 gtm.analysis.v1.HealthService/CheckHealth

# Test analysis endpoint with sample data
grpcurl -plaintext -d '{"request_id":"test-123"}' \
  localhost:50053 gtm.analysis.v1.YourAnalysisService/AnalyzeYourModule
```

### Load Testing

Use tools like `ghz` for gRPC load testing:

```bash
ghz --insecure --proto ../../proto/gtm_analysis.proto \
    --call gtm.analysis.v1.YourAnalysisService.AnalyzeYourModule \
    --data '{"request_id":"load-test"}' \
    --total 1000 --concurrency 10 \
    localhost:50053
```

## Common Patterns

### Issue Creation

```python
# Python
issue = create_issue(
    issue_type="naming_violation", 
    severity="medium",
    element={"id": "tag_123", "name": "bad-name"},
    message="Tag name doesn't follow naming convention",
    recommendation="Use camelCase for tag names"
)
```

### Data Extraction

```typescript
// TypeScript
const extractTagData = (grpcRequest: YourAnalysisRequest): TagData[] => {
  return grpcRequest.getTagsList().map(tag => ({
    id: tag.getId(),
    name: tag.getName(),
    type: tag.getType()
  }));
};
```

### Error Handling

```go
// Go
func (a *YourAnalyzer) AnalyzeAll() ([]models.TestIssue, error) {
    if err := a.validateData(); err != nil {
        return nil, fmt.Errorf("data validation failed: %w", err)
    }
    
    issues, err := a.analyzePattern()
    if err != nil {
        return nil, fmt.Errorf("analysis failed: %w", err) 
    }
    
    return issues, nil
}
```

## Troubleshooting

### Common Issues

1. **Protobuf Import Errors**
   - Ensure protobuf files are generated: `make proto-generate`
   - Check import paths in your language's generated code

2. **Port Conflicts**
   - Verify no other services are using your assigned port
   - Update Docker Compose port mappings

3. **Type Conversion Errors**
   - Check protobuf to internal data structure conversions
   - Verify all required fields are present

4. **Performance Issues**
   - Profile your analysis logic for bottlenecks
   - Consider streaming for large datasets
   - Implement request pagination if needed

### Debug Mode

Enable debug logging:
```bash
# Environment variables for debug mode
export LOG_LEVEL=debug
export GRPC_VERBOSITY=debug
export GRPC_TRACE=all
```

## Contributing

When extending templates:

1. **Maintain Consistency**: Follow existing patterns across languages
2. **Update Documentation**: Include your changes in this README
3. **Test All Languages**: Verify changes work in all three templates
4. **Backward Compatibility**: Avoid breaking existing template usage

## Support

For questions and issues:
1. Check existing module implementations in `/modules/`
2. Review gRPC service definitions in `/proto/`
3. Refer to existing documentation in `/docs/`
4. Test with the provided sample GTM container export

## Next Steps

After creating your module:

1. **Implement Analysis Logic**: Replace template placeholders with your specific analysis
2. **Add Tests**: Write unit and integration tests for your analyzer
3. **Update Proto**: Add any new message types or service methods
4. **Document**: Create module-specific README with usage examples
5. **Deploy**: Add to Docker Compose and orchestrator configuration

---

**Happy Analyzing!** 🚀

These templates provide everything you need to create production-ready GTM analysis modules. Focus on implementing your analysis logic while the templates handle the gRPC infrastructure, Docker deployment, and system integration.