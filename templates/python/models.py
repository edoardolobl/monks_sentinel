"""
Pydantic models for GTM analysis modules.

This template provides standardized data models for GTM analysis results.
These models ensure consistency across all analysis modules and provide
type safety and validation.

Template placeholders:
- {MODULE_NAME}: Module name for analyzer class
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class TestIssue(BaseModel):
    """
    Represents a standardized issue found during analysis.
    
    This model maps to the TestIssue message in gtm_analysis.proto and ensures
    consistent issue reporting across all analysis modules.
    """
    type: str = Field(..., description="Issue type identifier")
    severity: str = Field(..., description="Issue severity: critical, high, medium, low")
    element: Dict[str, Any] = Field(default_factory=dict, description="GTM element with the issue")
    message: str = Field(..., description="Human-readable description of the issue")
    recommendation: str = Field(..., description="How to fix the issue")
    module: str = Field(..., description="Module that detected the issue")
    detected_at: Optional[datetime] = Field(default_factory=datetime.now, description="When the issue was detected")

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ModuleResult(BaseModel):
    """
    Represents standardized result from analysis modules.
    
    This model maps to the ModuleResult message in gtm_analysis.proto and provides
    a consistent response format for all analysis modules.
    """
    module: str = Field(..., description="Module name")
    status: str = Field(..., description="Module execution status: success, error, partial")
    issues: List[TestIssue] = Field(default_factory=list, description="Issues found by the module")
    summary: Dict[str, Any] = Field(default_factory=dict, description="Summary statistics and metrics")
    error_message: Optional[str] = Field(None, description="Error details if status is error")
    started_at: Optional[datetime] = Field(default_factory=datetime.now, description="When analysis started")
    completed_at: Optional[datetime] = Field(default_factory=datetime.now, description="When analysis completed")

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class {MODULE_NAME.title()}AnalyzerData(BaseModel):
    """
    Data structure for {MODULE_NAME} analysis input.
    
    TODO: Customize this model based on your specific analysis requirements.
    This template provides a starting point - modify fields according to your needs.
    """
    # TEMPLATE: Add your specific data fields here
    # Example fields:
    # tags: List[Dict[str, Any]] = Field(default_factory=list, description="GTM tags to analyze")
    # triggers: List[Dict[str, Any]] = Field(default_factory=list, description="GTM triggers to analyze")
    # variables: List[Dict[str, Any]] = Field(default_factory=list, description="GTM variables to analyze")
    
    pass  # Remove this once you add your fields


class AnalysisConfig(BaseModel):
    """
    Configuration options for analysis behavior.
    """
    include_low_severity: bool = Field(True, description="Include low severity issues")
    detailed_reporting: bool = Field(True, description="Include detailed element information")
    max_issues_per_module: int = Field(0, description="Limit issues per module (0 = unlimited)")
    exclude_issue_types: List[str] = Field(default_factory=list, description="Issue types to exclude")


# Helper functions for issue creation
def create_issue(
    issue_type: str,
    severity: str,
    element: Dict[str, Any],
    message: str,
    recommendation: str,
    module: str = "{MODULE_NAME}"
) -> TestIssue:
    """
    Helper function to create standardized TestIssue instances.
    
    Args:
        issue_type: Type of issue (e.g., "orphaned_trigger", "naming_violation")
        severity: Severity level ("critical", "high", "medium", "low")
        element: GTM element that has the issue
        message: Human-readable description
        recommendation: How to fix the issue
        module: Module name (defaults to template module)
    
    Returns:
        TestIssue instance
    """
    return TestIssue(
        type=issue_type,
        severity=severity,
        element=element,
        message=message,
        recommendation=recommendation,
        module=module
    )


def create_success_result(
    issues: List[TestIssue],
    module: str = "{MODULE_NAME}",
    additional_summary: Optional[Dict[str, Any]] = None
) -> ModuleResult:
    """
    Helper function to create successful ModuleResult instances.
    
    Args:
        issues: List of issues found during analysis
        module: Module name
        additional_summary: Additional summary data beyond standard counts
    
    Returns:
        ModuleResult instance with success status
    """
    summary = {
        "total_issues": len(issues),
        "critical": len([i for i in issues if i.severity == "critical"]),
        "high": len([i for i in issues if i.severity == "high"]),
        "medium": len([i for i in issues if i.severity == "medium"]),
        "low": len([i for i in issues if i.severity == "low"])
    }
    
    if additional_summary:
        summary.update(additional_summary)
    
    return ModuleResult(
        module=module,
        status="success",
        issues=issues,
        summary=summary
    )


def create_error_result(
    error_message: str,
    module: str = "{MODULE_NAME}"
) -> ModuleResult:
    """
    Helper function to create error ModuleResult instances.
    
    Args:
        error_message: Error description
        module: Module name
    
    Returns:
        ModuleResult instance with error status
    """
    return ModuleResult(
        module=module,
        status="error",
        issues=[],
        summary={"error": error_message},
        error_message=error_message
    )