"""
gRPC Client Module for GTM Quality Assurance System.

This module provides async gRPC client functionality with connection pooling,
health checking, and proper error handling for communicating with analysis modules.
"""

import asyncio
import logging
import os
from typing import Dict, List, Optional, Union
from contextlib import asynccontextmanager

import grpc
import grpc.aio as aio
from grpc import StatusCode
from grpc_status import rpc_status
from google.protobuf.empty_pb2 import Empty

# Import generated protobuf classes
import sys
sys.path.append('/Users/user/Desktop/gtm_project/generated/python')

from gtm_analysis_pb2 import (
    AnalysisRequest,
    AnalysisResponse,
    HealthRequest,
    HealthResponse,
    ModuleResult
)
from gtm_analysis_pb2_grpc import (
    GTMAnalysisServiceStub,
    AssociationsAnalysisServiceStub,
    GovernanceAnalysisServiceStub,
    JavaScriptAnalysisServiceStub,
    HTMLAnalysisServiceStub
)
from gtm_models_pb2 import GTMContainer as GTMContainerProto


logger = logging.getLogger(__name__)


class GRPCConnectionPool:
    """
    Connection pool for gRPC channels with health checking and retry logic.
    
    Maintains persistent connections to analysis services and provides
    automatic reconnection and load balancing.
    """
    
    def __init__(self):
        self._channels: Dict[str, aio.Channel] = {}
        self._stubs: Dict[str, Union[
            GTMAnalysisServiceStub,
            AssociationsAnalysisServiceStub,
            GovernanceAnalysisServiceStub,
            JavascriptAnalysisServiceStub,
            HTMLAnalysisServiceStub
        ]] = {}
        self._health_check_interval = 30  # seconds
        self._max_retries = 3
        self._timeout = 30.0
        
    async def get_channel(self, service_name: str, target: str) -> aio.Channel:
        """
        Get or create a gRPC channel for the specified service.
        
        Args:
            service_name: Name of the service (e.g., "associations")
            target: gRPC target address (e.g., "localhost:50051")
            
        Returns:
            Configured gRPC channel
        """
        channel_key = f"{service_name}_{target}"
        
        if channel_key not in self._channels:
            logger.info(f"Creating new gRPC channel for {service_name} at {target}")
            
            # Configure channel options for optimal performance
            options = [
                ('grpc.keepalive_time_ms', 10000),
                ('grpc.keepalive_timeout_ms', 5000),
                ('grpc.keepalive_permit_without_calls', True),
                ('grpc.http2.max_pings_without_data', 0),
                ('grpc.http2.min_time_between_pings_ms', 10000),
                ('grpc.http2.min_ping_interval_without_data_ms', 300000),
                # Connection pooling - different channel args to prevent reuse
                ('grpc.channel_id', channel_key),
            ]
            
            # Create insecure channel (use secure_channel in production)
            self._channels[channel_key] = aio.insecure_channel(target, options=options)
            
        return self._channels[channel_key]
    
    async def get_stub(self, service_name: str, target: str):
        """
        Get or create a gRPC stub for the specified service.
        
        Args:
            service_name: Name of the service
            target: gRPC target address
            
        Returns:
            Configured service stub
        """
        stub_key = f"{service_name}_{target}"
        
        if stub_key not in self._stubs:
            channel = await self.get_channel(service_name, target)
            
            # Create appropriate stub based on service name
            if service_name == "orchestrator":
                self._stubs[stub_key] = GTMAnalysisServiceStub(channel)
            elif service_name == "associations":
                self._stubs[stub_key] = AssociationsAnalysisServiceStub(channel)
            elif service_name == "governance":
                self._stubs[stub_key] = GovernanceAnalysisServiceStub(channel)
            elif service_name == "javascript":
                self._stubs[stub_key] = JavaScriptAnalysisServiceStub(channel)
            elif service_name == "html":
                self._stubs[stub_key] = HTMLAnalysisServiceStub(channel)
            else:
                raise ValueError(f"Unknown service name: {service_name}")
                
            logger.info(f"Created gRPC stub for {service_name}")
            
        return self._stubs[stub_key]
    
    async def health_check(self, service_name: str, target: str) -> bool:
        """
        Perform health check on a gRPC service.
        
        Args:
            service_name: Name of the service
            target: gRPC target address
            
        Returns:
            True if service is healthy, False otherwise
        """
        try:
            stub = await self.get_stub(service_name, target)
            
            # Create health check request
            request = HealthRequest(service=service_name)
            
            # Call health check with timeout
            response = await stub.CheckHealth(request, timeout=5.0)
            
            return response.status == HealthResponse.Status.SERVING
            
        except grpc.RpcError as e:
            logger.warning(f"Health check failed for {service_name} at {target}: {e.code()}")
            return False
        except Exception as e:
            logger.error(f"Health check error for {service_name}: {str(e)}")
            return False
    
    async def close_all(self):
        """Close all channels and cleanup resources."""
        logger.info("Closing all gRPC channels")
        
        for channel_key, channel in self._channels.items():
            try:
                await channel.close()
            except Exception as e:
                logger.error(f"Error closing channel {channel_key}: {str(e)}")
        
        self._channels.clear()
        self._stubs.clear()


