# Module 1: Associations & Orphaned Elements Analyzer

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

# Install required packages
pip install fastapi uvicorn pydantic
```

### Step 2: Get Your GTM Container Export

**From Google Tag Manager:**
1. Open your GTM workspace
2. Click **Admin** → **Export Container**
3. Choose **Export Version** (recommended) or **Export Workspace**
4. Download and save the JSON file

### Step 3: Start the Analysis Server

```bash
# Launch the API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Confirm server is running:**
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy","service":"gtm-associations-analyzer"}
```

### Step 4: Run Analysis

Choose your preferred method:

#### Option A: Command Line
```bash
curl -X POST http://localhost:8000/analyze/associations \
  -H "Content-Type: application/json" \
  -d @your-container-export.json
```

#### Option B: Python Script
```python
import requests
import json

# Load GTM export
with open('your-container-export.json', 'r') as f:
    gtm_data = json.load(f)

# Analyze
response = requests.post(
    'http://localhost:8000/analyze/associations',
    json=gtm_data
)

# Display results
print(json.dumps(response.json(), indent=2))
```

#### Option C: API Client (Postman/Insomnia)
- **Method**: POST
- **URL**: `http://localhost:8000/analyze/associations`
- **Headers**: `Content-Type: application/json`
- **Body**: Your GTM JSON export

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

## 🏗 Technical Details

### Files
- `main.py` - FastAPI application
- `models.py` - Pydantic data models
- `associations_analyzer.py` - Core analysis logic
- `requirements.txt` - Python dependencies

### Dependencies
- FastAPI: Web framework
- Pydantic: Data validation
- Uvicorn: ASGI server

## 🔄 Integration with Other Modules

This module is part of the **Monks Sentinel** GTM Quality Assurance System:

- **Module 1**: Associations & Orphaned Elements ← *You are here*
- **Module 2**: Naming Conventions Analysis (Coming soon)
- **Module 3**: JavaScript Quality Assessment (Coming soon)
- **Module 4**: HTML Security Risk Analysis (Coming soon)

Each module operates independently but follows the same API patterns.

---

**Start analyzing your GTM containers for critical issues!** 🎯
