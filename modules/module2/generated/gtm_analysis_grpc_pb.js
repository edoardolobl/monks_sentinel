// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// GTM Analysis Service Protocol Buffer Schema
// Version: 1.0.0
//
// This file defines the gRPC service interfaces and message types for the
// Monks Sentinel GTM Quality Assurance System.
//
// Service architecture:
// - GTMAnalysisService: Main orchestrator service
// - Module-specific services for different analysis types
// - Standardized request/response patterns
// - Health checking and service discovery support
//
// Design principles:
// - Language-agnostic service definitions
// - Standardized error handling and status reporting
// - Support for streaming and batch operations
// - Extensible for future analysis modules
//
'use strict';
var grpc = require('@grpc/grpc-js');
var gtm_analysis_pb = require('./gtm_analysis_pb.js');
var gtm_models_pb = require('./gtm_models_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_AnalysisRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.AnalysisRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.AnalysisRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_AnalysisRequest(buffer_arg) {
  return gtm_analysis_pb.AnalysisRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_AnalysisResponse(arg) {
  if (!(arg instanceof gtm_analysis_pb.AnalysisResponse)) {
    throw new Error('Expected argument of type gtm.analysis.v1.AnalysisResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_AnalysisResponse(buffer_arg) {
  return gtm_analysis_pb.AnalysisResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_AnalysisStatusRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.AnalysisStatusRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.AnalysisStatusRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_AnalysisStatusRequest(buffer_arg) {
  return gtm_analysis_pb.AnalysisStatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_AssociationsAnalysisRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.AssociationsAnalysisRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.AssociationsAnalysisRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_AssociationsAnalysisRequest(buffer_arg) {
  return gtm_analysis_pb.AssociationsAnalysisRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_FileUploadRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.FileUploadRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.FileUploadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_FileUploadRequest(buffer_arg) {
  return gtm_analysis_pb.FileUploadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_GovernanceAnalysisRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.GovernanceAnalysisRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.GovernanceAnalysisRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_GovernanceAnalysisRequest(buffer_arg) {
  return gtm_analysis_pb.GovernanceAnalysisRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_HTMLAnalysisRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.HTMLAnalysisRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.HTMLAnalysisRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_HTMLAnalysisRequest(buffer_arg) {
  return gtm_analysis_pb.HTMLAnalysisRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_HealthRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.HealthRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.HealthRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_HealthRequest(buffer_arg) {
  return gtm_analysis_pb.HealthRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_HealthResponse(arg) {
  if (!(arg instanceof gtm_analysis_pb.HealthResponse)) {
    throw new Error('Expected argument of type gtm.analysis.v1.HealthResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_HealthResponse(buffer_arg) {
  return gtm_analysis_pb.HealthResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_JavaScriptAnalysisRequest(arg) {
  if (!(arg instanceof gtm_analysis_pb.JavaScriptAnalysisRequest)) {
    throw new Error('Expected argument of type gtm.analysis.v1.JavaScriptAnalysisRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_JavaScriptAnalysisRequest(buffer_arg) {
  return gtm_analysis_pb.JavaScriptAnalysisRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_ListModulesResponse(arg) {
  if (!(arg instanceof gtm_analysis_pb.ListModulesResponse)) {
    throw new Error('Expected argument of type gtm.analysis.v1.ListModulesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_ListModulesResponse(buffer_arg) {
  return gtm_analysis_pb.ListModulesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gtm_analysis_v1_ModuleResult(arg) {
  if (!(arg instanceof gtm_analysis_pb.ModuleResult)) {
    throw new Error('Expected argument of type gtm.analysis.v1.ModuleResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gtm_analysis_v1_ModuleResult(buffer_arg) {
  return gtm_analysis_pb.ModuleResult.deserializeBinary(new Uint8Array(buffer_arg));
}


// ============================================================================
// Service Definitions
// ============================================================================
//
// Main GTM Analysis Service - Orchestrator
var GTMAnalysisServiceService = exports.GTMAnalysisServiceService = {
  // Perform comprehensive GTM analysis across all modules
analyzeContainer: {
    path: '/gtm.analysis.v1.GTMAnalysisService/AnalyzeContainer',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.AnalysisRequest,
    responseType: gtm_analysis_pb.AnalysisResponse,
    requestSerialize: serialize_gtm_analysis_v1_AnalysisRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_AnalysisRequest,
    responseSerialize: serialize_gtm_analysis_v1_AnalysisResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_AnalysisResponse,
  },
  // Upload GTM file and analyze with streaming file upload support
uploadAndAnalyze: {
    path: '/gtm.analysis.v1.GTMAnalysisService/UploadAndAnalyze',
    requestStream: true,
    responseStream: false,
    requestType: gtm_analysis_pb.FileUploadRequest,
    responseType: gtm_analysis_pb.AnalysisResponse,
    requestSerialize: serialize_gtm_analysis_v1_FileUploadRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_FileUploadRequest,
    responseSerialize: serialize_gtm_analysis_v1_AnalysisResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_AnalysisResponse,
  },
  // Stream analysis results as they become available
analyzeContainerStreaming: {
    path: '/gtm.analysis.v1.GTMAnalysisService/AnalyzeContainerStreaming',
    requestStream: false,
    responseStream: true,
    requestType: gtm_analysis_pb.AnalysisRequest,
    responseType: gtm_analysis_pb.ModuleResult,
    requestSerialize: serialize_gtm_analysis_v1_AnalysisRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_AnalysisRequest,
    responseSerialize: serialize_gtm_analysis_v1_ModuleResult,
    responseDeserialize: deserialize_gtm_analysis_v1_ModuleResult,
  },
  // Get analysis status for a request
getAnalysisStatus: {
    path: '/gtm.analysis.v1.GTMAnalysisService/GetAnalysisStatus',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.AnalysisStatusRequest,
    responseType: gtm_analysis_pb.AnalysisResponse,
    requestSerialize: serialize_gtm_analysis_v1_AnalysisStatusRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_AnalysisStatusRequest,
    responseSerialize: serialize_gtm_analysis_v1_AnalysisResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_AnalysisResponse,
  },
  // Health check
checkHealth: {
    path: '/gtm.analysis.v1.GTMAnalysisService/CheckHealth',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.HealthRequest,
    responseType: gtm_analysis_pb.HealthResponse,
    requestSerialize: serialize_gtm_analysis_v1_HealthRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_HealthRequest,
    responseSerialize: serialize_gtm_analysis_v1_HealthResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_HealthResponse,
  },
  // List available analysis modules
listModules: {
    path: '/gtm.analysis.v1.GTMAnalysisService/ListModules',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: gtm_analysis_pb.ListModulesResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_gtm_analysis_v1_ListModulesResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_ListModulesResponse,
  },
};

exports.GTMAnalysisServiceClient = grpc.makeGenericClientConstructor(GTMAnalysisServiceService, 'GTMAnalysisService');
// Module 1: Associations & Orphaned Elements Analysis Service
var AssociationsAnalysisServiceService = exports.AssociationsAnalysisServiceService = {
  // Analyze associations and find orphaned elements
analyzeAssociations: {
    path: '/gtm.analysis.v1.AssociationsAnalysisService/AnalyzeAssociations',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.AssociationsAnalysisRequest,
    responseType: gtm_analysis_pb.ModuleResult,
    requestSerialize: serialize_gtm_analysis_v1_AssociationsAnalysisRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_AssociationsAnalysisRequest,
    responseSerialize: serialize_gtm_analysis_v1_ModuleResult,
    responseDeserialize: deserialize_gtm_analysis_v1_ModuleResult,
  },
  // Health check
checkHealth: {
    path: '/gtm.analysis.v1.AssociationsAnalysisService/CheckHealth',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.HealthRequest,
    responseType: gtm_analysis_pb.HealthResponse,
    requestSerialize: serialize_gtm_analysis_v1_HealthRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_HealthRequest,
    responseSerialize: serialize_gtm_analysis_v1_HealthResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_HealthResponse,
  },
};

exports.AssociationsAnalysisServiceClient = grpc.makeGenericClientConstructor(AssociationsAnalysisServiceService, 'AssociationsAnalysisService');
// Module 2: Governance/Naming Conventions Analysis Service  
var GovernanceAnalysisServiceService = exports.GovernanceAnalysisServiceService = {
  // Analyze naming conventions and governance compliance
analyzeGovernance: {
    path: '/gtm.analysis.v1.GovernanceAnalysisService/AnalyzeGovernance',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.GovernanceAnalysisRequest,
    responseType: gtm_analysis_pb.ModuleResult,
    requestSerialize: serialize_gtm_analysis_v1_GovernanceAnalysisRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_GovernanceAnalysisRequest,
    responseSerialize: serialize_gtm_analysis_v1_ModuleResult,
    responseDeserialize: deserialize_gtm_analysis_v1_ModuleResult,
  },
  // Health check
checkHealth: {
    path: '/gtm.analysis.v1.GovernanceAnalysisService/CheckHealth',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.HealthRequest,
    responseType: gtm_analysis_pb.HealthResponse,
    requestSerialize: serialize_gtm_analysis_v1_HealthRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_HealthRequest,
    responseSerialize: serialize_gtm_analysis_v1_HealthResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_HealthResponse,
  },
};

exports.GovernanceAnalysisServiceClient = grpc.makeGenericClientConstructor(GovernanceAnalysisServiceService, 'GovernanceAnalysisService');
// Module 3: JavaScript Quality Assessment Service
var JavaScriptAnalysisServiceService = exports.JavaScriptAnalysisServiceService = {
  // Analyze JavaScript code quality and security
analyzeJavaScript: {
    path: '/gtm.analysis.v1.JavaScriptAnalysisService/AnalyzeJavaScript',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.JavaScriptAnalysisRequest,
    responseType: gtm_analysis_pb.ModuleResult,
    requestSerialize: serialize_gtm_analysis_v1_JavaScriptAnalysisRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_JavaScriptAnalysisRequest,
    responseSerialize: serialize_gtm_analysis_v1_ModuleResult,
    responseDeserialize: deserialize_gtm_analysis_v1_ModuleResult,
  },
  // Health check
checkHealth: {
    path: '/gtm.analysis.v1.JavaScriptAnalysisService/CheckHealth',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.HealthRequest,
    responseType: gtm_analysis_pb.HealthResponse,
    requestSerialize: serialize_gtm_analysis_v1_HealthRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_HealthRequest,
    responseSerialize: serialize_gtm_analysis_v1_HealthResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_HealthResponse,
  },
};

exports.JavaScriptAnalysisServiceClient = grpc.makeGenericClientConstructor(JavaScriptAnalysisServiceService, 'JavaScriptAnalysisService');
// Module 4: HTML Security Risk Analysis Service
var HTMLAnalysisServiceService = exports.HTMLAnalysisServiceService = {
  // Analyze HTML for security risks
analyzeHTML: {
    path: '/gtm.analysis.v1.HTMLAnalysisService/AnalyzeHTML',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.HTMLAnalysisRequest,
    responseType: gtm_analysis_pb.ModuleResult,
    requestSerialize: serialize_gtm_analysis_v1_HTMLAnalysisRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_HTMLAnalysisRequest,
    responseSerialize: serialize_gtm_analysis_v1_ModuleResult,
    responseDeserialize: deserialize_gtm_analysis_v1_ModuleResult,
  },
  // Health check
checkHealth: {
    path: '/gtm.analysis.v1.HTMLAnalysisService/CheckHealth',
    requestStream: false,
    responseStream: false,
    requestType: gtm_analysis_pb.HealthRequest,
    responseType: gtm_analysis_pb.HealthResponse,
    requestSerialize: serialize_gtm_analysis_v1_HealthRequest,
    requestDeserialize: deserialize_gtm_analysis_v1_HealthRequest,
    responseSerialize: serialize_gtm_analysis_v1_HealthResponse,
    responseDeserialize: deserialize_gtm_analysis_v1_HealthResponse,
  },
};

exports.HTMLAnalysisServiceClient = grpc.makeGenericClientConstructor(HTMLAnalysisServiceService, 'HTMLAnalysisService');
