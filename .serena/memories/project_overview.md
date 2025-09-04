# GTM Container Quality Assurance System

## Purpose
A modular Python system for analyzing Google Tag Manager (GTM) container exports to identify quality issues, orphaned elements, naming convention violations, and security risks. The system is designed as a FastAPI-based microservice architecture.

## Tech Stack
- **Python 3.x** with Pydantic for data modeling
- **FastAPI** for API endpoints
- **Google GenAI SDK** for AI-powered analysis
- **AST analysis** for JavaScript code quality checks
- **JSON processing** for GTM container exports

## Project Structure
- `models.py` - Pydantic models for GTM container structure
- `associations_analyzer.py` - Module 1: Orphaned elements analysis
- `GTM_QUALITY_SYSTEM_PLAN.md` - Detailed project architecture
- Sample GTM JSON file for testing

## Current Implementation Status
- ✅ Pydantic models for GTM structure completed
- 🚧 Module 1 (Associations Analyzer) - In Progress
- ⏳ Modules 2-4 (Naming, JavaScript, HTML) - Planned

The system focuses on simplicity, accuracy, and modular design with each module working independently.