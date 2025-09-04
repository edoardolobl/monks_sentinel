# Code Style and Conventions

## Python Style Guidelines
- **PEP 8** compliance for code formatting
- **Type hints** required for all functions and methods
- **Docstrings** in Google format for all classes and functions
- **Pydantic models** for data validation and schema definition

## Naming Conventions
- **Classes**: PascalCase (e.g., `GTMContainer`, `AssociationsAnalyzer`)
- **Functions/Methods**: snake_case (e.g., `get_orphaned_triggers`)
- **Variables**: snake_case (e.g., `tag_id`, `variable_references`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)

## Project-Specific Patterns
- Use Pydantic models for all data structures
- Keep analyzers as simple, focused classes
- Return results as dictionaries for JSON serialization
- Use helper methods in models for common operations
- Prefer composition over inheritance
- Keep modules independent and testable

## Error Handling
- Use custom exceptions when appropriate
- Validate input data with Pydantic
- Return structured error responses
- Log errors appropriately

## Code Organization
- One analyzer per module/file
- Helper functions at module level
- Configuration as constants at top of file
- Clear separation of concerns