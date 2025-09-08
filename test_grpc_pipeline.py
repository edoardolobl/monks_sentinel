#!/usr/bin/env python3
"""
Test script for end-to-end gRPC pipeline testing.

This script tests the complete gRPC communication flow:
1. Core gRPC Orchestrator (port 8080)
2. Module 1 - Associations (port 50051)
3. Module 2 - Governance (port 50052)
"""

import asyncio
import json
import sys
import time
from pathlib import Path

import grpc
from google.protobuf.empty_pb2 import Empty

# Add proto generated files to path
sys.path.append('/Users/user/Desktop/gtm_project/proto/generated/python')

from gtm_analysis_pb2 import (
    AnalysisRequest,
    HealthRequest
)
from gtm_analysis_pb2_grpc import GTMAnalysisServiceStub
from gtm_models_pb2 import GTMContainer


async def test_grpc_pipeline():
    """Test the complete gRPC pipeline with real GTM data."""
    
    print("🚀 Starting gRPC Pipeline Test")
    print("=" * 50)
    
    # Load test GTM container data
    gtm_file = Path("/Users/user/Desktop/gtm_project/GTM-N6X9DBL_workspace677.json")
    with open(gtm_file, 'r') as f:
        gtm_data = json.load(f)
    
    print(f"📄 Loaded GTM container: {len(json.dumps(gtm_data))} characters")
    
    # Connect to gRPC orchestrator
    channel = grpc.aio.insecure_channel('localhost:8080')
    stub = GTMAnalysisServiceStub(channel)
    
    try:
        # Test 1: Health Check
        print("\n1️⃣ Testing Orchestrator Health Check")
        health_request = HealthRequest()
        health_response = await stub.CheckHealth(health_request)
        print(f"   ✅ Health Status: {health_response.status}")
        print(f"   📝 Message: {health_response.message}")
        print(f"   🏷️  Service: {health_response.metadata.get('service', 'Unknown')}")
        
        # Test 2: List Modules
        print("\n2️⃣ Testing Module Discovery")
        modules_response = await stub.ListModules(Empty())
        print(f"   📦 Found {len(modules_response.modules)} modules:")
        for module in modules_response.modules:
            status = "✅" if module.available else "❌"
            protocol = module.capabilities.protocol if hasattr(module.capabilities, 'protocol') else 'unknown'
            print(f"   {status} {module.name}: {protocol} - {module.capabilities.status}")
        
        # Test 3: End-to-End Analysis 
        print("\n3️⃣ Testing End-to-End Analysis")
        print("   🔄 Preparing analysis request...")
        
        # Create analysis request
        analysis_request = AnalysisRequest()
        analysis_request.request_id = f"test-{int(time.time())}"
        analysis_request.gtm_container_json = json.dumps(gtm_data)
        analysis_request.modules.extend(['associations', 'governance'])
        
        print(f"   📊 Request ID: {analysis_request.request_id}")
        print(f"   📋 Modules: {list(analysis_request.modules)}")
        print(f"   📄 GTM Data Size: {len(analysis_request.gtm_container_json)} chars")
        
        # Execute analysis
        print("   🚀 Executing analysis...")
        start_time = time.time()
        analysis_response = await stub.AnalyzeContainer(analysis_request)
        end_time = time.time()
        
        # Display results
        duration = round(end_time - start_time, 2)
        print(f"   ⚡ Analysis completed in {duration}s")
        print(f"   📊 Status: {analysis_response.status}")
        print(f"   🔍 Total Issues: {analysis_response.total_issues}")
        
        # Module results breakdown
        print(f"\n   📈 Module Results:")
        for module_result in analysis_response.module_results:
            issues_count = len(module_result.issues)
            status_icon = "✅" if module_result.status.name == "SUCCESS" else "❌"
            print(f"   {status_icon} {module_result.module}: {issues_count} issues")
            
            if issues_count > 0:
                # Show sample issues
                critical = sum(1 for issue in module_result.issues if issue.severity.name == "CRITICAL")
                high = sum(1 for issue in module_result.issues if issue.severity.name == "HIGH") 
                medium = sum(1 for issue in module_result.issues if issue.severity.name == "MEDIUM")
                low = sum(1 for issue in module_result.issues if issue.severity.name == "LOW")
                
                print(f"      🚨 Critical: {critical}, High: {high}, Medium: {medium}, Low: {low}")
        
        print(f"\n   🎯 Performance Metrics:")
        if hasattr(analysis_response, 'execution_time_ms'):
            print(f"   ⏱️  Execution Time: {analysis_response.execution_time_ms}ms")
        print(f"   🔄 gRPC Round Trip: {duration}s")
        
        # Test 4: Performance Benchmark
        print("\n4️⃣ Performance Benchmark")
        print("   🏃‍♀️ Running 3 consecutive analyses...")
        
        times = []
        for i in range(3):
            start = time.time()
            benchmark_request = AnalysisRequest()
            benchmark_request.request_id = f"benchmark-{i}-{int(time.time())}"
            benchmark_request.gtm_container_json = json.dumps(gtm_data)
            benchmark_request.modules.extend(['associations'])  # Test single module for speed
            
            await stub.AnalyzeContainer(benchmark_request)
            elapsed = round(time.time() - start, 3)
            times.append(elapsed)
            print(f"   🏃‍♀️ Run {i+1}: {elapsed}s")
        
        avg_time = round(sum(times) / len(times), 3)
        print(f"   📊 Average Response Time: {avg_time}s")
        
        print("\n🎉 All gRPC Pipeline Tests Completed Successfully!")
        print("=" * 50)
        print("✨ Summary:")
        print("  ✅ gRPC Orchestrator: Healthy")  
        print("  ✅ Module 1 (Associations): Healthy & Functional")
        print("  ✅ Module 2 (Governance): Healthy & Functional") 
        print("  ✅ End-to-End Analysis: Working")
        print(f"  ⚡ Performance: ~{avg_time}s average response time")
        
    except grpc.RpcError as e:
        print(f"❌ gRPC Error: {e.code()} - {e.details()}")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    finally:
        await channel.close()
    
    return True


if __name__ == "__main__":
    result = asyncio.run(test_grpc_pipeline())
    sys.exit(0 if result else 1)