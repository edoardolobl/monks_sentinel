"""
Core gRPC Orchestrator for GTM Container Quality Assurance System.

This gRPC server serves as the central hub for:
- Receiving GTM container uploads via streaming
- Parsing and validating GTM JSON structure
- Coordinating analysis across multiple test modules
- Aggregating and returning final reports
"""

import asyncio
import json
import logging
import os
import signal
import sys
import uuid
from concurrent import futures
from typing import Dict, List, AsyncIterator, Optional

import grpc
import grpc.aio as aio
from grpc import ServicerContext
from grpc_health.v1 import health_pb2_grpc
from grpc_health.v1.health_pb2 import HealthCheckResponse
from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp
from pydantic import ValidationError

# Add protobuf generated classes to path
sys.path.append('/Users/user/Desktop/gtm_project/proto/generated/python')

# Import generated protobuf classes
from gtm_analysis_pb2 import (
    AnalysisRequest,
    AnalysisResponse,
    AnalysisStatusRequest,
    FileUploadRequest,
    HealthRequest,
    HealthResponse,
    ListModulesResponse,
    ModuleResult as ModuleResultProto,
    TestIssue as TestIssueProto
)
from gtm_analysis_pb2_grpc import GTMAnalysisServiceServicer, add_GTMAnalysisServiceServicer_to_server
from gtm_models_pb2 import GTMContainer as GTMContainerProto

