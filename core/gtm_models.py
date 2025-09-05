"""
Comprehensive Pydantic models for parsing GTM container JSON exports.

This module provides enhanced GTM schema models used across all analysis modules.
These models define the complete structure of GTM containers including:
- Core entities: Tags, Triggers, Variables, Built-in Variables
- Organization: Folders for hierarchical structure
- Advanced features: Zones, Templates for complex configurations
- Privacy compliance: Consent settings and privacy-aware analysis
- Version tracking: Fingerprints and metadata for change detection
- Helper methods for common operations and enhanced analysis capabilities

Version: Enhanced for Modules 1-4 with full GTM schema support
Backward Compatible: All existing Module 1 functionality preserved
"""

from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel, Field


class Parameter(BaseModel):
    """Represents a parameter with key-value pairs used in tags and variables."""
    key: str
    value: Optional[str] = None
    list: Optional[List[Dict[str, Any]]] = None
    map: Optional[List[Dict[str, Any]]] = None
    type: Optional[str] = None  # TEMPLATE, BOOLEAN, LIST, MAP, etc.


class ConsentSettings(BaseModel):
    """Represents consent settings for privacy compliance."""
    consentStatus: str  # NOT_SET, NEEDED, NOT_NEEDED
    
    class Config:
        extra = "ignore"


class MonitoringMetadata(BaseModel):
    """Represents monitoring metadata for tag debugging."""
    type: str  # MAP, TEMPLATE, etc.
    
    class Config:
        extra = "ignore"


class Tag(BaseModel):
    """Represents a GTM tag with comprehensive fields for all analysis modules."""
    tagId: str
    name: str
    type: str
    parameter: Optional[List[Parameter]] = []
    firingTriggerId: Optional[List[str]] = []
    blockingTriggerId: Optional[List[str]] = []
    setupTag: Optional[List[Dict[str, Any]]] = []
    teardownTag: Optional[List[Dict[str, Any]]] = []
    # Enhanced fields for future modules
    parentFolderId: Optional[str] = None  # For folder organization
    tagFiringOption: Optional[str] = None  # ONCE_PER_EVENT, ONCE_PER_LOAD, etc.
    consentSettings: Optional[ConsentSettings] = None  # Privacy compliance
    notes: Optional[str] = None  # Documentation and comments
    fingerprint: Optional[str] = None  # Version tracking
    monitoringMetadata: Optional[MonitoringMetadata] = None  # Debugging metadata
    monitoringMetadataTagNameKey: Optional[str] = None  # Tag name key for monitoring
    accountId: Optional[str] = None  # Account ID for completeness
    containerId: Optional[str] = None  # Container ID for completeness
    
    class Config:
        # Allow extra fields but ignore them
        extra = "ignore"


class Trigger(BaseModel):
    """Represents a GTM trigger with comprehensive fields for all analysis modules."""
    triggerId: str
    name: str
    type: str
    customEventFilter: Optional[List[Dict[str, Any]]] = []
    filter: Optional[List[Dict[str, Any]]] = []
    # Enhanced fields for future modules
    fingerprint: Optional[str] = None  # Version tracking
    accountId: Optional[str] = None  # Account ID for completeness
    containerId: Optional[str] = None  # Container ID for completeness
    
    class Config:
        extra = "ignore"


class Variable(BaseModel):
    """Represents a GTM variable with comprehensive fields for all analysis modules."""
    variableId: str
    name: str
    type: str
    parameter: Optional[List[Parameter]] = []
    # Enhanced fields for future modules
    fingerprint: Optional[str] = None  # Version tracking
    formatValue: Optional[Dict[str, Any]] = None  # Output formatting configuration
    accountId: Optional[str] = None  # Account ID for completeness
    containerId: Optional[str] = None  # Container ID for completeness
    
    class Config:
        extra = "ignore"


class BuiltInVariable(BaseModel):
    """Represents a GTM built-in variable."""
    type: str
    name: str
    
    class Config:
        extra = "ignore"


class Folder(BaseModel):
    """Represents a GTM folder for organizing tags, triggers, and variables."""
    folderId: str
    name: str
    fingerprint: Optional[str] = None  # Version tracking
    accountId: Optional[str] = None  # Account ID for completeness
    containerId: Optional[str] = None  # Container ID for completeness
    
    class Config:
        extra = "ignore"


class Zone(BaseModel):
    """Represents a GTM zone for advanced container configurations."""
    zoneId: str
    name: Optional[str] = None
    zoneTypeId: Optional[str] = None
    notes: Optional[str] = None
    fingerprint: Optional[str] = None  # Version tracking
    accountId: Optional[str] = None  # Account ID for completeness
    containerId: Optional[str] = None  # Container ID for completeness
    
    class Config:
        extra = "ignore"


class Template(BaseModel):
    """Represents a custom GTM template."""
    templateId: str
    name: Optional[str] = None
    galleryReference: Optional[Dict[str, Any]] = None
    templateData: Optional[str] = None  # Template source code
    fingerprint: Optional[str] = None  # Version tracking
    accountId: Optional[str] = None  # Account ID for completeness
    containerId: Optional[str] = None  # Container ID for completeness
    
    class Config:
        extra = "ignore"


