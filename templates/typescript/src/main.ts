/**
 * gRPC Server for GTM {MODULE_NAME} analysis.
 * 
 * A TypeScript microservice template that implements a GTM analysis service
 * using gRPC protocol for high-performance, language-agnostic communication.
 * 
 * Template placeholders:
 * - {MODULE_NAME}: Module name (e.g., "governance", "javascript", "security")
 * - {SERVICE_NAME}: Service class name (e.g., "JavascriptAnalysisService")
 * - {ANALYZER_CLASS}: Analyzer class name (e.g., "JavascriptAnalyzer")
 * - {REQUEST_TYPE}: gRPC request type (e.g., "JavascriptAnalysisRequest")
 * - {PORT}: gRPC server port (e.g., 50052, 50053, 50054)
 */

import * as grpc from '@grpc/grpc-js';
import * as winston from 'winston';
import { {SERVICE_NAME}Service, I{SERVICE_NAME}Server } from '../generated/gtm_analysis_grpc_pb';
import * as gtm_analysis_pb from '../generated/gtm_analysis_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import { {ANALYZER_CLASS} } from './{MODULE_NAME}Analyzer';
import { AnalysisRequest, TestIssue } from './models';

// Configure Winston logger for gRPC server
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV !== 'production' 
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : winston.format.json(),
    }),
  ],
});

// Helper function to convert internal AnalysisRequest to gRPC message types
function convertToInternalRequest(grpcRequest: gtm_analysis_pb.{REQUEST_TYPE}): AnalysisRequest {
  // TODO: Customize this conversion based on your specific request structure
  // This is a template - modify according to your {REQUEST_TYPE} fields
  return {
    // Example conversions - replace with your actual fields:
    // tags: grpcRequest.getTagsList().map(tag => ({
    //   id: tag.getId(),
    //   name: tag.getName(),
    //   type: tag.getType(),
    // })),
    // Add your specific field conversions here
  } as AnalysisRequest;
}

// Helper function to convert internal issues to gRPC TestIssue messages
function convertToGrpcTestIssue(issue: TestIssue): gtm_analysis_pb.TestIssue {
  const grpcIssue = new gtm_analysis_pb.TestIssue();
  grpcIssue.setType(issue.type);
  
  // Convert severity string to enum
  switch (issue.severity) {
    case 'critical':
      grpcIssue.setSeverity(gtm_analysis_pb.TestIssue.Severity.CRITICAL);
      break;
    case 'high':
      grpcIssue.setSeverity(gtm_analysis_pb.TestIssue.Severity.HIGH);
      break;
    case 'medium':
      grpcIssue.setSeverity(gtm_analysis_pb.TestIssue.Severity.MEDIUM);
      break;
    case 'low':
      grpcIssue.setSeverity(gtm_analysis_pb.TestIssue.Severity.LOW);
      break;
    default:
      grpcIssue.setSeverity(gtm_analysis_pb.TestIssue.Severity.SEVERITY_UNSPECIFIED);
  }
  
  // Convert element object to map
  const elementMap = grpcIssue.getElementMap();
  Object.entries(issue.element || {}).forEach(([key, value]) => {
    elementMap.set(key, String(value));
  });
  
  grpcIssue.setMessage(issue.message || '');
  grpcIssue.setRecommendation(issue.recommendation || '');
  grpcIssue.setModule('{MODULE_NAME}');
  
  const timestamp = new google_protobuf_timestamp_pb.Timestamp();
  const now = new Date();
  timestamp.setSeconds(Math.floor(now.getTime() / 1000));
  timestamp.setNanos((now.getTime() % 1000) * 1000000);
  grpcIssue.setDetectedAt(timestamp);
  
  return grpcIssue;
}

// Implement the {SERVICE_NAME} server
class {SERVICE_NAME}ServiceImpl implements I{SERVICE_NAME}Server {
  // Index signature to satisfy the gRPC interface
  [method: string]: any;

  // Health check implementation
  checkHealth: grpc.handleUnaryCall<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse> = (
    call,
    callback
  ) => {
    logger.info('Health check requested');
    
    const response = new gtm_analysis_pb.HealthResponse();
    response.setStatus(gtm_analysis_pb.HealthResponse.Status.SERVING);
    response.setMessage('GTM {MODULE_NAME.title()} Analyzer is healthy');
    
    const metadataMap = response.getMetadataMap();
    metadataMap.set('service', 'gtm-{MODULE_NAME}-analyzer');
    metadataMap.set('version', '1.0.0');
    metadataMap.set('module', '{MODULE_NAME}');
    
    const timestamp = new google_protobuf_timestamp_pb.Timestamp();
    const now = new Date();
    timestamp.setSeconds(Math.floor(now.getTime() / 1000));
    timestamp.setNanos((now.getTime() % 1000) * 1000000);
    response.setTimestamp(timestamp);
    
    callback(null, response);
  };

