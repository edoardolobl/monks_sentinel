"""
Pydantic models for parsing GTM container JSON exports.

This module provides simple, focused models for the essential structure needed
for GTM Module 1 analysis, capturing associations between tags, triggers, and variables.
"""

from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class Parameter(BaseModel):
    """Represents a parameter with key-value pairs used in tags and variables."""
    key: str
    value: Optional[str] = None
    list: Optional[List[Dict[str, Any]]] = None
    map: Optional[List[Dict[str, Any]]] = None
    type: Optional[str] = None  # TEMPLATE, BOOLEAN, LIST, MAP, etc.


class Tag(BaseModel):
    """Represents a GTM tag with essential fields for association analysis."""
    tagId: str
    name: str
    type: str
    parameter: Optional[List[Parameter]] = []
    firingTriggerId: Optional[List[str]] = []
    blockingTriggerId: Optional[List[str]] = []
    setupTag: Optional[List[Dict[str, Any]]] = []
    teardownTag: Optional[List[Dict[str, Any]]] = []
    
    class Config:
        # Allow extra fields but ignore them
        extra = "ignore"


class Trigger(BaseModel):
    """Represents a GTM trigger with essential fields for association analysis."""
    triggerId: str
    name: str
    type: str
    customEventFilter: Optional[List[Dict[str, Any]]] = []
    filter: Optional[List[Dict[str, Any]]] = []
    
    class Config:
        extra = "ignore"


class Variable(BaseModel):
    """Represents a GTM variable with essential fields for association analysis."""
    variableId: str
    name: str
    type: str
    parameter: Optional[List[Parameter]] = []
    
    class Config:
        extra = "ignore"


class BuiltInVariable(BaseModel):
    """Represents a GTM built-in variable."""
    type: str
    name: str
    
    class Config:
        extra = "ignore"


class Container(BaseModel):
    """Represents the main container information."""
    name: str
    publicId: str
    containerId: str
    accountId: str
    
    class Config:
        extra = "ignore"


class ContainerVersion(BaseModel):
    """Represents a container version with all its components."""
    container: Container
    tag: Optional[List[Tag]] = []
    trigger: Optional[List[Trigger]] = []
    variable: Optional[List[Variable]] = []
    builtInVariable: Optional[List[BuiltInVariable]] = []
    
    class Config:
        extra = "ignore"


class GTMContainer(BaseModel):
    """
    Root model for GTM container JSON export.
    
    This is the main entry point for parsing GTM JSON files.
    Contains all the essential components needed for Module 1 analysis.
    """
    exportFormatVersion: int
    exportTime: str
    containerVersion: ContainerVersion
    
    class Config:
        extra = "ignore"

    def get_tag_by_id(self, tag_id: str) -> Optional[Tag]:
        """Helper method to find a tag by its ID."""
        return next(
            (tag for tag in self.containerVersion.tag if tag.tagId == tag_id),
            None
        )
    
    def get_trigger_by_id(self, trigger_id: str) -> Optional[Trigger]:
        """Helper method to find a trigger by its ID."""
        return next(
            (trigger for trigger in self.containerVersion.trigger if trigger.triggerId == trigger_id),
            None
        )
    
    def get_variable_by_id(self, variable_id: str) -> Optional[Variable]:
        """Helper method to find a variable by its ID."""
        return next(
            (variable for variable in self.containerVersion.variable if variable.variableId == variable_id),
            None
        )
    
    def get_tags_using_trigger(self, trigger_id: str) -> List[Tag]:
        """Get all tags that use a specific trigger."""
        return [
            tag for tag in self.containerVersion.tag 
            if tag.firingTriggerId and trigger_id in tag.firingTriggerId
        ]
    
    def get_variable_references_in_tag(self, tag: Tag) -> List[str]:
        """
        Extract variable references from a tag's parameters.
        Returns list of variable names found in {{variableName}} format.
        """
        import re
        references = []
        
        if tag.parameter:
            for param in tag.parameter:
                # Find all {{variableName}} patterns in parameter values
                matches = re.findall(r'\{\{([^}]+)\}\}', param.value)
                references.extend(matches)
        
        return references


# Response models for module communication
class TestIssue(BaseModel):
    """Standardized issue format for all test modules."""
    type: str  # orphaned_trigger, dangling_reference, etc.
    severity: str  # critical, medium, low
    element: Dict[str, Any]  # The GTM element with the issue
    message: str  # Human-readable description
    recommendation: str  # How to fix it


class ModuleResult(BaseModel):
    """Standardized result format from test modules."""
    module: str  # module name
    status: str  # success, error
    issues: List[TestIssue] = []
    summary: Dict[str, int] = {}  # total_issues, critical, medium, low


class AnalysisRequest(BaseModel):
    """Request format sent to test modules."""
    tags: List[Tag]
    triggers: List[Trigger] 
    variables: List[Variable]
    builtin_variables: Optional[List[BuiltInVariable]] = []