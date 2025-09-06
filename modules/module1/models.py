"""Response models for GTM Module 1 communication.

This module provides simple response models for the Module 1 associations analyzer.
With the API Gateway pattern, modules now receive plain JSON and only need to define
their response formats for communication back to the core orchestrator.
"""

from typing import List, Dict, Any
from pydantic import BaseModel


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


# Note: AnalysisRequest is no longer needed as modules now receive plain JSON
# from the API Gateway rather than structured Pydantic models