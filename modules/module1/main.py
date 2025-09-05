"""
FastAPI application for GTM associations analysis.

A simple, clean microservice that accepts GTM container exports and returns
association analysis results using the existing models and analyzer modules.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import Dict, Any
import logging

# Import local models
from models import AnalysisRequest, ModuleResult, TestIssue
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
async def analyze_associations(request: AnalysisRequest):
    """
    Analyze GTM container for association issues.
    
    Args:
        request: AnalysisRequest with structured GTM data (tags, triggers, variables)
        
    Returns:
        ModuleResult with standardized TestIssue objects
        
    Raises:
        HTTPException: For processing errors
    """
    try:
        # Initialize analyzer with structured data from request
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
        
        logger.info(f"Successfully analyzed {len(request.tags)} tags, {len(request.triggers)} triggers, {len(request.variables)} variables")
        
        return ModuleResult(
            module="associations",
            status="success",
            issues=issues,
            summary=summary
        )
        
    except ValidationError as e:
        # Handle Pydantic validation errors in request
        error_msg = "Invalid AnalysisRequest format"
        logger.error(f"Validation error: {e}")
        
        return ModuleResult(
            module="associations",
            status="error",
            issues=[],
            summary={"error": error_msg, "detail": str(e)}
        )
    
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