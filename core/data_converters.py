"""
Data conversion utilities for GTM Quality Assurance System.

This module provides conversion functions between Pydantic models and 
protobuf messages for gRPC communication.
"""

import logging
from typing import Dict, Any, List, Optional

# Import Pydantic models
from gtm_models import GTMContainer, Tag, Trigger, Variable

# Import protobuf generated classes
import sys
sys.path.append('/Users/user/Desktop/gtm_project/generated/python')

from gtm_models_pb2 import (
    GTMContainer as GTMContainerProto,
    ContainerVersion as ContainerVersionProto,
    Container as ContainerProto,
    Tag as TagProto,
    Trigger as TriggerProto,
    Variable as VariableProto,
    Parameter as ParameterProto,
    APIVersion as APIVersionProto
)
from gtm_analysis_pb2 import (
    AnalysisRequest,
    AnalysisResponse,
    ModuleResult as ModuleResultProto,
    TestIssue as TestIssueProto,
    AssociationsAnalysisRequest,
    GovernanceAnalysisRequest,
    JavaScriptAnalysisRequest,
    HTMLAnalysisRequest,
    AssociationTag,
    AssociationTrigger,
    AssociationVariable,
    GovernanceTag,
    GovernanceTrigger,
    GovernanceVariable,
    JavaScriptItem,
    HTMLItem,
    HealthRequest,
    HealthResponse
)


logger = logging.getLogger(__name__)


def pydantic_gtm_to_proto(gtm_container: GTMContainer) -> GTMContainerProto:
    """
    Convert Pydantic GTMContainer to protobuf GTMContainer.
    
    Args:
        gtm_container: Pydantic GTMContainer instance
        
    Returns:
        Protobuf GTMContainer message
    """
    try:
        proto_container = GTMContainerProto()
        
        # Basic container info
        if hasattr(gtm_container, 'exportFormatVersion'):
            proto_container.export_format_version = gtm_container.exportFormatVersion
        if hasattr(gtm_container, 'exportTime'):
            proto_container.export_time = gtm_container.exportTime
        
        # Convert container version
        if hasattr(gtm_container, 'containerVersion'):
            container_version = gtm_container.containerVersion
            
            # Convert container info
            if hasattr(container_version, 'container'):
                container = container_version.container
                proto_container.container_version.container.name = container.name or ""
                proto_container.container_version.container.public_id = container.publicId or ""
                proto_container.container_version.container.container_id = container.containerId or ""
                proto_container.container_version.container.account_id = container.accountId or ""
            
            # Convert tags
            if hasattr(container_version, 'tag') and container_version.tag:
                for tag in container_version.tag:
                    tag_proto = proto_container.container_version.tag.add()
                    _convert_tag_to_proto(tag, tag_proto)
            
            # Convert triggers
            if hasattr(container_version, 'trigger') and container_version.trigger:
                for trigger in container_version.trigger:
                    trigger_proto = proto_container.container_version.trigger.add()
                    _convert_trigger_to_proto(trigger, trigger_proto)
            
            # Convert variables
            if hasattr(container_version, 'variable') and container_version.variable:
                for variable in container_version.variable:
                    variable_proto = proto_container.container_version.variable.add()
                    _convert_variable_to_proto(variable, variable_proto)
        
        return proto_container
        
    except Exception as e:
        logger.error(f"Error converting Pydantic GTM to protobuf: {str(e)}")
        raise


def _convert_tag_to_proto(tag: Tag, tag_proto: TagProto) -> None:
    """Convert Pydantic Tag to protobuf Tag."""
    tag_proto.tag_id = tag.tagId or ""
    tag_proto.name = tag.name or ""
    tag_proto.type = tag.type or ""
    
    # Convert parameters
    if hasattr(tag, 'parameter') and tag.parameter:
        for param in tag.parameter:
            param_proto = tag_proto.parameter.add()
            param_proto.key = param.key or ""
            param_proto.value = param.value or ""
    
    # Convert firing triggers
    if hasattr(tag, 'firingTriggerId') and tag.firingTriggerId:
        tag_proto.firing_trigger_id[:] = tag.firingTriggerId
    
    # Convert blocking triggers
    if hasattr(tag, 'blockingTriggerId') and tag.blockingTriggerId:
        tag_proto.blocking_trigger_id[:] = tag.blockingTriggerId


def _convert_trigger_to_proto(trigger: Trigger, trigger_proto: TriggerProto) -> None:
    """Convert Pydantic Trigger to protobuf Trigger."""
    trigger_proto.trigger_id = trigger.triggerId or ""
    trigger_proto.name = trigger.name or ""
    trigger_proto.type = trigger.type or ""


def _convert_variable_to_proto(variable: Variable, variable_proto: VariableProto) -> None:
    """Convert Pydantic Variable to protobuf Variable."""
    variable_proto.variable_id = variable.variableId or ""
    variable_proto.name = variable.name or ""
    variable_proto.type = variable.type or ""
    
    # Convert parameters
    if hasattr(variable, 'parameter') and variable.parameter:
        for param in variable.parameter:
            param_proto = variable_proto.parameter.add()
            param_proto.key = param.key or ""
            param_proto.value = param.value or ""