class GRPCClient:
    """
    Main gRPC client for GTM analysis services.
    
    Provides high-level interface for calling analysis modules via gRPC
    with automatic retry, error handling, and connection management.
    """
    
    def __init__(self):
        self._pool = GRPCConnectionPool()
        
    async def call_analysis_service(
        self,
        service_name: str,
        target: str,
        request: AnalysisRequest,
        retries: int = 3
    ) -> Optional[AnalysisResponse]:
        """
        Call an analysis service via gRPC.
        
        Args:
            service_name: Name of the service to call
            target: gRPC target address
            request: Analysis request protobuf message
            retries: Number of retry attempts
            
        Returns:
            Analysis response or None if failed
        """
        last_error = None
        
        for attempt in range(retries + 1):
            try:
                logger.info(f"Calling {service_name} service (attempt {attempt + 1}/{retries + 1})")
                
                stub = await self._pool.get_stub(service_name, target)
                
                # Call the appropriate analysis method based on service
                if service_name == "associations":
                    response = await stub.AnalyzeAssociations(request, timeout=30.0)
                elif service_name == "governance":
                    response = await stub.AnalyzeGovernance(request, timeout=30.0)
                elif service_name == "javascript":
                    response = await stub.AnalyzeJavaScript(request, timeout=30.0)
                elif service_name == "html":
                    response = await stub.AnalyzeHTML(request, timeout=30.0)
                else:
                    response = await stub.AnalyzeContainer(request, timeout=30.0)
                
                logger.info(f"Successfully called {service_name} service")
                return response
                
            except grpc.RpcError as e:
                last_error = e
                status_code = e.code()
                
                logger.warning(
                    f"gRPC error calling {service_name} (attempt {attempt + 1}): "
                    f"{status_code} - {e.details()}"
                )
                
                # Don't retry on certain error codes
                if status_code in [StatusCode.INVALID_ARGUMENT, StatusCode.NOT_FOUND]:
                    break
                    
                # Wait before retry (exponential backoff)
                if attempt < retries:
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)
                    
            except Exception as e:
                last_error = e
                logger.error(f"Unexpected error calling {service_name}: {str(e)}")
                
                if attempt < retries:
                    await asyncio.sleep(2)
        
        logger.error(f"Failed to call {service_name} after {retries + 1} attempts: {last_error}")
        return None
    
    async def health_check_service(self, service_name: str, target: str) -> bool:
        """
        Check if a service is healthy.
        
        Args:
            service_name: Name of the service
            target: gRPC target address
            
        Returns:
            True if service is healthy
        """
        return await self._pool.health_check(service_name, target)
    
    async def close(self):
        """Close all connections and cleanup resources."""
        await self._pool.close_all()


# Global gRPC client instance (singleton pattern)
_grpc_client: Optional[GRPCClient] = None


async def get_grpc_client() -> GRPCClient:
    """Get the global gRPC client instance."""
    global _grpc_client
    if _grpc_client is None:
        _grpc_client = GRPCClient()
    return _grpc_client


async def close_grpc_client():
    """Close the global gRPC client instance."""
    global _grpc_client
    if _grpc_client is not None:
        await _grpc_client.close()
        _grpc_client = None


@asynccontextmanager
async def grpc_client_context():
    """
    Context manager for gRPC client lifecycle.
    
    Usage:
        async with grpc_client_context() as client:
            response = await client.call_analysis_service(...)
    """
    client = await get_grpc_client()
    try:
        yield client
    finally:
        pass  # Keep connection alive for reuse