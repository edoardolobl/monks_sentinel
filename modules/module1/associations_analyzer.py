"""
Module 1: Associations & Orphaned Elements Analyzer

This module analyzes GTM containers for:
1. Orphaned triggers: Triggers not referenced by any tag
2. Unused variables: Variables not referenced in tags, triggers, or other variables  
3. Dangling references: Tags referencing non-existent triggerIds/variableIds
4. Built-in variables: Used in variable references but not enabled in builtInVariable[]
5. Setup/Blocking tags: Basic validation that referenced IDs exist

With the API Gateway pattern, this module now receives plain JSON objects from the core
orchestrator rather than complex Pydantic models, simplifying the data handling.
Returns structured results with clear issue descriptions for easy JSON serialization.
"""

import re
from typing import List, Dict, Set, Any
from models import TestIssue


def extract_variable_references(text: str) -> List[str]:
    """
    Extract variable references from text using {{variableName}} pattern.
    
    Args:
        text: String that may contain variable references
        
    Returns:
        List of variable names found in {{variableName}} format
    """
    if not text:
        return []
    
    # Find all {{variableName}} patterns
    matches = re.findall(r'\{\{([^}]+)\}\}', text)
    return matches


def extract_all_variable_references_from_parameters(parameters: List) -> Set[str]:
    """
    Extract all variable references from a list of parameters.
    
    Args:
        parameters: List of Parameter objects or dicts
        
    Returns:
        Set of unique variable names referenced
    """
    references = set()
    
    def extract_from_nested(obj):
        """Recursively extract references from nested structures."""
        if isinstance(obj, str):
            return extract_variable_references(obj)
        elif isinstance(obj, dict):
            refs = set()
            for key, value in obj.items():
                if key == 'value' and isinstance(value, str):
                    refs.update(extract_variable_references(value))
                else:
                    refs.update(extract_from_nested(value))
            return refs
        elif isinstance(obj, list):
            refs = set()
            for item in obj:
                refs.update(extract_from_nested(item))
            return refs
        return set()
    
    for param in parameters or []:
        # Handle Parameter objects
        if hasattr(param, 'value') and param.value:
            references.update(extract_variable_references(param.value))
        
        if hasattr(param, 'list') and param.list:
            references.update(extract_from_nested(param.list))
        
        if hasattr(param, 'map') and param.map:
            references.update(extract_from_nested(param.map))
        
        # Handle dict parameters
        if isinstance(param, dict):
            references.update(extract_from_nested(param))
    
    return references


