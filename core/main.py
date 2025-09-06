"""
Core Orchestrator for GTM Container Quality Assurance System.

This FastAPI application serves as the central hub for:
- Receiving GTM container uploads
- Parsing and validating GTM JSON structure
- Coordinating analysis across multiple test modules
- Aggregating and returning final reports
"""

import logging
import os
import uuid
import httpx
from typing import List, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

# Import gRPC client and data converters
from grpc_client import get_grpc_client, close_grpc_client, grpc_client_context
from data_converters import (
    dict_to_analysis_request,
    proto_to_module_result,
    create_error_analysis_response
)

from gtm_models import (
    GTMContainer, 
    ModuleResult, 
    OrchestratorResponse,
    TestIssue
)
from data_extractors import (
    extract_associations_data,
    extract_governance_data, 
    extract_javascript_data,
    extract_html_data
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GTM Quality Assurance Orchestrator",
    description="Central coordinator for GTM container analysis modules",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Module registry - maps module names to their endpoints and data extractors
# Updated to support both HTTP and gRPC protocols during migration
# Endpoints are configurable via environment variables; defaults target Docker service names
MODULE_REGISTRY = {
    "associations": {
        "protocol": os.getenv("ASSOCIATIONS_PROTOCOL", "http"),  # http or grpc
        "http_endpoint": os.getenv(
            "ASSOCIATIONS_URL",
            "http://gtm-module-associations:8001/analyze/associations",
        ),
        "grpc_target": os.getenv(
            "ASSOCIATIONS_GRPC_TARGET",
            "gtm-module-associations:50051"
        ),
        "extractor": extract_associations_data,
    },
    "governance": {
        "protocol": os.getenv("GOVERNANCE_PROTOCOL", "http"),
        "http_endpoint": os.getenv(
            "GOVERNANCE_URL",
            "http://gtm-module-governance:8002/analyze/governance",
        ),
        "grpc_target": os.getenv(
            "GOVERNANCE_GRPC_TARGET",
            "gtm-module-governance:50052"
        ),
        "extractor": extract_governance_data,
    },
    "javascript": {
        "protocol": os.getenv("JAVASCRIPT_PROTOCOL", "http"),
        "http_endpoint": os.getenv(
            "JAVASCRIPT_URL",
            "http://gtm-module-javascript:8003/analyze/javascript",
        ),
        "grpc_target": os.getenv(
            "JAVASCRIPT_GRPC_TARGET",
            "gtm-module-javascript:50053"
        ),
        "extractor": extract_javascript_data,
    },
    "html": {
        "protocol": os.getenv("HTML_PROTOCOL", "http"),
        "http_endpoint": os.getenv(
            "HTML_URL",
            "http://gtm-module-html:8004/analyze/html",
        ),
        "grpc_target": os.getenv(
            "HTML_GRPC_TARGET",
            "gtm-module-html:50054"
        ),
        "extractor": extract_html_data,
    },
}

# In-memory storage for analysis results (use Redis/DB in production)
analysis_results: Dict[str, OrchestratorResponse] = {}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "gtm-orchestrator",
        "version": "1.0.0"
    }


@app.post("/upload-and-analyze")
async def upload_and_analyze(
    gtm_file: UploadFile = File(...),
    selected_tests: str = Form(...)  # JSON string of test names
):
    """
    Main endpoint: Upload GTM container and run selected analysis modules.
    
    Args:
        gtm_file: GTM container JSON export file
        selected_tests: JSON array of module names to run, e.g., ["associations", "naming"]
    
    Returns:
        Analysis request ID and initial response
    """
    request_id = str(uuid.uuid4())
    
    try:
        # Parse selected tests
        import json
        test_modules = json.loads(selected_tests)
        logger.info(f"Request {request_id}: Running tests {test_modules}")
        
        # Read and parse GTM file
        file_content = await gtm_file.read()
        gtm_data = json.loads(file_content.decode('utf-8'))
        
        # Validate GTM container structure
        try:
            gtm_container = GTMContainer(**gtm_data)
        except ValidationError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid GTM container format: {str(e)}"
            )
        
        # Initialize response
        response = OrchestratorResponse(
            request_id=request_id,
            status="processing",
            container_info={
                "name": gtm_container.containerVersion.container.name,
                "publicId": gtm_container.containerVersion.container.publicId,
                "accountId": gtm_container.containerVersion.container.accountId,
                "exportTime": gtm_container.exportTime
            },
            results={}
        )
        
        # Store initial response
        analysis_results[request_id] = response
        
        # Run analysis modules in background
        await run_analysis_modules(request_id, gtm_container, test_modules)
        
        return response
        
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid JSON file format"
        )
    except Exception as e:
        logger.error(f"Request {request_id}: Error processing upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/analysis/{request_id}")
