"""
FastAPI application for GTM associations analysis.

A simple, clean microservice that receives plain JSON data from the API Gateway
and returns association analysis results. With the API Gateway pattern, this module
no longer needs complex GTM schema models and works with simplified data structures.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import Dict, Any
import logging

# Import only result models - no complex GTM schema needed
from models import ModuleResult, TestIssue
from associations_analyzer import AssociationsAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="GTM Associations Analyzer",
    description="Analyze Google Tag Manager containers for orphaned elements and association issues",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# Response models now use shared core models - removed local definitions


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "gtm-associations-analyzer"}


@app.post("/analyze/associations", response_model=ModuleResult)
async def analyze_associations(request: Dict[str, Any]):
    """
    Analyze GTM container for association issues.
    
    Args:
        request: Plain JSON with minimal data (tags, triggers, variables, builtin_variables)
        
    Returns:
        ModuleResult with standardized TestIssue objects
        
    Raises:
        HTTPException: For processing errors
    """
    try:
        # Validate that required fields are present
        required_fields = ['tags', 'triggers', 'variables']
        for field in required_fields:
            if field not in request:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required field: {field}"
                )
        
        # Initialize analyzer with plain JSON data
        analyzer = AssociationsAnalyzer(request)
        
        # Run associations analysis and get standardized results
        issues = analyzer.analyze_all()
        
        # Calculate summary statistics
        summary = {
            "total_issues": len(issues),
            "critical": len([i for i in issues if i.severity == "critical"]),
            "medium": len([i for i in issues if i.severity == "medium"]),
            "low": len([i for i in issues if i.severity == "low"])
        }
        
        logger.info(f"Successfully analyzed {len(request.get('tags', []))} tags, {len(request.get('triggers', []))} triggers, {len(request.get('variables', []))} variables")
        
        return ModuleResult(
            module="associations",
            status="success",
            issues=issues,
            summary=summary
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        # Handle analysis errors
        error_msg = f"Analysis error: {str(e)}"
        logger.error(f"Analysis error: {e}")
        
        return ModuleResult(
            module="associations", 
            status="error",
            issues=[],
            summary={"error": error_msg}
        )
    


# Exception handlers for custom error responses
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler to return consistent error format."""
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)