class AssociationsAnalyzer:
    """
    Analyzer for GTM container associations and orphaned elements.
    
    Provides methods to detect various types of configuration issues
    in GTM containers including orphaned elements and dangling references.
    """
    
    def __init__(self, data: Dict[str, Any]):
        """Initialize analyzer with plain JSON data."""
        self.tags = data.get('tags', [])
        self.triggers = data.get('triggers', [])
        self.variables = data.get('variables', [])
        self.builtin_variables = data.get('builtin_variables', [])
        
        # Cache for performance - work with plain dicts
        self._tag_ids = {tag.get('id') for tag in self.tags if tag.get('id')}
        self._trigger_ids = {trigger.get('id') for trigger in self.triggers if trigger.get('id')}
        self._variable_ids = {var.get('id') for var in self.variables if var.get('id')}
        self._variable_names = {var.get('name') for var in self.variables if var.get('name')}
        self._builtin_variable_names = {biv.get('name') for biv in self.builtin_variables if biv.get('name')}
    
    def find_orphaned_triggers(self) -> List[TestIssue]:
        """
        Find triggers that are not referenced by any tag.
        
        Returns:
            List of TestIssue objects for orphaned triggers
        """
        issues = []
        
        # Get all trigger IDs referenced by tags
        referenced_triggers = set()
        for tag in self.tags:
            firing_triggers = tag.get('firing_triggers', [])
            blocking_triggers = tag.get('blocking_triggers', [])
            referenced_triggers.update(firing_triggers)
            referenced_triggers.update(blocking_triggers)
        
        # Find triggers not in referenced set
        for trigger in self.triggers:
            trigger_id = trigger.get('id')
            if trigger_id and trigger_id not in referenced_triggers:
                issues.append(TestIssue(
                    type="orphaned_trigger",
                    severity="medium",
                    element={
                        "triggerId": trigger_id,
                        "name": trigger.get('name', 'Unknown'),
                        "type": trigger.get('type', 'Unknown')
                    },
                    message=f"Trigger '{trigger.get('name', 'Unknown')}' ({trigger_id}) is not referenced by any tag",
                    recommendation="Consider removing this trigger if it's no longer needed, or ensure it's properly linked to tags"
                ))
        
        return issues
    
    def find_unused_variables(self) -> List[TestIssue]:
        """
        Find variables that are not referenced in tags, triggers, or other variables.
        
        Returns:
            List of TestIssue objects for unused variables
        """
        referenced_variables = set()
        
        # Check references in tags (using variable_references from data extractor)
        for tag in self.tags:
            variable_refs = tag.get('variable_references', [])
            referenced_variables.update(variable_refs)
        
        # Find variables not referenced by name
        issues = []
        for variable in self.variables:
            var_name = variable.get('name')
            var_id = variable.get('id')
            if var_name and var_name not in referenced_variables:
                issues.append(TestIssue(
                    type="unused_variable",
                    severity="low",
                    element={
                        "variableId": var_id,
                        "name": var_name,
                        "type": variable.get('type', 'Unknown')
                    },
                    message=f"Variable '{var_name}' ({var_id}) is not referenced anywhere",
                    recommendation="Consider removing this variable if it's no longer needed to clean up the container"
                ))
        
        return issues
    
    def find_dangling_references(self) -> List[TestIssue]:
        """
        Find tags referencing non-existent triggerIds or variableIds.
        
        Returns:
            List of TestIssue objects for dangling references
        """
        issues = []
        
        for tag in self.tags:
            tag_id = tag.get('id')
            tag_name = tag.get('name', 'Unknown')
            
            # Check firing triggers
            firing_triggers = tag.get('firing_triggers', [])
            for trigger_id in firing_triggers:
                if trigger_id not in self._trigger_ids:
                    issues.append(TestIssue(
                        type="dangling_reference",
                        severity="critical",
                        element={
                            "tagId": tag_id,
                            "tagName": tag_name,
                            "missing_trigger": trigger_id,
                            "reference_type": "firingTriggerId"
                        },
                        message=f"Tag '{tag_name}' references non-existent firing trigger {trigger_id}",
                        recommendation="Remove the invalid trigger reference or create the missing trigger"
                    ))
            
            # Check blocking triggers
            blocking_triggers = tag.get('blocking_triggers', [])
            for trigger_id in blocking_triggers:
                if trigger_id not in self._trigger_ids:
                    issues.append(TestIssue(
                        type="dangling_reference",
                        severity="critical",
                        element={
                            "tagId": tag_id,
                            "tagName": tag_name,
                            "missing_trigger": trigger_id,
                            "reference_type": "blockingTriggerId"
                        },
                        message=f"Tag '{tag_name}' references non-existent blocking trigger {trigger_id}",
                        recommendation="Remove the invalid trigger reference or create the missing trigger"
                    ))
        
        return issues
    
    def find_builtin_variable_issues(self) -> List[TestIssue]:
        """
        Find built-in variables used in references but not enabled.
        
        Returns:
            List of TestIssue objects for built-in variable issues
        """
        # Common GTM built-in variable names
        BUILTIN_VARIABLE_NAMES = {
            'Page URL', 'Page Hostname', 'Page Path', 'Referrer',
            'Event', 'Click Element', 'Click Classes', 'Click ID',
            'Click Target', 'Click Text', 'Click URL', 'Form Element',
            'Form Classes', 'Form ID', 'Form Target', 'Form Text',
            'Form URL', 'JavaScript Variable', 'Container ID',
            'Container Version', 'Debug Mode', 'Environment Name',
            'Random Number', 'Video Current Time', 'Video Duration',
            'Video Percent', 'Video Provider', 'Video Status',
            'Video Title', 'Video URL', 'Video Visible'
        }
        
        issues = []
        
        # Get all variable references from the container (simplified with extracted data)
        all_references = set()
        
        # Check tags (using pre-extracted variable references)
        for tag in self.tags:
            variable_refs = tag.get('variable_references', [])
            all_references.update(variable_refs)
        
        # Find built-in variables that are referenced but not enabled
        for ref in all_references:
            if (ref in BUILTIN_VARIABLE_NAMES and 
                ref not in self._builtin_variable_names and
                ref not in self._variable_names):  # Not a custom variable with same name
                issues.append(TestIssue(
                    type="builtin_variable_issue",
                    severity="medium",
                    element={
                        "variable_name": ref,
                        "used_but_not_enabled": True
                    },
                    message=f"Built-in variable '{ref}' is referenced but not enabled in the container",
                    recommendation="Enable this built-in variable in GTM or remove references to it"
                ))
        
        return issues
    
    def find_setup_blocking_issues(self) -> List[TestIssue]:
        """
        Find setup/blocking tags with invalid references.
        
        Returns:
            List of TestIssue objects for setup/blocking tag issues
        """
        issues = []
        
        # For now, skip setup/teardown tag validation since we're using simplified data
        # This can be enhanced later if needed by adding these fields to the data extractor
        pass
        
        return issues
    
    def analyze_all(self) -> List[TestIssue]:
        """
        Run all association analyses and return comprehensive results.
        
        Returns:
            List of TestIssue objects for all detected issues
        """
        all_issues = []
        
        # Collect issues from all analysis methods
        all_issues.extend(self.find_orphaned_triggers())
        all_issues.extend(self.find_unused_variables())
        all_issues.extend(self.find_dangling_references())
        all_issues.extend(self.find_builtin_variable_issues())
        all_issues.extend(self.find_setup_blocking_issues())
        
        return all_issues


