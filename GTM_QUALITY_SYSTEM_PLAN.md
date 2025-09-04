# GTM Container Quality Assurance System - Project Plan

## Architecture Overview
- **Modular FastAPI Design**: Each test category as independent API endpoints
- **Python Stack**: FastAPI + Pydantic + Google GenAI SDK + AST analysis tools
- **Microservice Architecture**: Scalable, maintainable, and easily extensible

## Key Findings & Technical Stack

### GTM Container JSON Schema Analysis:
- Container structure: `tag[]`, `trigger[]`, `variable[]`, `builtInVariable[]`
- Tags have `type` (html, jsm, etc.), `firingTriggerId[]`, `parameter[]`
- Variables have `type` ("j" for JavaScript, "jsm" for custom JS)
- Rich metadata: fingerprints, folders, consent settings

### Gemini API Integration:
- **New SDK**: `google-genai` (replaces deprecated `google-generativeai`)
- **Installation**: `pip install google-genai`
- Simple client setup with API key or Vertex AI
- Perfect for naming convention analysis and code quality assessment

### Core Libraries:
- **Pydantic**: JSON validation, schema modeling, data parsing
- **FastAPI**: Auto-documentation, async support, type hints
- **AST/Tree-sitter**: JavaScript code analysis for custom variables

## Implementation Plan - 4 Core Modules

### Module 1: Associations & Orphaned Elements API ✅ *Fully Procedural*
```
POST /analyze/associations
- Orphaned triggers (no tag references)
- Unused variables (no references in tags/triggers/variables)
- Dangling references (missing triggerIds/variableIds)
- Built-in variables validation
- Setup/blocking tags circular dependency check
```

### Module 2: Naming Conventions API 🤖 *Gemini-Powered*
```
POST /analyze/naming-conventions
- Company taxonomy validation via Gemini API
- Consistency scoring
- Naming pattern detection and recommendations
```

### Module 3: JavaScript Variables Quality API 🔀 *Hybrid Approach*
```
POST /analyze/javascript-quality
Procedural Checks:
- Function wrapper validation
- Side-effect detection (dataLayer.push, DOM writes)
- Forbidden API usage (document.write, eval)
- Complexity metrics (lines, nesting, loops)
- Dependency safety (window.* globals)

Gemini Enhancement:
- Code quality scoring
- Security risk assessment
- Best practices evaluation
```

### Module 4: HTML Tags Risk Assessment API 🔀 *Hybrid Approach*
```
POST /analyze/html-security
Procedural Checks:
- Script wrapper validation
- Blocking pattern detection (document.write, sync scripts)
- CSP violation detection (inline handlers, style injections)
- Redundancy detection (duplicate library loads)

Gemini Enhancement:
- Security risk scoring
- Ad-block resistance analysis
- Performance impact assessment
```

## Technical Architecture

### Data Models (Pydantic)
```python
class GTMContainer(BaseModel):
    exportFormatVersion: int
    containerVersion: ContainerVersion
    
class Tag(BaseModel):
    tagId: str
    name: str
    type: str  # html, jsm, etc.
    firingTriggerId: List[str]
    parameter: List[Parameter]

class Variable(BaseModel):
    variableId: str
    name: str
    type: str  # j, jsm, etc.
    parameter: List[Parameter]
```

### Service Layer Architecture
```
/services/
  ├── associations_analyzer.py
  ├── naming_conventions_analyzer.py  
  ├── javascript_analyzer.py
  ├── html_security_analyzer.py
  └── gemini_client.py
```

### API Endpoints Structure
```
FastAPI App
├── /analyze/associations
├── /analyze/naming-conventions
├── /analyze/javascript-quality
├── /analyze/html-security
└── /health (system health check)
```

## Key Implementation Considerations

1. **JSON Processing**: Use Pydantic models for robust GTM JSON parsing and validation
2. **JavaScript Analysis**: Leverage Python's `ast` module + regex for code quality checks
3. **Gemini Integration**: Use structured prompts with context about GTM best practices
4. **Error Handling**: Comprehensive validation with detailed error responses
5. **Scalability**: Async FastAPI handlers for concurrent analysis requests
6. **Documentation**: Auto-generated OpenAPI docs with FastAPI

## Next Steps for MVP Development
1. Create Pydantic models for GTM schema
2. Implement Module 1 (Associations) - purely procedural
3. Set up Gemini client integration
4. Build FastAPI application structure
5. Develop comprehensive test suite

## Project Philosophy
- **Simplicity over complexity**: Keep implementation straightforward and maintainable
- **Accuracy over features**: Ensure reliable results before adding complexity
- **Modular design**: Each module should work independently
- **Extensible architecture**: Easy to add new analysis types