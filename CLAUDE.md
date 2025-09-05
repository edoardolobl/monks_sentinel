# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monks Sentinel is a modular GTM (Google Tag Manager) container quality assurance system. It's built as a microservice architecture using Python, FastAPI, and Pydantic for analyzing GTM container exports to identify quality issues, orphaned elements, and security risks.

**Current Status:** Module 1 (Associations & Orphaned Elements) is complete and production-ready. Modules 2-4 are planned.

## Architecture

The system follows a **modular microservice design** where each analysis type runs as an independent API endpoint:

- **Module 1**: `modules/module1/` - Associations & Orphaned Elements Analyzer (✅ Complete)  
- **Module 2**: Naming Conventions Analysis (AI-powered via Gemini API) - Planned
- **Module 3**: JavaScript Quality Assessment (Hybrid: Procedural + AI) - Planned
- **Module 4**: HTML Security Risk Analysis (Hybrid: Procedural + AI) - Planned

Each module is self-contained with its own FastAPI app, models, analyzer logic, and dependencies.

## Development Commands

### Module 1 (Current)
```bash
# Navigate to Module 1
cd modules/module1

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test health endpoint
curl http://localhost:8000/health

# Run analysis (requires GTM JSON export)
curl -X POST http://localhost:8000/analyze/associations \
  -H "Content-Type: application/json" \
  -d @GTM-N6X9DBL_workspace677.json
```

### General Python Development
```bash
# Format code (when configured)
black .
flake8 .
mypy .

# Run tests (when test files exist)
python -m pytest
python -m pytest -v
python -m pytest --cov=.
```

## Code Structure and Conventions

### Module Structure (Module 1 as reference)
- `main.py` - FastAPI application with health check and analysis endpoints
- `models.py` - Pydantic models for GTM container structure validation
- `associations_analyzer.py` - Core analysis logic as focused classes
- `requirements.txt` - Python dependencies
- `README.md` - Module-specific documentation

### Coding Standards
- **Type hints required** for all functions and methods
- **Pydantic models** for all data structures and validation
- **Google-style docstrings** for classes and functions  
- **PEP 8 compliance** for formatting
- **snake_case** for functions/variables, **PascalCase** for classes
- **One analyzer per module/file** principle
- **Return structured dictionaries** for JSON serialization

### Key Patterns
- Use Pydantic for data validation and schema definition
- Keep analyzers as simple, focused classes with clear methods
- Return analysis results as structured dictionaries
- Use helper methods in models for common operations
- Modules should be independent and testable
- Follow microservice patterns - each module is self-contained

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