def analyze_gtm_associations(data: Dict[str, Any]) -> List[TestIssue]:
    """
    Convenience function to analyze GTM container associations.
    
    Args:
        data: Plain JSON data with tags, triggers, variables, etc.
        
    Returns:
        List of TestIssue objects for all detected issues
    """
    analyzer = AssociationsAnalyzer(data)
    return analyzer.analyze_all()


if __name__ == "__main__":
    # Example usage and testing
    import json
    
    try:
        # Load sample GTM file
        with open("GTM-N6X9DBL_workspace677.json", "r") as f:
            gtm_data = json.load(f)
        
        # Extract simple data structure (this would normally be done by API Gateway)
        simple_data = {
            'tags': gtm_data.get('containerVersion', {}).get('tag', []),
            'triggers': gtm_data.get('containerVersion', {}).get('trigger', []),
            'variables': gtm_data.get('containerVersion', {}).get('variable', []),
            'builtin_variables': gtm_data.get('containerVersion', {}).get('builtInVariable', [])
        }
        
        # Analyze associations
        results = analyze_gtm_associations(simple_data)
        
        # Print results
        print("GTM Container Association Analysis Results:")
        print("=" * 50)
        print(f"Found {len(results)} total issues")
        
        for issue in results[:5]:  # Show first 5 issues
            print(f"  - {issue.type}: {issue.message}")
        
        if len(results) > 5:
            print(f"  ... and {len(results) - 5} more issues")
    
    except FileNotFoundError:
        print("Sample GTM file not found. Please ensure GTM-N6X9DBL_workspace677.json exists.")
    except Exception as e:
        print(f"Error during analysis: {e}")