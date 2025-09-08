"""
{MODULE_NAME.title()} analyzer for GTM analysis.

This template provides a foundation for implementing GTM analysis modules.
Replace placeholders with your specific analysis logic.

Template placeholders:
- {MODULE_NAME}: Module name (e.g., "javascript", "security", "performance")
- Implement specific analysis methods based on your requirements
"""

from typing import List, Dict, Any, Optional
import logging
from models import TestIssue, create_issue


class {MODULE_NAME.title()}Analyzer:
    """
    Analyzer for GTM {MODULE_NAME} analysis.
    
    This template provides the structure for implementing analysis modules.
    Customize the analysis methods based on your specific requirements.
    """
    
    def __init__(self, data: Dict[str, Any], logger: Optional[logging.Logger] = None):
        """
        Initialize the {MODULE_NAME} analyzer.
        
        Args:
            data: GTM container data with relevant elements for analysis
            logger: Optional logger instance
        """
        self.data = data
        self.logger = logger or logging.getLogger(__name__)
        
        # Extract relevant data structures
        # TODO: Customize based on your data requirements
        self.tags = data.get("tags", [])
        self.triggers = data.get("triggers", [])
        self.variables = data.get("variables", [])
        self.builtin_variables = data.get("builtin_variables", [])
        
        self.logger.info(f"Initialized {MODULE_NAME} analyzer with "
                        f"{len(self.tags)} tags, {len(self.triggers)} triggers, "
                        f"{len(self.variables)} variables")
    
    def analyze_all(self) -> List[TestIssue]:
        """
        Run comprehensive {MODULE_NAME} analysis.
        
        Returns:
            List of TestIssue objects found during analysis
        """
        issues = []
        
        try:
            self.logger.info(f"Starting {MODULE_NAME} analysis")
            
            # TODO: Implement your specific analysis methods
            # Example analysis methods:
            issues.extend(self._analyze_example_pattern())
            # issues.extend(self._analyze_another_pattern())
            
            self.logger.info(f"{MODULE_NAME.title()} analysis completed: found {len(issues)} issues")
            return issues
            
        except Exception as e:
            self.logger.error(f"Error during {MODULE_NAME} analysis: {e}")
            # Return a critical issue for the analysis failure
            return [create_issue(
                issue_type="analysis_error",
                severity="critical",
                element={},
                message=f"{MODULE_NAME.title()} analysis failed: {str(e)}",
                recommendation="Check analyzer implementation and data format"
            )]
    
    def _analyze_example_pattern(self) -> List[TestIssue]:
        """
        Example analysis method - replace with your specific analysis logic.
        
        TODO: Implement your specific analysis pattern here.
        This is a template method that demonstrates the structure.
        
        Returns:
            List of TestIssue objects for this specific analysis
        """
        issues = []
        
        try:
            # Example: Check for elements with missing required properties
            for tag in self.tags:
                if not tag.get("name"):
                    issues.append(create_issue(
                        issue_type="missing_name",
                        severity="medium",
                        element=tag,
                        message=f"Tag {tag.get('id', 'unknown')} is missing a name",
                        recommendation="Add a descriptive name to the tag"
                    ))
                
                # TODO: Add your specific analysis checks here
                # Example patterns:
                # - Check for naming conventions
                # - Validate configuration parameters
                # - Check for security issues
                # - Analyze performance impact
                # - Validate data layer usage
        
        except Exception as e:
            self.logger.error(f"Error in example pattern analysis: {e}")
            issues.append(create_issue(
                issue_type="analysis_pattern_error",
                severity="high",
                element={},
                message=f"Error in example pattern analysis: {str(e)}",
                recommendation="Check analyzer implementation"
            ))
        
        return issues
    
    def _get_element_by_id(self, element_type: str, element_id: str) -> Optional[Dict[str, Any]]:
        """
        Helper method to find an element by ID.
        
        Args:
            element_type: Type of element ("tag", "trigger", "variable")
            element_id: ID to search for
            
        Returns:
            Element dictionary if found, None otherwise
        """
        elements_map = {
            "tag": self.tags,
            "trigger": self.triggers,
            "variable": self.variables
        }
        
        elements = elements_map.get(element_type, [])
        return next((elem for elem in elements if elem.get("id") == element_id), None)
    
    def _is_builtin_variable(self, variable_name: str) -> bool:
        """
        Helper method to check if a variable is built-in.
        
        Args:
            variable_name: Variable name to check
            
        Returns:
            True if variable is built-in, False otherwise
        """
        return any(var.get("name") == variable_name for var in self.builtin_variables)
    
    def _get_severity_for_issue_type(self, issue_type: str) -> str:
        """
        Helper method to determine appropriate severity for different issue types.
        
        TODO: Customize severity levels based on your specific issue types.
        
        Args:
            issue_type: The type of issue
            
        Returns:
            Severity string ("critical", "high", "medium", "low")
        """
        severity_map = {
            # Critical issues
            "analysis_error": "critical",
            "security_vulnerability": "critical",
            
            # High severity issues  
            "data_loss_risk": "high",
            "analysis_pattern_error": "high",
            
            # Medium severity issues
            "missing_name": "medium",
            "naming_violation": "medium",
            "configuration_issue": "medium",
            
            # Low severity issues
            "best_practice_violation": "low",
            "optimization_opportunity": "low"
        }
        
        return severity_map.get(issue_type, "medium")
    
    def get_analysis_summary(self, issues: List[TestIssue]) -> Dict[str, Any]:
        """
        Generate analysis summary statistics.
        
        Args:
            issues: List of issues found during analysis
            
        Returns:
            Dictionary with summary statistics
        """
        summary = {
            "total_issues": len(issues),
            "critical": len([i for i in issues if i.severity == "critical"]),
            "high": len([i for i in issues if i.severity == "high"]),
            "medium": len([i for i in issues if i.severity == "medium"]),
            "low": len([i for i in issues if i.severity == "low"]),
            
            # Analysis-specific statistics
            "total_tags_analyzed": len(self.tags),
            "total_triggers_analyzed": len(self.triggers),
            "total_variables_analyzed": len(self.variables),
            
            # TODO: Add your specific summary metrics
            # "custom_metric": self._calculate_custom_metric()
        }
        
        return summary