def dict_to_analysis_request(
    service_name: str, 
    module_data: Dict[str, Any], 
    gtm_container: Optional[GTMContainer] = None
):
    """
    Convert dictionary data to appropriate protobuf request based on service type.
    
    Args:
        service_name: Name of the analysis service
        module_data: Dictionary data from data extractors
        gtm_container: Optional full GTM container for complete analysis
        
    Returns:
        Appropriate protobuf request message
    """
    try:
        # Return service-specific requests based on the protobuf definitions
        if service_name == "associations":
            request = AssociationsAnalysisRequest()
            request.request_id = "grpc-" + service_name
            
            # Convert tags data
            if "tags" in module_data:
                for tag_data in module_data["tags"]:
                    tag_info = request.tags.add()
                    tag_info.id = tag_data.get("id", "")
                    tag_info.name = tag_data.get("name", "")
                    tag_info.type = tag_data.get("type", "")
                    if "firing_triggers" in tag_data:
                        tag_info.firing_triggers[:] = tag_data["firing_triggers"]
                    if "blocking_triggers" in tag_data:
                        tag_info.blocking_triggers[:] = tag_data["blocking_triggers"]
                    if "variable_references" in tag_data:
                        tag_info.variable_references[:] = tag_data["variable_references"]
            
            # Convert triggers data
            if "triggers" in module_data:
                for trigger_data in module_data["triggers"]:
                    trigger_info = request.triggers.add()
                    trigger_info.id = trigger_data.get("id", "")
                    trigger_info.name = trigger_data.get("name", "")
                    trigger_info.type = trigger_data.get("type", "")
            
            # Convert variables data
            if "variables" in module_data:
                for variable_data in module_data["variables"]:
                    variable_info = request.variables.add()
                    variable_info.id = variable_data.get("id", "")
                    variable_info.name = variable_data.get("name", "")
                    variable_info.type = variable_data.get("type", "")
            
            return request
            
        elif service_name == "governance":
            request = GovernanceAnalysisRequest()
            request.request_id = "grpc-" + service_name
            
            # Convert elements to appropriate governance objects
            if "elements" in module_data:
                for element in module_data["elements"]:
                    element_type = element.get("type", "")
                    
                    if element_type == "tag" or "tag" in element_type.lower():
                        tag_info = request.tags.add()
                        tag_info.id = element.get("id", "")
                        tag_info.name = element.get("name", "")
                        tag_info.type = element.get("type", "")
                    elif element_type == "trigger" or "trigger" in element_type.lower():
                        trigger_info = request.triggers.add()
                        trigger_info.id = element.get("id", "")
                        trigger_info.name = element.get("name", "")
                        trigger_info.type = element.get("type", "")
                    elif element_type == "variable" or "variable" in element_type.lower():
                        variable_info = request.variables.add()
                        variable_info.id = element.get("id", "")
                        variable_info.name = element.get("name", "")
                        variable_info.type = element.get("type", "")
            
            return request
            
        elif service_name == "javascript":
            request = JavaScriptAnalysisRequest()
            request.request_id = "grpc-" + service_name
            
            # Convert JavaScript code snippets
            if "javascript_snippets" in module_data:
                for snippet in module_data["javascript_snippets"]:
                    js_item = request.items.add()
                    js_item.id = snippet.get("tag_id", "")
                    js_item.name = snippet.get("tag_name", "")
                    js_item.type = snippet.get("type", "")
                    js_item.element_type = "tag"
                    js_item.javascript_code = snippet.get("code", "")
            
            return request
            
        elif service_name == "html":
            request = HTMLAnalysisRequest()
            request.request_id = "grpc-" + service_name
            
            # Convert HTML code snippets
            if "html_snippets" in module_data:
                for snippet in module_data["html_snippets"]:
                    html_item = request.items.add()
                    html_item.id = snippet.get("tag_id", "")
                    html_item.name = snippet.get("tag_name", "")
                    html_item.type = snippet.get("type", "")
                    html_item.element_type = "tag"
                    html_item.html_code = snippet.get("code", "")
            
            return request
        
        else:
            raise ValueError(f"Unknown service name: {service_name}")
        
    except Exception as e:
        logger.error(f"Error creating analysis request for {service_name}: {str(e)}")
        raise


def proto_to_module_result(response: ModuleResultProto) -> Dict[str, Any]:
    """
    Convert protobuf ModuleResult to dictionary (for backwards compatibility).
    
    Args:
        response: Protobuf ModuleResult
        
    Returns:
        Dictionary representation compatible with existing code
    """
    try:
        # Convert status enum to string
        status_map = {
            0: "unknown",    # STATUS_UNSPECIFIED
            1: "completed",  # SUCCESS
            2: "error",      # ERROR
            3: "partial"     # PARTIAL
        }
        
        result = {
            "module": response.module,
            "status": status_map.get(response.status, "unknown"),
            "issues": [],
            "summary": {}
        }
        
        # Convert issues
        for issue_proto in response.issues:
            # Convert severity enum to string
            severity_map = {
                0: "unknown",   # SEVERITY_UNSPECIFIED
                1: "low",       # LOW
                2: "medium",    # MEDIUM
                3: "high",      # HIGH
                4: "critical"   # CRITICAL
            }
            
            issue = {
                "type": issue_proto.type,
                "severity": severity_map.get(issue_proto.severity, "unknown"),
                "message": issue_proto.message,
                "element": dict(issue_proto.element),  # Convert map to dict
                "recommendation": issue_proto.recommendation
            }
            result["issues"].append(issue)
        
        # Convert summary
        for key, value in response.summary.items():
            result["summary"][key] = value
        
        return result
        
    except Exception as e:
        logger.error(f"Error converting protobuf response: {str(e)}")
        raise


def create_error_analysis_response(service_name: str, error_message: str) -> Dict[str, Any]:
    """
    Create error response in the expected format.
    
    Args:
        service_name: Name of the service that failed
        error_message: Error message
        
    Returns:
        Error response dictionary
    """
    return {
        "module": service_name,
        "status": "error",
        "issues": [],
        "summary": {"error": error_message}
    }