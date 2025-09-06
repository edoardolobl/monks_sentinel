# GTM Governance Analyzer (Module 2)

TypeScript microservice for analyzing Google Tag Manager container governance and documentation quality.

## Overview

This module analyzes GTM containers for:

1. **Documentation Coverage** - Percentage of tags, triggers, and variables with meaningful notes/annotations
2. **Folder Organization** - Quality of folder structure and element organization
3. **Governance Best Practices** - Overall container organization and maintainability

## Architecture

- **Framework**: Fastify with TypeScript
- **Validation**: Zod schemas (equivalent to Python Pydantic)
- **Port**: 8002 (integrates with Core Orchestrator on port 8000)
- **Language-agnostic**: Communicates via JSON APIs

## API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "gtm-governance-analyzer",
  "version": "1.0.0",
  "timestamp": "2023-10-15T10:30:00.000Z"
}
```

### Governance Analysis
```bash
POST /analyze/governance
```

Request body (AnalysisRequest):
```json
{
  "tags": [...],
  "triggers": [...], 
  "variables": [...],
  "builtin_variables": [...],
  "folders": [...]
}
```

Response (ModuleResult):
```json
{
  "module": "governance",
  "status": "success",
  "issues": [
    {
      "type": "missing_documentation",
      "severity": "medium",
      "element": {...},
      "message": "Tag 'Analytics Tag' lacks proper documentation",
      "recommendation": "Add meaningful notes explaining purpose and configuration"
    }
  ],
  "summary": {
    "total_issues": 5,
    "critical": 0,
    "medium": 3,
    "low": 2,
    "documentation_coverage_percentage": 75,
    "organization_percentage": 80
  }
}
```

## Issue Types

### Documentation Issues
- `missing_documentation`: Elements without meaningful notes/annotations

### Organization Issues
- `no_folder_structure`: Container has no folder organization
- `empty_folder`: Folders with no assigned elements
- `unorganized_element`: Elements not assigned to any folder

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Testing
```bash
# Run tests with coverage
npm test

# Watch mode
npm run test:watch

# Type checking
npm run type-check
```

## Docker

### Build Image
```bash
docker build -t gtm-governance-analyzer .
```

### Run Container
```bash
docker run -p 8002:8002 gtm-governance-analyzer
```

### Environment Variables
- `PORT` - Server port (default: 8002)
- `HOST` - Server host (default: 0.0.0.0)  
- `LOG_LEVEL` - Logging level (default: info)
- `NODE_ENV` - Environment (development/production)

## Integration with Core Orchestrator

This module integrates seamlessly with the Python Core Orchestrator:

1. **Service Discovery**: Orchestrator calls Module 2 on port 8002
2. **Request Format**: Receives AnalysisRequest JSON matching Python Pydantic models
3. **Response Format**: Returns ModuleResult JSON in standardized format
4. **Health Checks**: Supports Docker health checks via `/health` endpoint
5. **Error Handling**: Returns consistent error responses

## Docker Compose Integration

Add to your `docker-compose.yml`:

```yaml
gtm-module-governance:
  build:
    context: ./modules/module2
    dockerfile: Dockerfile
  container_name: gtm-module-governance
  ports:
    - "8002:8002"
  environment:
    - NODE_ENV=production
    - LOG_LEVEL=info
  networks:
    - gtm-network
  healthcheck:
    test: ["CMD-SHELL", "curl -f http://localhost:8002/health || exit 1"]
    interval: 15s
    timeout: 5s
    retries: 5
    start_period: 45s
```

## Code Style

- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: Enforced code style and best practices  
- **Prettier**: Consistent code formatting
- **Testing**: Jest with high coverage requirements
- **Documentation**: JSDoc comments for all public methods

## Monitoring & Logging

- **Structured Logging**: JSON logs with Pino
- **Health Checks**: Built-in health monitoring
- **Error Handling**: Comprehensive error catching and reporting
- **Metrics**: Performance and analysis metrics in response summaries

## Security

- **Non-root User**: Runs as nodejs user in Docker
- **Read-only Filesystem**: Container filesystem is read-only
- **Minimal Dependencies**: Only essential packages included
- **Input Validation**: All requests validated with Zod schemas