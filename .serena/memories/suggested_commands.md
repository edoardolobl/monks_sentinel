# Suggested Commands for GTM Project

## Development Commands
```bash
# Run Python scripts
python associations_analyzer.py

# Install dependencies (when requirements.txt is created)
pip install -r requirements.txt

# Run FastAPI server (when implemented)
uvicorn main:app --reload

# Python formatting and linting (when configured)
black .
flake8 .
mypy .
```

## Testing Commands
```bash
# Run tests (when test files are created)
python -m pytest
python -m pytest -v  # verbose output
python -m pytest --cov=.  # with coverage
```

## System Commands (macOS/Darwin)
```bash
# File operations
ls -la
find . -name "*.py"
grep -r "pattern" .

# Git operations
git status
git add .
git commit -m "message"

# Process monitoring
ps aux | grep python
lsof -i :8000  # check port usage
```

## Project-Specific Commands
```bash
# Validate GTM JSON structure
python -c "from models import GTMContainer; import json; GTMContainer(**json.load(open('GTM-N6X9DBL_workspace677.json')))"

# Test associations analyzer
python associations_analyzer.py
```