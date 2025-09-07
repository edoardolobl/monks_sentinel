"""
gRPC server for GTM associations analysis.

Converted from FastAPI to gRPC while maintaining all existing functionality.
This module receives protobuf requests and returns association analysis results
using the existing AssociationsAnalyzer logic.
"""

import asyncio
import logging
import signal
import sys
import os
from concurrent import futures
from typing import Dict, Any

import grpc
from grpc_health.v1 import health_pb2, health_pb2_grpc
from grpc_health.v1.health import HealthServicer

# Add the generated protobuf files to the path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'generated', 'python'))

try:
    import gtm_analysis_pb2
    import gtm_analysis_pb2_grpc
except ImportError as e:
    print(f"Failed to import protobuf files: {e}")
    print("Make sure the generated protobuf files are available in /generated/python/")
    sys.exit(1)

# Import existing analyzer and models
from associations_analyzer import AssociationsAnalyzer
from models import TestIssue, ModuleResult

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AssociationsAnalysisServicer(gtm_analysis_pb2_grpc.AssociationsAnalysisServiceServicer):
    """
    gRPC service implementation for GTM associations analysis.
    
    Implements the AssociationsAnalysisService defined in the protobuf file.
    Uses the existing AssociationsAnalyzer for all analysis logic.
    """

    def AnalyzeAssociations(self, request: gtm_analysis_pb2.AssociationsAnalysisRequest, context):
        """
        Analyze GTM container for association issues.
        
        Args:
            request: AssociationsAnalysisRequest protobuf message
            context: gRPC service context
            
        Returns:
            ModuleResult protobuf message with analysis results
        """
        try:
            logger.info(f"Received associations analysis request: {request.request_id}")
            
            # Convert protobuf request to plain JSON format for existing analyzer
            data = self._convert_protobuf_to_json(request)
            
            # Initialize analyzer with converted data
            analyzer = AssociationsAnalyzer(data)
            
            # Run associations analysis
            issues = analyzer.analyze_all()
            
            # Calculate summary statistics
            summary = {
                "total_issues": len(issues),
                "critical": len([i for i in issues if i.severity == "critical"]),
                "medium": len([i for i in issues if i.severity == "medium"]),
                "low": len([i for i in issues if i.severity == "low"])
            }
            
            logger.info(f"Analysis completed: found {len(issues)} issues")
            
            # Create ModuleResult (Pydantic model)
            result = ModuleResult(
                module="associations",
                status="success", 
                issues=issues,
                summary=summary
            )
            
            # Convert to protobuf response
            return self._convert_result_to_protobuf(result)
            
        except Exception as e:
            error_msg = f"Analysis error: {str(e)}"
            logger.error(f"Analysis error: {e}")
            
            # Return error result
            error_result = ModuleResult(
                module="associations",
                status="error",
                issues=[],
                summary={"error": error_msg}
            )
            
            return self._convert_result_to_protobuf(error_result)

    def CheckHealth(self, request: gtm_analysis_pb2.HealthRequest, context):
        """
        Health check endpoint for the associations analysis service.
        
        Args:
            request: HealthRequest protobuf message
            context: gRPC service context
            
        Returns:
            HealthResponse protobuf message
        """
        try:
            logger.debug("Health check requested")
            
            response = gtm_analysis_pb2.HealthResponse()
            response.status = gtm_analysis_pb2.HealthResponse.Status.SERVING
            response.message = "Associations Analysis Service is healthy"
            
            # Add some metadata
            response.metadata["service"] = "gtm-associations-analyzer"
            response.metadata["version"] = "1.0.0"
            response.metadata["module"] = "associations"
            
            return response
            
        except Exception as e:
            logger.error(f"Health check error: {e}")
            
            response = gtm_analysis_pb2.HealthResponse()
            response.status = gtm_analysis_pb2.HealthResponse.Status.NOT_SERVING
            response.message = f"Service unhealthy: {str(e)}"
            
            return response

    def _convert_protobuf_to_json(self, request: gtm_analysis_pb2.AssociationsAnalysisRequest) -> Dict[str, Any]:
        """
        Convert protobuf request to plain JSON format expected by existing analyzer.
        
        Args:
            request: AssociationsAnalysisRequest protobuf message
            
        Returns:
            Dictionary with tags, triggers, variables, builtin_variables
        """
        data = {
            "tags": [],
            "triggers": [],
            "variables": [],
            "builtin_variables": []
        }
        
        # Convert tags
        for tag in request.tags:
            data["tags"].append({
                "id": tag.id,
                "name": tag.name,
                "type": tag.type,
                "firing_triggers": list(tag.firing_triggers),
                "blocking_triggers": list(tag.blocking_triggers),
                "variable_references": list(tag.variable_references)
            })
        
        # Convert triggers
        for trigger in request.triggers:
            data["triggers"].append({
                "id": trigger.id,
                "name": trigger.name,
                "type": trigger.type
            })
        
        # Convert variables
        for variable in request.variables:
            data["variables"].append({
                "id": variable.id,
                "name": variable.name,
                "type": variable.type
            })
        
        # Convert builtin variables
        for builtin_var in request.builtin_variables:
            data["builtin_variables"].append({
                "name": builtin_var.name,
                "type": builtin_var.type
            })
        
        return data

    def _convert_result_to_protobuf(self, result: ModuleResult) -> gtm_analysis_pb2.ModuleResult:
        """
        Convert Pydantic ModuleResult to protobuf ModuleResult.
        
        Args:
            result: Pydantic ModuleResult object
            
        Returns:
            Protobuf ModuleResult message
        """
        pb_result = gtm_analysis_pb2.ModuleResult()
        pb_result.module = result.module
        
        # Set status
        if result.status == "success":
            pb_result.status = gtm_analysis_pb2.ModuleResult.Status.SUCCESS
        elif result.status == "error":
            pb_result.status = gtm_analysis_pb2.ModuleResult.Status.ERROR
        else:
            pb_result.status = gtm_analysis_pb2.ModuleResult.Status.STATUS_UNSPECIFIED
        
        # Convert issues
        for issue in result.issues:
            pb_issue = gtm_analysis_pb2.TestIssue()
            pb_issue.type = issue.type
            pb_issue.message = issue.message
            pb_issue.recommendation = issue.recommendation
            pb_issue.module = "associations"
            
            # Set severity
            if issue.severity == "critical":
                pb_issue.severity = gtm_analysis_pb2.TestIssue.Severity.CRITICAL
            elif issue.severity == "high":
                pb_issue.severity = gtm_analysis_pb2.TestIssue.Severity.HIGH
            elif issue.severity == "medium":
                pb_issue.severity = gtm_analysis_pb2.TestIssue.Severity.MEDIUM
            elif issue.severity == "low":
                pb_issue.severity = gtm_analysis_pb2.TestIssue.Severity.LOW
            else:
                pb_issue.severity = gtm_analysis_pb2.TestIssue.Severity.SEVERITY_UNSPECIFIED
            
            # Convert element dictionary to protobuf map
            if issue.element:
                for key, value in issue.element.items():
                    pb_issue.element[key] = str(value)
            
            pb_result.issues.append(pb_issue)
        
        # Convert summary
        if result.summary:
            for key, value in result.summary.items():
                if isinstance(value, int):
                    pb_result.summary[key] = value
                else:
                    # For non-integer values like error messages, skip or handle specially
                    logger.debug(f"Skipping non-integer summary value: {key}={value}")
        
        return pb_result


