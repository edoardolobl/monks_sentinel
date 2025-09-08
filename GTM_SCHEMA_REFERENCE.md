# GTM Container Schema Reference

## Overview

This document provides a comprehensive reference for the Google Tag Manager (GTM) container schema, focusing on the data structures and elements that can be analyzed and validated using the Monks Sentinel system.

## Container Structure

### Root Elements
```json
{
  "containerVersion": {
    "accountId": "string",
    "containerId": "string",
    "containerVersionId": "string",
    "name": "string",
    "description": "string"
  },
  "tags": [...],
  "triggers": [...],
  "variables": [...],
  "builtInVariables": [...],
  "customTemplates": [...]
}
```

## Core Elements

### 1. Tags
```protobuf
message Tag {
  string tagId = 1;
  string name = 2;
  string type = 3;  // e.g., "ua", "analytics", "adwords"
  repeated string firingTriggerId = 4;
  repeated string blockingTriggerId = 5;
  map<string, string> parameters = 6;
}
```

#### Tag Types
- Web Analytics
- Conversion Tracking
- Remarketing
- Custom HTML/JavaScript
- Third-party Integrations

### 2. Triggers
```protobuf
message Trigger {
  string triggerId = 1;
  string name = 2;
  string type = 3;  // click, pageview, custom event
  TriggerCondition filter = 4;
}

message TriggerCondition {
  string variable = 1;
  string operator = 2;
  string value = 3;
}
```

#### Trigger Types
- Page View
- Click
- Custom Event
- Form Submission
- JavaScript Error
- Timer
- Scroll Depth

### 3. Variables
```protobuf
message Variable {
  string variableId = 1;
  string name = 2;
  string type = 3;  // constant, dataLayer, JS
  bool isBuiltIn = 4;
  string value = 5;
}
```

#### Variable Categories
- Constant
- DataLayer
- URL Parameters
- JavaScript
- First-Party Cookies
- Built-in GTM Variables

## Advanced Analysis Patterns

### 1. Orphaned Element Detection
- Identify tags without firing triggers
- Find unused variables
- Detect dangling references

### 2. Configuration Health Checks
```protobuf
message AnalysisResult {
  repeated Tag orphanedTags = 1;
  repeated Variable unusedVariables = 2;
  repeated DanglingReference danglingReferences = 3;
  SecurityRisk securityRisks = 4;
}
```

### 3. Security Risk Assessment
```protobuf
message SecurityRisk {
  bool containsCustomHtml = 1;
  repeated string potentiallyDangerousScripts = 2;
  bool hasUnrestrictedVariables = 3;
}
```

## Protobuf Schema Definition
```protobuf
syntax = "proto3";

package gtm_analysis;

message GTMContainer {
  ContainerVersion containerVersion = 1;
  repeated Tag tags = 2;
  repeated Trigger triggers = 3;
  repeated Variable variables = 4;
}

// ... (other message definitions)
```

## Common Analysis Use Cases

### Naming Convention Validation
- Enforce prefix/suffix rules
- Check for descriptive names
- Ensure consistent casing

### Performance Optimization
- Identify redundant tags
- Detect unnecessary trigger conditions
- Analyze script loading strategies

### Compliance Checks
- GDPR data collection validation
- Cookie consent tracking
- Data privacy compliance

## Best Practices

### Tag Management
- Use descriptive, consistent names
- Minimize tag count
- Implement proper trigger logic
- Use built-in variables judiciously

### Performance Recommendations
- Prioritize asynchronous tags
- Use tag sequencing
- Implement lazy loading
- Minimize custom HTML tags

## Troubleshooting Guide

### Common Issues
- Misconfigured triggers
- Circular variable references
- Conflicting tag priorities
- Excessive tag load times

### Debugging Tips
- Use GTM Preview Mode
- Enable verbose logging
- Test incrementally
- Use Monks Sentinel for comprehensive analysis

## Versioning and Migration

### Schema Evolution
- Backwards compatibility
- Incremental updates
- Version-aware analysis

## External Resources
- [GTM Developer Documentation](https://developers.google.com/tag-manager)
- [Google Analytics Implementation Guide](https://support.google.com/analytics)
- [Web Performance Best Practices](https://web.dev/fast/)

## Appendix: Full Example

```json
{
  "containerVersion": {
    "accountId": "123456",
    "containerId": "GTM-ABCDEF",
    "name": "Website Tracking Container"
  },
  "tags": [
    {
      "tagId": "1",
      "name": "Google Analytics",
      "type": "ua",
      "firingTriggerId": ["pageview"]
    }
  ],
  "triggers": [
    {
      "triggerId": "pageview",
      "name": "All Pages",
      "type": "pageview"
    }
  ]
}
```

**Expert GTM Analysis, Simplified!**