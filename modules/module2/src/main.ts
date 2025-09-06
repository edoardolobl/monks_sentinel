/**
 * Fastify application for GTM governance and documentation analysis.
 * 
 * A TypeScript microservice that receives plain JSON data from the API Gateway
 * and returns governance analysis results. With the API Gateway pattern, this module
 * no longer needs complex GTM schema validation and works with simplified data structures.
 * 
 * Runs on port 8002 to integrate with the Core Orchestrator.
 */

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { ModuleResultSchema, ModuleResult, AnalysisRequest } from './models';
import { GovernanceAnalyzer } from './governanceAnalyzer';

// Initialize Fastify with logger configuration
const fastify: FastifyInstance = Fastify({
  logger: process.env.NODE_ENV !== 'production' ? {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  } : {
    level: process.env.LOG_LEVEL || 'info',
  },
  ajv: {
    customOptions: {
      strict: 'log',
      keywords: ['kind', 'modifier'],
    },
  },
});

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  // Return standardized error format matching Python module
  const errorResponse: ModuleResult = {
    module: 'governance',
    status: 'error',
    issues: [],
    summary: { error: error.message },
  };
  
  reply.status(500).send(errorResponse);
});

// Register CORS plugin
fastify.register(cors, {
  origin: true, // Configure appropriately for production
  credentials: true,
  methods: ['GET', 'POST'],
});

// Health check endpoint - matches Python module pattern
fastify.get('/health', async (request, reply) => {
  return {
    status: 'healthy',
    service: 'gtm-governance-analyzer',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };
});

// Main analysis endpoint - matches Python module pattern
fastify.post<{
  Body: any; // Plain JSON from API Gateway
  Reply: ModuleResult;
}>('/analyze/governance', {
  schema: {
    body: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: { type: 'object' },
        },
        triggers: {
          type: 'array',
          items: { type: 'object' },
        },
        variables: {
          type: 'array',
          items: { type: 'object' },
        },
        builtin_variables: {
          type: 'array',
          items: { type: 'object' },
        },
        folders: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['tags', 'triggers', 'variables'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          module: { type: 'string' },
          status: { type: 'string' },
          issues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                severity: { type: 'string' },
                element: { type: 'object' },
                message: { type: 'string' },
                recommendation: { type: 'string' }
              },
              required: ['type', 'severity', 'element', 'message', 'recommendation']
            },
          },
          summary: { type: 'object' },
        },
      },
    },
  },
}, async (request, reply) => {
  try {
    fastify.log.info('Starting governance analysis');
    
    // Basic validation - Fastify schema already validates the structure
    // Type assertion since Fastify schema validates the structure
    const analysisRequest = request.body as AnalysisRequest;

    // Initialize analyzer with validated request data
    const analyzer = new GovernanceAnalyzer(analysisRequest, fastify.log);
    
    // Run governance analysis and get standardized results
    const issues = analyzer.analyzeAll();
    
    // Ensure proper serialization by explicitly creating plain objects
    const serializedIssues = issues.map(issue => ({
      type: issue.type,
      severity: issue.severity,
      element: issue.element,
      message: issue.message,
      recommendation: issue.recommendation
    }));
    
    // Calculate summary statistics matching Python module pattern
    const summary = {
      total_issues: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
    };

    fastify.log.info(
      `Governance analysis completed: ${analysisRequest.tags.length} tags, ` +
      `${analysisRequest.triggers.length} triggers, ${analysisRequest.variables.length} variables analyzed`
    );

    const response: ModuleResult = {
      module: 'governance',
      status: 'success',
      issues: serializedIssues,
      summary,
    };

    return reply.send(response);

  } catch (error) {
    fastify.log.error(`Analysis error: ${error instanceof Error ? error.message : String(error)}`);
    
    const errorResponse: ModuleResult = {
      module: 'governance',
      status: 'error',
      issues: [],
      summary: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
    
    return reply.status(500).send(errorResponse);
  }
});

// Extended analysis endpoint for detailed results (optional - for debugging)
fastify.post<{
  Body: any; // Plain JSON from API Gateway
}>('/analyze/governance/detailed', async (request, reply) => {
  try {
    // Basic validation - similar to main endpoint
    // Fastify will handle basic structure validation
    
    const analyzer = new GovernanceAnalyzer(request.body as AnalysisRequest, fastify.log);
    const detailedResult = analyzer.analyzeGovernance();
    
    return reply.send(detailedResult);
    
  } catch (error) {
    fastify.log.error(`Detailed analysis error: ${error instanceof Error ? error.message : String(error)}`);
    return reply.status(500).send({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully`);
  try {
    await fastify.close();
    process.exit(0);
  } catch (error) {
    fastify.log.error(`Error during shutdown: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const start = async (): Promise<void> => {
  try {
    const port = parseInt(process.env.PORT || '8002', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`GTM Governance Analyzer running on http://${host}:${port}`);
    
  } catch (error) {
    fastify.log.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export default fastify;