async def serve():
    """
    Start the gRPC server with proper configuration.
    """
    # Create the gRPC server
    server = grpc.aio.server(
        futures.ThreadPoolExecutor(max_workers=10),
        options=[
            ('grpc.keepalive_time_ms', 30000),
            ('grpc.keepalive_timeout_ms', 10000), 
            ('grpc.keepalive_permit_without_calls', True),
            ('grpc.http2.max_pings_without_data', 0),
            ('grpc.http2.min_time_between_pings_ms', 10000),
            ('grpc.http2.min_ping_interval_without_data_ms', 300000)
        ]
    )

    # Add the associations analysis service
    associations_servicer = AssociationsAnalysisServicer()
    gtm_analysis_pb2_grpc.add_AssociationsAnalysisServiceServicer_to_server(
        associations_servicer, server
    )

    # Add health check service
    health_servicer = HealthServicer()
    health_pb2_grpc.add_HealthServicer_to_server(health_servicer, server)
    
    # Set health status for the associations service
    health_servicer.set("gtm.analysis.v1.AssociationsAnalysisService", health_pb2.HealthCheckResponse.SERVING)
    health_servicer.set("", health_pb2.HealthCheckResponse.SERVING)  # Overall server health

    # Enable reflection for easier debugging (optional)
    try:
        from grpc_reflection.v1alpha import reflection
        SERVICE_NAMES = (
            gtm_analysis_pb2.DESCRIPTOR.services_by_name['AssociationsAnalysisService'].full_name,
            health_pb2.DESCRIPTOR.services_by_name['Health'].full_name,
            reflection.SERVICE_NAME,
        )
        reflection.enable_server_reflection(SERVICE_NAMES, server)
        logger.info("Server reflection enabled")
    except ImportError:
        logger.warning("Server reflection not available")

    # Bind to port
    listen_addr = '0.0.0.0:50051'
    server.add_insecure_port(listen_addr)
    
    # Start server
    logger.info(f"Starting gRPC server on {listen_addr}")
    await server.start()
    logger.info("gRPC server started successfully")
    
    # Handle graceful shutdown
    def signal_handler(sig, frame):
        logger.info("Received shutdown signal, stopping server...")
        asyncio.create_task(server.stop(grace=10))
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Keep the server running
    try:
        await server.wait_for_termination()
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    finally:
        logger.info("Server shutdown complete")


# FastAPI server implementation (commented out for potential rollback)
"""
# Legacy FastAPI implementation - keep for rollback if needed
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

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "gtm-associations-analyzer"}

@app.post("/analyze/associations", response_model=ModuleResult)
async def analyze_associations(request: Dict[str, Any]):
    # ... FastAPI implementation here ...
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
"""


if __name__ == "__main__":
    try:
        asyncio.run(serve())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)