async def get_analysis_result(request_id: str):
    """
    Get analysis results by request ID.
    
    Args:
        request_id: The UUID returned from upload-and-analyze
        
    Returns:
        Current analysis status and results
    """
    if request_id not in analysis_results:
        raise HTTPException(
            status_code=404,
            detail="Analysis request not found"
        )
    
    return analysis_results[request_id]


async def run_analysis_modules(
    request_id: str, 
    gtm_container: GTMContainer, 
    test_modules: List[str]
):
    """
    Execute selected analysis modules and aggregate results.
    Supports both HTTP and gRPC protocols based on module configuration.
    
    Args:
        request_id: Unique request identifier
        gtm_container: Parsed GTM container
        test_modules: List of module names to execute
    """
    try:
        results = {}
        total_summary = {"total_issues": 0, "critical": 0, "medium": 0, "low": 0}
        
        # Initialize HTTP client for modules still using HTTP
        http_client = httpx.AsyncClient()
        
        # Initialize gRPC client for modules using gRPC
        grpc_client = await get_grpc_client()
        
        try:
            # Execute each requested module
            for module_name in test_modules:
                if module_name not in MODULE_REGISTRY:
                    logger.warning(f"Unknown module: {module_name}")
                    continue
                
                try:
                    logger.info(f"Request {request_id}: Calling {module_name} module")
                    
                    # Extract minimal data for this specific module
                    module_config = MODULE_REGISTRY[module_name]
                    extractor = module_config["extractor"]
                    module_data = extractor(gtm_container)
                    
                    logger.info(f"Request {request_id}: Extracted {len(str(module_data))} chars of data for {module_name}")
                    
                    # Choose protocol based on module configuration
                    protocol = module_config.get("protocol", "http")
                    
                    if protocol == "grpc":
                        # Call via gRPC
                        result_dict = await _call_module_via_grpc(
                            request_id, module_name, module_config, 
                            module_data, gtm_container, grpc_client
                        )
                    else:
                        # Call via HTTP (backward compatibility)
                        result_dict = await _call_module_via_http(
                            request_id, module_name, module_config, 
                            module_data, http_client
                        )
                    
                    # Convert result to ModuleResult for consistency
                    try:
                        module_result = ModuleResult(**result_dict)
                        results[module_name] = module_result
                    except ValidationError as ve:
                        logger.error(
                            f"Request {request_id}: Validation error parsing {module_name} response: {ve}"
                        )
                        error_result = ModuleResult(
                            module=module_name,
                            status="error",
                            issues=[],
                            summary={"error": "validation_error"}
                        )
                        results[module_name] = error_result
                    
                    # Aggregate summary
                    if results[module_name].summary:
                        for key, value in results[module_name].summary.items():
                            if key in total_summary and isinstance(value, (int, float)):
                                total_summary[key] += int(value)
                    
                    logger.info(f"Request {request_id}: {module_name} completed successfully via {protocol.upper()}")
                    
                except Exception as e:
                    error_result = ModuleResult(
                        module=module_name,
                        status="error",
                        issues=[],
                        summary={}
                    )
                    results[module_name] = error_result
                    logger.error(f"Request {request_id}: {module_name} error: {str(e)}")
        
        finally:
            # Clean up HTTP client
            await http_client.aclose()
        
        # Update final results
        analysis_results[request_id].results = results
        analysis_results[request_id].summary = total_summary
        analysis_results[request_id].status = "completed"
        
        logger.info(f"Request {request_id}: Analysis completed with {total_summary['total_issues']} total issues")
        
    except Exception as e:
        logger.error(f"Request {request_id}: Fatal error in analysis: {str(e)}")
        analysis_results[request_id].status = "failed"