# Import gRPC client and data converters
from grpc_client import get_grpc_client, close_grpc_client
from data_converters import (
    dict_to_analysis_request,
    proto_to_module_result,
    create_error_analysis_response,
    pydantic_gtm_to_proto
)
from gtm_models import GTMContainer, ModuleResult, OrchestratorResponse
from data_extractors import (
    extract_associations_data,
    extract_governance_data,
    extract_javascript_data,
    extract_html_data
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Module registry - maps module names to their gRPC endpoints and data extractors
MODULE_REGISTRY = {
    "associations": {
        "grpc_target": os.getenv("ASSOCIATIONS_GRPC_TARGET", "localhost:50051"),
        "extractor": extract_associations_data,
    },
    "governance": {
        "grpc_target": os.getenv("GOVERNANCE_GRPC_TARGET", "localhost:50052"),
        "extractor": extract_governance_data,
    },
    "javascript": {
        "grpc_target": os.getenv("JAVASCRIPT_GRPC_TARGET", "localhost:50053"),
        "extractor": extract_javascript_data,
    },
    "html": {
        "grpc_target": os.getenv("HTML_GRPC_TARGET", "localhost:50054"),
        "extractor": extract_html_data,
    },
}

# In-memory storage for analysis results (use Redis/DB in production)
analysis_results: Dict[str, AnalysisResponse] = {}


class GTMAnalysisService(GTMAnalysisServiceServicer):
    """
    gRPC service implementation for GTM analysis orchestration.
    
    Provides comprehensive GTM container analysis with file upload streaming,
    status tracking, and module coordination.
    """

    def __init__(self):
        self.grpc_client = None

    async def AnalyzeContainer(
        self, 
        request: AnalysisRequest, 
        context: ServicerContext
    ) -> AnalysisResponse:
        """
        Perform comprehensive GTM analysis across all modules.
        
        Args:
            request: Analysis request with GTM container data
            context: gRPC service context
            
        Returns:
            Complete analysis response
        """
        request_id = request.request_id or str(uuid.uuid4())
        logger.info(f"Request {request_id}: Starting container analysis")
        
        try:
            # Convert protobuf GTM container to Pydantic model
            gtm_container = self._proto_to_pydantic_gtm(request.gtm_container)
            
            # Determine which modules to run
            modules_to_run = list(request.modules) if request.modules else list(MODULE_REGISTRY.keys())
            
            # Initialize response
            response = AnalysisResponse()
            response.request_id = request_id
            response.status = AnalysisResponse.Status.PROCESSING
            
            # Set container info
            if gtm_container.containerVersion and gtm_container.containerVersion.container:
                container = gtm_container.containerVersion.container
                response.container_info["name"] = container.name or ""
                response.container_info["publicId"] = container.publicId or ""
                response.container_info["accountId"] = container.accountId or ""
            if gtm_container.exportTime:
                response.container_info["exportTime"] = gtm_container.exportTime
            
            # Set start timestamp
            response.started_at.GetCurrentTime()
            
            # Store initial response
            analysis_results[request_id] = response
            
            # Run analysis modules
            await self._run_analysis_modules(request_id, gtm_container, modules_to_run)
            
            # Return final results
            return analysis_results[request_id]
            
        except ValidationError as e:
            logger.error(f"Request {request_id}: GTM validation error: {str(e)}")
            return self._create_error_response(request_id, f"Invalid GTM format: {str(e)}")
            
        except Exception as e:
            logger.error(f"Request {request_id}: Analysis error: {str(e)}")
            return self._create_error_response(request_id, f"Analysis failed: {str(e)}")

    async def UploadAndAnalyze(
        self, 
        request_iterator: AsyncIterator[FileUploadRequest], 
        context: ServicerContext
    ) -> AnalysisResponse:
        """
        Upload GTM file and analyze with streaming file upload support.
        
        Args:
            request_iterator: Stream of file upload requests
            context: gRPC service context
            
        Returns:
            Analysis response
        """
        request_id = str(uuid.uuid4())
        logger.info(f"Request {request_id}: Starting file upload and analysis")
        
        try:
            file_data = bytearray()
            metadata = None
            config = None
            
            async for upload_request in request_iterator:
                if upload_request.HasField("metadata"):
                    metadata = upload_request.metadata
                    request_id = metadata.request_id or request_id
                    logger.info(
                        f"Request {request_id}: Receiving file {metadata.filename} "
                        f"({metadata.file_size} bytes)"
                    )
                    
                elif upload_request.HasField("chunk_data"):
                    file_data.extend(upload_request.chunk_data)
                    logger.debug(f"Request {request_id}: Received {len(upload_request.chunk_data)} bytes")
                    
                elif upload_request.HasField("config"):
                    config = upload_request.config
                    logger.info(f"Request {request_id}: Analysis configuration received")
                    break
            
            if not metadata or not config:
                return self._create_error_response(request_id, "Incomplete upload request")
            
            # Parse GTM JSON data
            try:
                gtm_data = json.loads(file_data.decode('utf-8'))
                gtm_container = GTMContainer(**gtm_data)
            except (json.JSONDecodeError, ValidationError) as e:
                return self._create_error_response(request_id, f"Invalid GTM file: {str(e)}")
            
            # Create analysis request
            analysis_request = AnalysisRequest()
            analysis_request.request_id = request_id
            analysis_request.gtm_container.CopyFrom(pydantic_gtm_to_proto(gtm_container))
            analysis_request.modules[:] = config.selected_modules
            if config.options:
                analysis_request.options.CopyFrom(config.options)
            
            # Delegate to AnalyzeContainer
            return await self.AnalyzeContainer(analysis_request, context)
            
        except Exception as e:
            logger.error(f"Request {request_id}: Upload error: {str(e)}")
            return self._create_error_response(request_id, f"Upload failed: {str(e)}")

    async def AnalyzeContainerStreaming(
        self, 
        request: AnalysisRequest, 
        context: ServicerContext
    ) -> AsyncIterator[ModuleResultProto]:
        """
        Stream analysis results as they become available.
        
        Args:
            request: Analysis request
            context: gRPC service context
            
        Yields:
            Module results as they complete
        """
        request_id = request.request_id or str(uuid.uuid4())
        logger.info(f"Request {request_id}: Starting streaming analysis")
        
        try:
            gtm_container = self._proto_to_pydantic_gtm(request.gtm_container)
            modules_to_run = list(request.modules) if request.modules else list(MODULE_REGISTRY.keys())
            
            # Initialize gRPC client
            if not self.grpc_client:
                self.grpc_client = await get_grpc_client()
            
            # Run each module and stream results
            for module_name in modules_to_run:
                if module_name not in MODULE_REGISTRY:
                    continue
                
                try:
                    logger.info(f"Request {request_id}: Processing {module_name}")
                    
                    # Extract data and call module
                    module_config = MODULE_REGISTRY[module_name]
                    extractor = module_config["extractor"]
                    module_data = extractor(gtm_container)
                    
                    # Call gRPC service
                    result_dict = await self._call_module_via_grpc(
                        request_id, module_name, module_config, 
                        module_data, gtm_container
                    )
                    
                    # Convert to protobuf and yield
                    module_result = self._dict_to_module_result_proto(result_dict)
                    yield module_result
                    
                except Exception as e:
                    logger.error(f"Request {request_id}: {module_name} error: {str(e)}")
                    error_result = ModuleResultProto()
                    error_result.module = module_name
                    error_result.status = ModuleResultProto.Status.ERROR
                    error_result.error_message = str(e)
                    yield error_result
            
        except Exception as e:
            logger.error(f"Request {request_id}: Streaming analysis error: {str(e)}")
            error_result = ModuleResultProto()
            error_result.module = "orchestrator"
            error_result.status = ModuleResultProto.Status.ERROR
            error_result.error_message = str(e)
            yield error_result

    async def GetAnalysisStatus(
        self, 
        request: AnalysisStatusRequest, 
        context: ServicerContext
    ) -> AnalysisResponse:
        """
        Get analysis status for a request.
        
        Args:
            request: Status request with request ID
            context: gRPC service context
            
        Returns:
            Current analysis status
        """
        request_id = request.request_id
        
        if request_id not in analysis_results:
            return self._create_error_response(request_id, "Analysis request not found")
        
        return analysis_results[request_id]

    async def CheckHealth(
        self, 
        request: HealthRequest, 
        context: ServicerContext
    ) -> HealthResponse:
        """
        Health check endpoint.
        
        Args:
            request: Health check request
            context: gRPC service context
            
        Returns:
            Service health status
        """
        response = HealthResponse()
        response.status = HealthResponse.Status.SERVING
        response.message = "GTM Orchestrator is healthy"
        response.metadata["service"] = "gtm-orchestrator"
        response.metadata["version"] = "2.0.0"
        response.timestamp.GetCurrentTime()
        
        return response

    async def ListModules(
        self, 
        request: Empty, 
        context: ServicerContext
    ) -> ListModulesResponse:
        """
        List available analysis modules and their status.
        
        Args:
            request: Empty request
            context: gRPC service context
            
        Returns:
            List of available modules with health status
        """
        response = ListModulesResponse()
        
        # Initialize gRPC client for health checks
        if not self.grpc_client:
            self.grpc_client = await get_grpc_client()
        
        for module_name, module_config in MODULE_REGISTRY.items():
            module_info = response.modules.add()
            module_info.name = module_name
            module_info.version = "1.0.0"
            module_info.description = f"GTM {module_name.title()} Analysis Module"
            
            try:
                # Check module health
                target = module_config["grpc_target"]
                is_healthy = await self.grpc_client.health_check_service(module_name, target)
                module_info.available = is_healthy
                
                if is_healthy:
                    module_info.capabilities["status"] = "healthy"
                    module_info.capabilities["protocol"] = "grpc"
                    module_info.capabilities["endpoint"] = target
                else:
                    module_info.capabilities["status"] = "unhealthy"
                    
            except Exception as e:
                logger.warning(f"Health check failed for {module_name}: {str(e)}")
                module_info.available = False
                module_info.capabilities["status"] = "offline"
                module_info.capabilities["error"] = str(e)
        
        return response

    async def _run_analysis_modules(
        self, 
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
            
            # Initialize gRPC client
            if not self.grpc_client:
                self.grpc_client = await get_grpc_client()
            
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
                    
                    # Call via gRPC
                    result_dict = await self._call_module_via_grpc(
                        request_id, module_name, module_config, 
                        module_data, gtm_container
                    )
                    
                    # Convert to protobuf for storage
                    module_result_proto = self._dict_to_module_result_proto(result_dict)
                    results[module_name] = module_result_proto
                    
                    # Aggregate summary
                    for key, value in result_dict.get("summary", {}).items():
                        if key in total_summary and isinstance(value, (int, float)):
                            total_summary[key] += int(value)
                    
                    logger.info(f"Request {request_id}: {module_name} completed successfully")
                    
                except Exception as e:
                    logger.error(f"Request {request_id}: {module_name} error: {str(e)}")
                    error_result = ModuleResultProto()
                    error_result.module = module_name
                    error_result.status = ModuleResultProto.Status.ERROR
                    error_result.error_message = str(e)
                    results[module_name] = error_result
            
            # Update final results
            response = analysis_results[request_id]
            response.results.clear()
            for module_name, result in results.items():
                response.results[module_name].CopyFrom(result)
            
            for key, value in total_summary.items():
                response.summary[key] = value
                
            response.status = AnalysisResponse.Status.COMPLETED
            response.completed_at.GetCurrentTime()
            
            logger.info(f"Request {request_id}: Analysis completed with {total_summary['total_issues']} total issues")
            
        except Exception as e:
            logger.error(f"Request {request_id}: Fatal error in analysis: {str(e)}")
            response = analysis_results[request_id]
            response.status = AnalysisResponse.Status.FAILED
            response.error_message = str(e)
            response.completed_at.GetCurrentTime()

    async def _call_module_via_grpc(
        self,
        request_id: str,
        module_name: str,
        module_config: Dict,
        module_data: Dict,
        gtm_container: GTMContainer
    ) -> Dict:
        """Call analysis module via gRPC."""
        try:
            target = module_config["grpc_target"]
            logger.info(f"Request {request_id}: Calling {module_name} via gRPC at {target}")
            
            # Convert data to protobuf request
            request = dict_to_analysis_request(module_name, module_data, gtm_container)
            
            # Call gRPC service
            response = await self.grpc_client.call_analysis_service(
                module_name, target, request
            )
            
            if response:
                return proto_to_module_result(response)
            else:
                return create_error_analysis_response(module_name, "gRPC call failed")
                
        except Exception as e:
            logger.error(f"Request {request_id}: gRPC error for {module_name}: {str(e)}")
            return create_error_analysis_response(module_name, str(e))

    def _proto_to_pydantic_gtm(self, gtm_proto: GTMContainerProto) -> GTMContainer:
        """Convert protobuf GTMContainer to Pydantic model."""
        # Convert protobuf to dictionary first
        gtm_dict = {
            "exportFormatVersion": gtm_proto.export_format_version or "",
            "exportTime": gtm_proto.export_time or "",
            "containerVersion": {
                "container": {
                    "name": gtm_proto.container_version.container.name or "",
                    "publicId": gtm_proto.container_version.container.public_id or "",
                    "containerId": gtm_proto.container_version.container.container_id or "",
                    "accountId": gtm_proto.container_version.container.account_id or ""
                },
                "tag": [],
                "trigger": [],
                "variable": []
            }
        }
        
        # Convert tags, triggers, variables (basic conversion)
        for tag_proto in gtm_proto.container_version.tag:
            tag_dict = {
                "tagId": tag_proto.tag_id,
                "name": tag_proto.name,
                "type": tag_proto.type,
                "parameter": [{"key": p.key, "value": p.value} for p in tag_proto.parameter],
                "firingTriggerId": list(tag_proto.firing_trigger_id),
                "blockingTriggerId": list(tag_proto.blocking_trigger_id)
            }
            gtm_dict["containerVersion"]["tag"].append(tag_dict)
        
        return GTMContainer(**gtm_dict)

    def _dict_to_module_result_proto(self, result_dict: Dict) -> ModuleResultProto:
        """Convert result dictionary to protobuf ModuleResult."""
        result_proto = ModuleResultProto()
        result_proto.module = result_dict.get("module", "")
        
        # Convert status
        status_map = {
            "completed": ModuleResultProto.Status.SUCCESS,
            "error": ModuleResultProto.Status.ERROR,
            "partial": ModuleResultProto.Status.PARTIAL
        }
        result_proto.status = status_map.get(result_dict.get("status", ""), ModuleResultProto.Status.STATUS_UNSPECIFIED)
        
        # Convert issues
        for issue_dict in result_dict.get("issues", []):
            issue_proto = result_proto.issues.add()
            issue_proto.type = issue_dict.get("type", "")
            issue_proto.message = issue_dict.get("message", "")
            issue_proto.recommendation = issue_dict.get("recommendation", "")
            
            # Convert severity
            severity_map = {
                "low": TestIssueProto.Severity.LOW,
                "medium": TestIssueProto.Severity.MEDIUM,
                "high": TestIssueProto.Severity.HIGH,
                "critical": TestIssueProto.Severity.CRITICAL
            }
            issue_proto.severity = severity_map.get(issue_dict.get("severity", ""), TestIssueProto.Severity.SEVERITY_UNSPECIFIED)
            
            # Convert element
            for key, value in issue_dict.get("element", {}).items():
                issue_proto.element[key] = str(value)
        
        # Convert summary
        for key, value in result_dict.get("summary", {}).items():
            if isinstance(value, (int, float)):
                result_proto.summary[key] = int(value)
        
        return result_proto

    def _create_error_response(self, request_id: str, error_message: str) -> AnalysisResponse:
        """Create error response."""
        response = AnalysisResponse()
        response.request_id = request_id
        response.status = AnalysisResponse.Status.FAILED
        response.error_message = error_message
        response.started_at.GetCurrentTime()
        response.completed_at.GetCurrentTime()
        return response


async def serve():
    """Start the gRPC server."""
    # Create gRPC server
    server = aio.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Add GTM Analysis service
    gtm_service = GTMAnalysisService()
    add_GTMAnalysisServiceServicer_to_server(gtm_service, server)
    
    # Configure server address
    listen_addr = f"0.0.0.0:{os.getenv('GRPC_PORT', '8080')}"
    server.add_insecure_port(listen_addr)
    
    # Start server
    logger.info(f"Starting GTM Analysis gRPC Server on {listen_addr}")
    await server.start()
    
    # Handle graceful shutdown
    def signal_handler(signum, frame):
        logger.info("Received shutdown signal")
        asyncio.create_task(server.stop(grace=5.0))
    
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        await server.wait_for_termination()
    except KeyboardInterrupt:
        logger.info("Server interrupted")
    finally:
        await close_grpc_client()
        logger.info("Server shutdown complete")


if __name__ == "__main__":
    try:
        asyncio.run(serve())
    except KeyboardInterrupt:
        logger.info("Server terminated by user")