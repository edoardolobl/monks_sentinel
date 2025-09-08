"""
Data extractors for the gRPC orchestrator pattern.

This module extracts minimal, focused data subsets from the complex GTM container
for each analysis module. This eliminates the need for modules to understand
the complete GTM schema and makes them truly language-agnostic.
"""

from typing import List, Dict, Any, Optional
import re
from gtm_models import GTMContainer, Tag, Trigger, Variable


def extract_associations_data(gtm_container: GTMContainer) -> Dict[str, Any]:
    """
    Extract minimal data needed for associations analysis.
    
    Returns simple JSON structure with just the IDs, names, and relationships
    needed for orphaned element detection - no complex GTM objects required.
    """
    # Extract tag data with only firing triggers
    tags_data = []
    for tag in gtm_container.containerVersion.tag:
        tags_data.append({
            "id": tag.tagId,
            "name": tag.name,
            "type": tag.type,
            "firing_triggers": tag.firingTriggerId or [],
            "blocking_triggers": tag.blockingTriggerId or [],
            "variable_references": _extract_variable_references(tag)
        })
    
    # Extract trigger data with just ID and name
    triggers_data = []
    for trigger in gtm_container.containerVersion.trigger:
        triggers_data.append({
            "id": trigger.triggerId,
            "name": trigger.name,
            "type": trigger.type
        })
    
    # Extract variable data with just ID and name
    variables_data = []
    for variable in gtm_container.containerVersion.variable:
        variables_data.append({
            "id": variable.variableId,
            "name": variable.name,
            "type": variable.type
        })
    
    # Extract builtin variables
    builtin_variables_data = []
    for builtin_var in gtm_container.containerVersion.builtInVariable:
        builtin_variables_data.append({
            "name": builtin_var.name,
            "type": builtin_var.type
        })
    
    return {
        "tags": tags_data,
        "triggers": triggers_data,
        "variables": variables_data,
        "builtin_variables": builtin_variables_data
    }


def extract_governance_data(gtm_container: GTMContainer) -> Dict[str, Any]:
    """
    Extract minimal data needed for governance analysis.
    
    Returns a structure aligned with the module contract:
    separate arrays for tags, triggers, variables, and folders with
    governance-relevant fields (name, notes, folder association).
    """
    # Tags with documentation and folder info
    tags_data = []
    for tag in gtm_container.containerVersion.tag:
        tags_data.append({
            "id": tag.tagId,
            "name": tag.name,
            "type": tag.type,
            "notes": (tag.notes or ""),
            "parentFolderId": tag.parentFolderId,
        })

    # Triggers (notes/parentFolderId may be absent in some exports)
    triggers_data = []
    for trigger in gtm_container.containerVersion.trigger:
        notes = getattr(trigger, "notes", None) or ""
        parent_folder_id = getattr(trigger, "parentFolderId", None)
        triggers_data.append({
            "id": trigger.triggerId,
            "name": trigger.name,
            "type": trigger.type,
            "notes": notes,
            "parentFolderId": parent_folder_id,
        })

    # Variables (notes/parentFolderId may be absent in some exports)
    variables_data = []
    for variable in gtm_container.containerVersion.variable:
        notes = getattr(variable, "notes", None) or ""
        parent_folder_id = getattr(variable, "parentFolderId", None)
        variables_data.append({
            "id": variable.variableId,
            "name": variable.name,
            "type": variable.type,
            "notes": notes,
            "parentFolderId": parent_folder_id,
        })

    # Folders, if present
    folders_data = []
    if gtm_container.containerVersion.folder:
        for folder in gtm_container.containerVersion.folder:
            folders_data.append({
                "folderId": folder.folderId,
                "name": folder.name,
            })

    return {
        "tags": tags_data,
        "triggers": triggers_data,
        "variables": variables_data,
        "folders": folders_data,
    }


