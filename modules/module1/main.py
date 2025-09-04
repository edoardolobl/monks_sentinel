"""
FastAPI application for GTM associations analysis.

A simple, clean microservice that accepts GTM container exports and returns
association analysis results using the existing models and analyzer modules.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import Dict, Any
import logging

from models import GTMContainer
from associations_analyzer import analyze_gtm_associations

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="GTM Associations Analyzer",
    description="Analyze Google Tag Manager containers for orphaned elements and association issues",
    version="1.0.0"
)


class AnalysisResponse(BaseModel):
    """Response model for analysis results."""
    status: str
    analysis: Dict[str, Any]


class ErrorResponse(BaseModel):
    """Response model for errors."""
    status: str
    error: str
    detail: str


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "gtm-associations-analyzer"}


@app.post("/analyze/associations", response_model=AnalysisResponse)
async def analyze_associations(gtm_data: Dict[str, Any]):
    """
    Analyze GTM container for association issues.
    
    Args:
        gtm_data: GTM container export JSON data
        
    Returns:
        Analysis results with orphaned elements and dangling references
        
    Raises:
        HTTPException: For invalid JSON structure or parsing errors
    """
    try:
        # Parse GTM container using Pydantic model
        container = GTMContainer(**gtm_data)
        
        # Run associations analysis
        analysis_results = analyze_gtm_associations(container)
        
        logger.info(f"Successfully analyzed container: {container.containerVersion.container.name}")
        
        return AnalysisResponse(
            status="success",
            analysis=analysis_results
        )
        
    except ValidationError as e:
        # Handle Pydantic validation errors
        error_msg = "Invalid GTM container format"
        logger.error(f"Validation error: {e}")
        
        raise HTTPException(
            status_code=400,
            detail={
                "status": "error",
                "error": error_msg,
                "detail": str(e)
            }
        )
    
    except KeyError as e:
        # Handle missing required fields
        error_msg = f"Missing required field: {str(e)}"
        logger.error(f"KeyError: {e}")
        
        raise HTTPException(
            status_code=400,
            detail={
                "status": "error", 
                "error": error_msg,
                "detail": f"Required field {str(e)} not found in GTM container data"
            }
        )
    
    except Exception as e:
        # Handle unexpected errors
        error_msg = "Internal server error during analysis"
        logger.error(f"Unexpected error: {e}")
        
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "error": error_msg,
                "detail": str(e)
            }
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
    uvicorn.run(app, host="0.0.0.0", port=8000)