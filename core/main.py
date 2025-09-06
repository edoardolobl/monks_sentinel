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
# Updated for local testing with simplified data extraction
# Endpoints are configurable via environment variables; defaults target Docker service names
MODULE_REGISTRY = {
    "associations": {
        "endpoint": os.getenv(
            "ASSOCIATIONS_URL",
            "http://gtm-module-associations:8001/analyze/associations",
        ),
        "extractor": extract_associations_data,
    },
    "governance": {
        "endpoint": os.getenv(
            "GOVERNANCE_URL",
            "http://gtm-module-governance:8002/analyze/governance",
        ),
        "extractor": extract_governance_data,
    },
    "javascript": {
        "endpoint": os.getenv(
            "JAVASCRIPT_URL",
            "http://gtm-module-javascript:8003/analyze/javascript",
        ),
        "extractor": extract_javascript_data,
    },
    "html": {
        "endpoint": os.getenv(
            "HTML_URL",
            "http://gtm-module-html:8004/analyze/html",
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
    
    Args:
        request_id: Unique request identifier
        gtm_container: Parsed GTM container
        test_modules: List of module names to execute
    """
    try:
        results = {}
        total_summary = {"total_issues": 0, "critical": 0, "medium": 0, "low": 0}
        
        # Execute each requested module
        async with httpx.AsyncClient() as client:
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
                    
                    # Call module endpoint with minimal data
                    response = await client.post(
                        module_config["endpoint"],
                        json=module_data,
                        timeout=30.0
                    )
                    
                    if response.status_code == 200:
                        payload = response.json()
                        try:
                            module_result = ModuleResult(**payload)
                            results[module_name] = module_result
                        except ValidationError as ve:
                            logger.error(
                                f"Request {request_id}: Validation error parsing {module_name} response: {ve}"
                            )
                            logger.error(
                                f"Request {request_id}: Raw {module_name} payload keys: {list(payload.keys())}"
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
                        
                        logger.info(f"Request {request_id}: {module_name} completed successfully")
                    else:
                        # Module returned error
                        error_result = ModuleResult(
                            module=module_name,
                            status="error",
                            issues=[],
                            summary={}
                        )
                        results[module_name] = error_result
                        logger.error(f"Request {request_id}: {module_name} returned error: {response.status_code}")
                        
                except httpx.TimeoutException:
                    error_result = ModuleResult(
                        module=module_name,
                        status="timeout",
                        issues=[],
                        summary={}
                    )
                    results[module_name] = error_result
                    logger.error(f"Request {request_id}: {module_name} timed out")
                    
                except Exception as e:
                    error_result = ModuleResult(
                        module=module_name,
                        status="error",
                        issues=[],
                        summary={}
                    )
                    results[module_name] = error_result
                    logger.error(f"Request {request_id}: {module_name} error: {str(e)}")
        
        # Update final results
        analysis_results[request_id].results = results
        analysis_results[request_id].summary = total_summary
        analysis_results[request_id].status = "completed"
        
        logger.info(f"Request {request_id}: Analysis completed with {total_summary['total_issues']} total issues")
        
    except Exception as e:
        logger.error(f"Request {request_id}: Fatal error in analysis: {str(e)}")
        analysis_results[request_id].status = "failed"


@app.get("/modules")
async def list_available_modules():
    """
    List all available analysis modules and their status.
    
    Returns:
        Dictionary of modules and their health status
    """
    module_status = {}
    
    async with httpx.AsyncClient() as client:
        for module_name, module_config in MODULE_REGISTRY.items():
            try:
                # Check module health
                endpoint = module_config["endpoint"]
                health_url = endpoint.replace("/analyze/" + module_name.split("/")[-1], "/health")
                response = await client.get(health_url, timeout=5.0)
                
                if response.status_code == 200:
                    module_status[module_name] = "healthy"
                else:
                    module_status[module_name] = "unhealthy"
            except:
                module_status[module_name] = "offline"
    
    return {
        "available_modules": list(MODULE_REGISTRY.keys()),
        "status": module_status
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