def extract_javascript_data(gtm_container: GTMContainer) -> Dict[str, Any]:
    """
    Extract minimal data needed for JavaScript quality analysis.
    
    Returns simple JSON structure with just the JavaScript code snippets
    and basic metadata for analysis.
    """
    javascript_items = []
    
    # Extract JavaScript from tags
    for tag in gtm_container.containerVersion.tag:
        js_code = _extract_javascript_from_tag(tag)
        if js_code:
            javascript_items.append({
                "id": tag.tagId,
                "name": tag.name,
                "type": "tag",
                "element_type": tag.type,
                "javascript_code": js_code
            })
    
    # Extract JavaScript from variables
    for variable in gtm_container.containerVersion.variable:
        js_code = _extract_javascript_from_variable(variable)
        if js_code:
            javascript_items.append({
                "id": variable.variableId,
                "name": variable.name,
                "type": "variable",
                "element_type": variable.type,
                "javascript_code": js_code
            })
    
    return {
        "items": javascript_items
    }


def extract_html_data(gtm_container: GTMContainer) -> Dict[str, Any]:
    """
    Extract minimal data needed for HTML security analysis.
    
    Returns simple JSON structure with just the HTML code snippets
    and basic metadata for security analysis.
    """
    html_items = []
    
    # Extract HTML from tags
    for tag in gtm_container.containerVersion.tag:
        html_code = _extract_html_from_tag(tag)
        if html_code:
            html_items.append({
                "id": tag.tagId,
                "name": tag.name,
                "type": "tag",
                "element_type": tag.type,
                "html_code": html_code
            })
    
    return {
        "items": html_items
    }


# Helper functions for code extraction

def _extract_variable_references(tag: Tag) -> List[str]:
    """Extract variable references from a tag's parameters."""
    references = []
    if tag.parameter:
        for param in tag.parameter:
            if param.value:
                # Find all {{variableName}} patterns
                matches = re.findall(r'\{\{([^}]+)\}\}', param.value)
                references.extend(matches)
    return references


def _extract_javascript_from_tag(tag: Tag) -> Optional[str]:
    """Extract JavaScript code from a tag's parameters."""
    if not tag.parameter:
        return None
        
    # Look for common JavaScript parameter keys
    js_keys = ['html', 'javascript', 'customJavaScript', 'code']
    
    for param in tag.parameter:
        if param.key.lower() in [k.lower() for k in js_keys] and param.value:
            # Check if the value contains JavaScript-like patterns
            if _contains_javascript_patterns(param.value):
                return param.value
    
    return None


def _extract_javascript_from_variable(variable: Variable) -> Optional[str]:
    """Extract JavaScript code from a variable's parameters.""" 
    if not variable.parameter:
        return None
        
    # For Custom JavaScript variables
    if variable.type == "jsm":  # Custom JavaScript variable type
        for param in variable.parameter:
            if param.key == "javascript" and param.value:
                return param.value
    
    return None


def _extract_html_from_tag(tag: Tag) -> Optional[str]:
    """Extract HTML code from a tag's parameters."""
    if not tag.parameter:
        return None
        
    # Look for HTML parameter keys
    html_keys = ['html', 'content']
    
    for param in tag.parameter:
        if param.key.lower() in [k.lower() for k in html_keys] and param.value:
            # Check if the value contains HTML-like patterns
            if _contains_html_patterns(param.value):
                return param.value
    
    return None


def _contains_javascript_patterns(code: str) -> bool:
    """Check if a string contains JavaScript-like patterns."""
    js_patterns = [
        r'\bfunction\b',
        r'\bvar\b',
        r'\blet\b', 
        r'\bconst\b',
        r'\breturn\b',
        r'\bif\b\s*\(',
        r'\bfor\b\s*\(',
        r'\bwhile\b\s*\(',
        r'\.push\(',
        r'\.forEach\(',
        r'console\.',
        r'window\.',
        r'document\.',
        r'=>',
        r'function\s*\(',
    ]
    
    for pattern in js_patterns:
        if re.search(pattern, code, re.IGNORECASE):
            return True
    
    return False


def _contains_html_patterns(code: str) -> bool:
    """Check if a string contains HTML-like patterns."""
    html_patterns = [
        r'<[^>]+>',  # HTML tags
        r'&\w+;',    # HTML entities
        r'<!DOCTYPE',
        r'<html',
        r'<script',
        r'<style',
        r'<img',
        r'<div',
        r'<span',
        r'<iframe',
    ]
    
    for pattern in html_patterns:
        if re.search(pattern, code, re.IGNORECASE):
            return True
    
    return False