class ContainerFeatures(BaseModel):
    """Represents the capabilities and features of a GTM container."""
    supportUserPermissions: Optional[bool] = None
    supportEnvironments: Optional[bool] = None
    supportWorkspaces: Optional[bool] = None
    supportGtagConfigs: Optional[bool] = None
    supportBuiltInVariables: Optional[bool] = None
    supportClients: Optional[bool] = None
    supportFolders: Optional[bool] = None
    supportTags: Optional[bool] = None
    supportTemplates: Optional[bool] = None
    supportTriggers: Optional[bool] = None
    supportVariables: Optional[bool] = None
    supportVersions: Optional[bool] = None
    supportZones: Optional[bool] = None
    supportTransformations: Optional[bool] = None
    
    class Config:
        extra = "ignore"


class Container(BaseModel):
    """Represents the main container information with comprehensive metadata."""
    name: str
    publicId: str
    containerId: str
    accountId: str
    # Enhanced fields for future modules
    path: Optional[str] = None  # Full GTM path: accounts/{accountId}/containers/{containerId}
    usageContext: Optional[List[str]] = None  # ["WEB"], ["IOS"], ["ANDROID"], etc.
    fingerprint: Optional[str] = None  # Version tracking
    tagManagerUrl: Optional[str] = None  # URL to GTM interface
    features: Optional[ContainerFeatures] = None  # Container capabilities
    tagIds: Optional[List[str]] = None  # Associated tag IDs
    
    class Config:
        extra = "ignore"


class ContainerVersion(BaseModel):
    """Represents a container version with all its components and metadata."""
    container: Container
    tag: Optional[List[Tag]] = []
    trigger: Optional[List[Trigger]] = []
    variable: Optional[List[Variable]] = []
    builtInVariable: Optional[List[BuiltInVariable]] = []
    # Enhanced fields for future modules
    path: Optional[str] = None  # Full path: accounts/{accountId}/containers/{containerId}/versions/{version}
    accountId: Optional[str] = None  # Account ID
    containerId: Optional[str] = None  # Container ID
    containerVersionId: Optional[str] = None  # Version ID
    folder: Optional[List["Folder"]] = []  # Folder structure for organization
    zone: Optional[List["Zone"]] = []  # GTM zones for advanced configurations
    template: Optional[List["Template"]] = []  # Custom templates
    
    class Config:
        extra = "ignore"


class GTMContainer(BaseModel):
    """
    Root model for GTM container JSON export.
    
    This is the main entry point for parsing GTM JSON files.
    Contains all the essential components needed for analysis across all modules.
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
                if param.value:
                    # Find all {{variableName}} patterns in parameter values
                    matches = re.findall(r'\{\{([^}]+)\}\}', param.value)
                    references.extend(matches)
        
        return references
    
    def get_folder_by_id(self, folder_id: str) -> Optional["Folder"]:
        """Helper method to find a folder by its ID."""
        if not self.containerVersion.folder:
            return None
        return next(
            (folder for folder in self.containerVersion.folder if folder.folderId == folder_id),
            None
        )
    
    def get_tags_in_folder(self, folder_id: str) -> List[Tag]:
        """Get all tags that belong to a specific folder."""
        return [
            tag for tag in self.containerVersion.tag
            if tag.parentFolderId == folder_id
        ]
    
    def get_tags_with_consent_status(self, consent_status: str) -> List[Tag]:
        """Get all tags with a specific consent status (NOT_SET, NEEDED, NOT_NEEDED)."""
        return [
            tag for tag in self.containerVersion.tag
            if tag.consentSettings and tag.consentSettings.consentStatus == consent_status
        ]
    
    def get_tags_by_firing_option(self, firing_option: str) -> List[Tag]:
        """Get all tags with a specific firing option (ONCE_PER_EVENT, ONCE_PER_LOAD, etc.)."""
        return [
            tag for tag in self.containerVersion.tag
            if tag.tagFiringOption == firing_option
        ]
    
    def get_folder_hierarchy(self) -> Dict[str, List[str]]:
        """Get a mapping of folder IDs to their contained tag IDs."""
        hierarchy = {}
        if self.containerVersion.folder:
            for folder in self.containerVersion.folder:
                tag_ids = [tag.tagId for tag in self.get_tags_in_folder(folder.folderId)]
                hierarchy[folder.folderId] = tag_ids
        return hierarchy


# Utility functions for enhanced GTM analysis
def get_container_capabilities(container: Container) -> List[str]:
    """Extract a list of enabled capabilities from container features."""
    capabilities = []
    if container.features:
        features_dict = container.features.dict()
        for feature_name, enabled in features_dict.items():
            if enabled:
                capabilities.append(feature_name)
    return capabilities


def is_privacy_compliant_tag(tag: Tag) -> bool:
    """Check if a tag has proper consent settings configured."""
    return (
        tag.consentSettings is not None and 
        tag.consentSettings.consentStatus != "NOT_SET"
    )


def extract_tag_documentation(tag: Tag) -> str:
    """Extract and clean tag documentation from notes field."""
    if tag.notes:
        # Clean up common formatting in notes
        notes = tag.notes.strip()
        # Remove common prefixes like dates and emails
        import re
        notes = re.sub(r'^\[.*?\]\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*', '', notes)
        return notes
    return ""


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


class OrchestratorResponse(BaseModel):
    """Final aggregated response from the orchestrator."""
    request_id: str
    status: str  # processing, completed, failed
    container_info: Dict[str, str]  # name, publicId, etc.
    results: Dict[str, ModuleResult] = {}  # module_name -> results
    summary: Dict[str, int] = {}  # aggregated counts