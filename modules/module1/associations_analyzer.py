"""
Module 1: Associations & Orphaned Elements Analyzer

This module analyzes GTM containers for:
1. Orphaned triggers: Triggers not referenced by any tag
2. Unused variables: Variables not referenced in tags, triggers, or other variables  
3. Dangling references: Tags referencing non-existent triggerIds/variableIds
4. Built-in variables: Used in variable references but not enabled in builtInVariable[]
5. Setup/Blocking tags: Basic validation that referenced IDs exist

Returns structured results with clear issue descriptions for easy JSON serialization.
"""

import re
from typing import List, Dict, Set, Any
from models import GTMContainer, Tag, Trigger, Variable, BuiltInVariable


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
    
    def __init__(self, container: GTMContainer):
        """Initialize analyzer with GTM container."""
        self.container = container
        
        # Cache for performance
        self._tag_ids = {tag.tagId for tag in container.containerVersion.tag or []}
        self._trigger_ids = {trigger.triggerId for trigger in container.containerVersion.trigger or []}
        self._variable_ids = {var.variableId for var in container.containerVersion.variable or []}
        self._variable_names = {var.name for var in container.containerVersion.variable or []}
        self._builtin_variable_names = {biv.name for biv in container.containerVersion.builtInVariable or []}
    
    def find_orphaned_triggers(self) -> List[Dict[str, Any]]:
        """
        Find triggers that are not referenced by any tag.
        
        Returns:
            List of dictionaries with triggerId and name of orphaned triggers
        """
        orphaned = []
        
        # Get all trigger IDs referenced by tags
        referenced_triggers = set()
        for tag in self.container.containerVersion.tag or []:
            if tag.firingTriggerId:
                referenced_triggers.update(tag.firingTriggerId)
            if tag.blockingTriggerId:
                referenced_triggers.update(tag.blockingTriggerId)
        
        # Find triggers not in referenced set
        for trigger in self.container.containerVersion.trigger or []:
            if trigger.triggerId not in referenced_triggers:
                orphaned.append({
                    "triggerId": trigger.triggerId,
                    "name": trigger.name
                })
        
        return orphaned
    
    def find_unused_variables(self) -> List[Dict[str, Any]]:
        """
        Find variables that are not referenced in tags, triggers, or other variables.
        
        Returns:
            List of dictionaries with variableId and name of unused variables
        """
        referenced_variables = set()
        
        # Check references in tags
        for tag in self.container.containerVersion.tag or []:
            refs = extract_all_variable_references_from_parameters(tag.parameter or [])
            referenced_variables.update(refs)
        
        # Check references in triggers
        for trigger in self.container.containerVersion.trigger or []:
            # Check customEventFilter
            for filter_item in trigger.customEventFilter or []:
                if isinstance(filter_item, dict) and 'parameter' in filter_item:
                    for param in filter_item['parameter'] or []:
                        if isinstance(param, dict) and 'value' in param:
                            refs = extract_variable_references(param['value'])
                            referenced_variables.update(refs)
            
            # Check filter
            for filter_item in trigger.filter or []:
                if isinstance(filter_item, dict) and 'parameter' in filter_item:
                    for param in filter_item['parameter'] or []:
                        if isinstance(param, dict) and 'value' in param:
                            refs = extract_variable_references(param['value'])
                            referenced_variables.update(refs)
        
        # Check references in other variables
        for variable in self.container.containerVersion.variable or []:
            refs = extract_all_variable_references_from_parameters(variable.parameter or [])
            referenced_variables.update(refs)
        
        # Find variables not referenced by name
        unused = []
        for variable in self.container.containerVersion.variable or []:
            if variable.name not in referenced_variables:
                unused.append({
                    "variableId": variable.variableId,
                    "name": variable.name
                })
        
        return unused
    
    def find_dangling_references(self) -> List[Dict[str, Any]]:
        """
        Find tags referencing non-existent triggerIds or variableIds.
        
        Returns:
            List of dictionaries describing dangling references
        """
        dangling = []
        
        for tag in self.container.containerVersion.tag or []:
            # Check firing triggers
            if tag.firingTriggerId:
                for trigger_id in tag.firingTriggerId:
                    if trigger_id not in self._trigger_ids:
                        dangling.append({
                            "tagId": tag.tagId,
                            "tagName": tag.name,
                            "missing_trigger": trigger_id,
                            "reference_type": "firingTriggerId"
                        })
            
            # Check blocking triggers
            if tag.blockingTriggerId:
                for trigger_id in tag.blockingTriggerId:
                    if trigger_id not in self._trigger_ids:
                        dangling.append({
                            "tagId": tag.tagId,
                            "tagName": tag.name,
                            "missing_trigger": trigger_id,
                            "reference_type": "blockingTriggerId"
                        })
        
        return dangling
    
    def find_builtin_variable_issues(self) -> List[Dict[str, Any]]:
        """
        Find built-in variables used in references but not enabled.
        
        Returns:
            List of dictionaries describing built-in variable issues
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
        
        # Get all variable references from the container
        all_references = set()
        
        # Check tags
        for tag in self.container.containerVersion.tag or []:
            refs = extract_all_variable_references_from_parameters(tag.parameter or [])
            all_references.update(refs)
        
        # Check triggers
        for trigger in self.container.containerVersion.trigger or []:
            # Check customEventFilter and filter
            for filter_list in [trigger.customEventFilter or [], trigger.filter or []]:
                for filter_item in filter_list:
                    if isinstance(filter_item, dict) and 'parameter' in filter_item:
                        for param in filter_item['parameter'] or []:
                            if isinstance(param, dict) and 'value' in param:
                                refs = extract_variable_references(param['value'])
                                all_references.update(refs)
        
        # Check variables
        for variable in self.container.containerVersion.variable or []:
            refs = extract_all_variable_references_from_parameters(variable.parameter or [])
            all_references.update(refs)
        
        # Find built-in variables that are referenced but not enabled
        for ref in all_references:
            if (ref in BUILTIN_VARIABLE_NAMES and 
                ref not in self._builtin_variable_names and
                ref not in self._variable_names):  # Not a custom variable with same name
                issues.append({
                    "variable_name": ref,
                    "used_but_not_enabled": True
                })
        
        return issues
    
    def find_setup_blocking_issues(self) -> List[Dict[str, Any]]:
        """
        Find setup/blocking tags with invalid references.
        
        Returns:
            List of dictionaries describing setup/blocking tag issues
        """
        issues = []
        
        for tag in self.container.containerVersion.tag or []:
            # Check setupTag references
            if tag.setupTag:
                for setup_ref in tag.setupTag:
                    if isinstance(setup_ref, dict) and 'tagId' in setup_ref:
                        setup_tag_id = setup_ref['tagId']
                        if setup_tag_id not in self._tag_ids:
                            issues.append({
                                "tagId": tag.tagId,
                                "tagName": tag.name,
                                "missing_setup_tag": setup_tag_id,
                                "issue_type": "missing_setup_tag"
                            })
            
            # Check teardownTag references
            if tag.teardownTag:
                for teardown_ref in tag.teardownTag:
                    if isinstance(teardown_ref, dict) and 'tagId' in teardown_ref:
                        teardown_tag_id = teardown_ref['tagId']
                        if teardown_tag_id not in self._tag_ids:
                            issues.append({
                                "tagId": tag.tagId,
                                "tagName": tag.name,
                                "missing_teardown_tag": teardown_tag_id,
                                "issue_type": "missing_teardown_tag"
                            })
        
        return issues
    
    def analyze_all(self) -> Dict[str, Any]:
        """
        Run all association analyses and return comprehensive results.
        
        Returns:
            Dictionary with all analysis results
        """
        return {
            "orphaned_triggers": self.find_orphaned_triggers(),
            "unused_variables": self.find_unused_variables(),
            "dangling_references": self.find_dangling_references(),
            "builtin_variable_issues": self.find_builtin_variable_issues(),
            "setup_blocking_issues": self.find_setup_blocking_issues()
        }


def analyze_gtm_associations(gtm_container: GTMContainer) -> Dict[str, Any]:
    """
    Convenience function to analyze GTM container associations.
    
    Args:
        gtm_container: Parsed GTM container object
        
    Returns:
        Dictionary with all association analysis results
    """
    analyzer = AssociationsAnalyzer(gtm_container)
    return analyzer.analyze_all()


if __name__ == "__main__":
    # Example usage and testing
    import json
    from models import GTMContainer
    
    try:
        # Load sample GTM file
        with open("GTM-N6X9DBL_workspace677.json", "r") as f:
            gtm_data = json.load(f)
        
        # Parse with Pydantic model
        container = GTMContainer(**gtm_data)
        
        # Analyze associations
        results = analyze_gtm_associations(container)
        
        # Print results
        print("GTM Container Association Analysis Results:")
        print("=" * 50)
        
        for category, issues in results.items():
            print(f"\n{category.replace('_', ' ').title()}: {len(issues)} issues found")
            if issues:
                for issue in issues[:3]:  # Show first 3 issues
                    print(f"  - {issue}")
                if len(issues) > 3:
                    print(f"  ... and {len(issues) - 3} more")
    
    except FileNotFoundError:
        print("Sample GTM file not found. Please ensure GTM-N6X9DBL_workspace677.json exists.")
    except Exception as e:
        print(f"Error during analysis: {e}")