  // Main analysis implementation
  analyze{MODULE_NAME.charAt(0).toUpperCase() + MODULE_NAME.slice(1)}: grpc.handleUnaryCall<gtm_analysis_pb.{REQUEST_TYPE}, gtm_analysis_pb.ModuleResult> = (
    call,
    callback
  ) => {
    try {
      logger.info('Starting {MODULE_NAME} analysis via gRPC');
      
      // Convert gRPC request to internal format
      const analysisRequest = convertToInternalRequest(call.request);
      
      // Initialize analyzer with converted request data
      const analyzer = new {ANALYZER_CLASS}(analysisRequest, logger);
      
      // Run analysis and get standardized results
      const issues = analyzer.analyzeAll();
      
      // Convert issues to gRPC format
      const grpcIssues = issues.map(issue => convertToGrpcTestIssue(issue));
      
      // Calculate summary statistics
      const summary = {
        total_issues: issues.length,
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
      };
      
      // Create gRPC response
      const response = new gtm_analysis_pb.ModuleResult();
      response.setModule('{MODULE_NAME}');
      response.setStatus(gtm_analysis_pb.ModuleResult.Status.SUCCESS);
      response.setIssuesList(grpcIssues);
      
      // Set summary as map
      const summaryMap = response.getSummaryMap();
      Object.entries(summary).forEach(([key, value]) => {
        summaryMap.set(key, Number(value));
      });
      
      // Set timestamps
      const now = new Date();
      const timestamp = new google_protobuf_timestamp_pb.Timestamp();
      timestamp.setSeconds(Math.floor(now.getTime() / 1000));
      timestamp.setNanos((now.getTime() % 1000) * 1000000);
      
      response.setStartedAt(timestamp);
      response.setCompletedAt(timestamp);
      
      logger.info(
        `{MODULE_NAME.title()} analysis completed: ${issues.length} issues found`
      );
      
      callback(null, response);
      
    } catch (error) {
      logger.error(`Analysis error: ${error instanceof Error ? error.message : String(error)}`);
      
      // Create error response
      const response = new gtm_analysis_pb.ModuleResult();
      response.setModule('{MODULE_NAME}');
      response.setStatus(gtm_analysis_pb.ModuleResult.Status.ERROR);
      response.setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      response.setIssuesList([]);
      
      const summaryMap = response.getSummaryMap();
      summaryMap.set('total_errors', 1);
      
      const timestamp = new google_protobuf_timestamp_pb.Timestamp();
      const now = new Date();
      timestamp.setSeconds(Math.floor(now.getTime() / 1000));
      timestamp.setNanos((now.getTime() % 1000) * 1000000);
      response.setStartedAt(timestamp);
      response.setCompletedAt(timestamp);
      
      callback(null, response); // Still return success to gRPC, but with error status in the message
    }
  };
}

// Create gRPC server instance
function createServer(): grpc.Server {
  const server = new grpc.Server();
  
  // Add the {SERVICE_NAME} implementation
  server.addService({SERVICE_NAME}Service, new {SERVICE_NAME}ServiceImpl());
  
  return server;
}

// Graceful shutdown handler for gRPC server
const gracefulShutdown = async (signal: string, server: grpc.Server) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  
  return new Promise<void>((resolve, reject) => {
    server.tryShutdown((error) => {
      if (error) {
        logger.error(`Error during shutdown: ${error.message}`);
        reject(error);
      } else {
        logger.info('gRPC server shut down successfully');
        resolve();
      }
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.warn('Force shutting down server');
      server.forceShutdown();
      resolve();
    }, 10000);
  });
};

// Start gRPC server
const start = async (): Promise<void> => {
  try {
    const server = createServer();
    const port = parseInt(process.env.PORT || '{PORT}', 10);
    const host = process.env.HOST || '0.0.0.0';
    const address = `${host}:${port}`;
    
    // Bind server to address with insecure credentials
    server.bindAsync(
      address,
      grpc.ServerCredentials.createInsecure(),
      (error, boundPort) => {
        if (error) {
          logger.error(`Failed to bind server: ${error.message}`);
          process.exit(1);
        }
        
        logger.info(`GTM {MODULE_NAME.title()} Analyzer gRPC server running on ${address} (port: ${boundPort})`);
        server.start();
      }
    );
    
    // Handle shutdown signals
    process.on('SIGTERM', async () => {
      try {
        await gracefulShutdown('SIGTERM', server);
        process.exit(0);
      } catch (error) {
        process.exit(1);
      }
    });
    
    process.on('SIGINT', async () => {
      try {
        await gracefulShutdown('SIGINT', server);
        process.exit(0);
      } catch (error) {
        process.exit(1);
      }
    });
    
  } catch (error) {
    logger.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export default createServer;