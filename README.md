# Monks Sentinel 🛡️
### GTM Container Quality Assurance System

A comprehensive, modular system for analyzing Google Tag Manager (GTM) containers to ensure health, quality, and compliance. Built with Python, FastAPI, and AI-powered analysis.

## 🎯 Overview

Monks Sentinel helps you maintain clean, reliable GTM implementations by automatically detecting:

- **Association Issues**: Orphaned triggers, unused variables, dangling references
- **Naming Convention Problems**: Inconsistent taxonomy and naming patterns
- **JavaScript Quality Issues**: Code vulnerabilities, side effects, complexity problems
- **HTML Security Risks**: CSP violations, blocking patterns, performance issues

## 🏗️ Architecture

**Modular Microservice Design**: Each analysis type runs as an independent API endpoint, allowing for:
- **Scalable deployment** - Run only what you need
- **Easy maintenance** - Update modules independently  
- **Flexible integration** - Use individual modules or combine them

```
Monks Sentinel
├── Module 1: Associations & Orphaned Elements ✅ (Complete)
├── Module 2: Naming Conventions (AI-powered) 🚧
├── Module 3: JavaScript Quality Assessment 🚧  
└── Module 4: HTML Security Risk Analysis 🚧
```

## 🚀 Quick Start

### Currently Available: Module 1

**Associations & Orphaned Elements Analyzer** - Detect critical container health issues.

```bash
# Navigate to Module 1
cd modules/module1

# Install and start
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Analyze your GTM container
curl -X POST http://localhost:8000/analyze/associations \
  -H "Content-Type: application/json" \
  -d @your-gtm-export.json
```

[→ Complete Module 1 Documentation](modules/module1/README.md)

## 📊 What Each Module Analyzes

### Module 1: Associations & Orphaned Elements ✅
**Status**: Production Ready  
**Type**: Fully Procedural Analysis

- ⚠️ **Dangling references** (critical - can break tracking)
- 🧹 **Orphaned triggers** (cleanup recommendation)
- 🧹 **Unused variables** (cleanup recommendation)  
- ⚙️ **Built-in variable issues** (configuration fix)
- ⚙️ **Setup/blocking tag problems** (configuration fix)

### Module 2: Naming Conventions 🚧
**Status**: Planned  
**Type**: AI-Powered via Gemini API

- 🤖 **Company taxonomy validation**
- 📊 **Consistency scoring**
- 💡 **Naming pattern recommendations**
- 🎯 **Best practices alignment**

### Module 3: JavaScript Quality Assessment 🚧
**Status**: Planned  
**Type**: Hybrid (Procedural + AI Enhancement)

**Procedural Checks:**
- ✅ Function wrapper validation
- 🚫 Side-effect detection (dataLayer.push, DOM writes)
- ⛔ Forbidden API usage (document.write, eval)
- 📈 Complexity metrics (lines, nesting, loops)
- 🔍 Dependency safety (window.* globals)

**AI Enhancement:**
- 🎯 Code quality scoring
- 🛡️ Security risk assessment  
- ⭐ Best practices evaluation

### Module 4: HTML Security Risk Assessment 🚧
**Status**: Planned  
**Type**: Hybrid (Procedural + AI Enhancement)

**Procedural Checks:**
- 🏷️ Script wrapper validation
- 🚫 Blocking pattern detection
- 🛡️ CSP violation detection  
- 🔄 Redundancy detection (duplicate library loads)

**AI Enhancement:**
- 📊 Security risk scoring
- 🚀 Performance impact assessment
- 🔒 Ad-block resistance analysis

## 🛠️ Technology Stack

- **Backend**: Python 3.7+, FastAPI, Pydantic
- **AI Integration**: Google Gemini API (google-genai SDK)
- **Code Analysis**: AST parsing, regex patterns
- **Architecture**: Microservices, REST APIs
- **Deployment**: Docker-ready, cloud-native

## 📁 Project Structure

```
monks_sentinel/
├── README.md                    # This file
├── GTM_QUALITY_SYSTEM_PLAN.md   # Detailed project plan
├── modules/
│   └── module1/                 # Associations analyzer
│       ├── README.md            # Module 1 documentation
│       ├── main.py              # FastAPI application
│       ├── models.py            # Pydantic data models
│       ├── associations_analyzer.py # Core analysis logic
│       └── requirements.txt     # Dependencies
└── GTM-N6X9DBL_workspace677.json # Sample GTM export
```

## 🚦 Getting Started

1. **Choose your module** based on your immediate needs
2. **Follow the module-specific README** for detailed setup instructions
3. **Export your GTM container** from Google Tag Manager
4. **Run the analysis** and get actionable insights
5. **Fix issues** based on priority recommendations

## 🔄 Typical Workflow

1. **Export** GTM container from your workspace
2. **Analyze** using appropriate module(s)
3. **Review** results and prioritize issues
4. **Fix** critical problems first (dangling references)
5. **Clean up** unused elements
6. **Re-export** and verify fixes
7. **Schedule** regular health checks

## 🎯 Use Cases

- **QA Teams**: Automated container validation before deployment
- **GTM Specialists**: Regular health checks and cleanup
- **Development Teams**: CI/CD integration for container quality
- **Agencies**: Client container auditing and maintenance
- **Enterprise**: Large-scale GTM governance and compliance

## 🚀 Future Roadmap

- ✅ **Module 1**: Associations & Orphaned Elements (Complete)
- 🚧 **Module 2**: Naming Conventions
- 🚧 **Module 3**: JavaScript Quality
- 🚧 **Module 4**: HTML Security
- 🔮 **Web Interface**: User-friendly dashboard
- 🔮 **Batch Processing**: Multi-container analysis

## 🤝 Contributing

We welcome contributions! Each module is independent, making it easy to contribute to specific areas of expertise.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

- **Documentation**: Check module-specific READMEs
- **Issues**: Use GitHub Issues for bug reports
- **Questions**: Start a Discussion for usage questions

---

**Start with Module 1 to identify critical GTM container issues today!** 🛡️

[→ Get Started with Module 1](modules/module1/README.md)