async def _call_module_via_grpc(
    request_id: str, 
    module_name: str, 
    module_config: Dict[str, Any], 
    module_data: Dict[str, Any], 
    gtm_container: GTMContainer,
    grpc_client
) -> Dict[str, Any]:
    """
    Call analysis module via gRPC.
    
    Args:
        request_id: Request identifier
        module_name: Name of the module
        module_config: Module configuration
        module_data: Extracted data for the module
        gtm_container: Full GTM container
        grpc_client: gRPC client instance
        
    Returns:
        Analysis result dictionary
    """
    try:
        target = module_config["grpc_target"]
        logger.info(f"Request {request_id}: Calling {module_name} via gRPC at {target}")
        
        # Convert data to protobuf request
        request = dict_to_analysis_request(module_name, module_data, gtm_container)
        
        # Call gRPC service
        response = await grpc_client.call_analysis_service(
            module_name, target, request
        )
        
        if response:
            # Convert protobuf response back to dictionary
            return proto_to_module_result(response)
        else:
            return create_error_analysis_response(module_name, "gRPC call failed")
            
    except Exception as e:
        logger.error(f"Request {request_id}: gRPC error for {module_name}: {str(e)}")
        return create_error_analysis_response(module_name, str(e))


async def _call_module_via_http(
    request_id: str, 
    module_name: str, 
    module_config: Dict[str, Any], 
    module_data: Dict[str, Any],
    http_client: httpx.AsyncClient
) -> Dict[str, Any]:
    """
    Call analysis module via HTTP (backward compatibility).
    
    Args:
        request_id: Request identifier
        module_name: Name of the module
        module_config: Module configuration
        module_data: Extracted data for the module
        http_client: HTTP client instance
        
    Returns:
        Analysis result dictionary
    """
    try:
        endpoint = module_config["http_endpoint"]
        logger.info(f"Request {request_id}: Calling {module_name} via HTTP at {endpoint}")
        
        # Call module endpoint with minimal data
        response = await http_client.post(
            endpoint,
            json=module_data,
            timeout=30.0
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return create_error_analysis_response(
                module_name, f"HTTP {response.status_code}"
            )
            
    except httpx.TimeoutException:
        return create_error_analysis_response(module_name, "HTTP timeout")
    except Exception as e:
        logger.error(f"Request {request_id}: HTTP error for {module_name}: {str(e)}")
        return create_error_analysis_response(module_name, str(e))


@app.get("/modules")
async def list_available_modules():
    """
    List all available analysis modules and their status.
    Supports both HTTP and gRPC health checks.
    
    Returns:
        Dictionary of modules and their health status with protocol info
    """
    module_info = {}
    grpc_client = await get_grpc_client()
    
    async with httpx.AsyncClient() as http_client:
        for module_name, module_config in MODULE_REGISTRY.items():
            protocol = module_config.get("protocol", "http")
            
            try:
                if protocol == "grpc":
                    # Check gRPC module health
                    target = module_config["grpc_target"]
                    is_healthy = await grpc_client.health_check_service(module_name, target)
                    status = "healthy" if is_healthy else "unhealthy"
                else:
                    # Check HTTP module health
                    endpoint = module_config["http_endpoint"]
                    health_url = endpoint.replace("/analyze/" + module_name.split("/")[-1], "/health")
                    response = await http_client.get(health_url, timeout=5.0)
                    status = "healthy" if response.status_code == 200 else "unhealthy"
                
                module_info[module_name] = {
                    "protocol": protocol,
                    "status": status,
                    "endpoint": module_config.get("grpc_target" if protocol == "grpc" else "http_endpoint")
                }
                
            except Exception as e:
                logger.warning(f"Health check failed for {module_name}: {str(e)}")
                module_info[module_name] = {
                    "protocol": protocol,
                    "status": "offline",
                    "endpoint": module_config.get("grpc_target" if protocol == "grpc" else "http_endpoint"),
                    "error": str(e)
                }
    
    return {
        "available_modules": list(MODULE_REGISTRY.keys()),
        "modules": module_info
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
