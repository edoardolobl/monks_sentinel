/**
 * TypeScript models for GTM analysis modules.
 * 
 * This template provides standardized data models for GTM analysis results.
 * These models ensure consistency across all analysis modules and provide
 * type safety for TypeScript implementations.
 * 
 * Template placeholders:
 * - {MODULE_NAME}: Module name for analyzer interfaces
 */

// Core data structures for analysis
export interface TestIssue {
  type: string;                    // Issue type identifier
  severity: 'critical' | 'high' | 'medium' | 'low'; // Issue severity level
  element: Record<string, any>;    // GTM element with the issue
  message: string;                 // Human-readable description of the issue
  recommendation: string;          // How to fix the issue
  module: string;                  // Module that detected the issue
  detectedAt?: Date;              // When the issue was detected
}

export interface ModuleResult {
  module: string;                  // Module name
  status: 'success' | 'error' | 'partial'; // Module execution status
  issues: TestIssue[];            // Issues found by the module
  summary: Record<string, number>; // Summary statistics and metrics
  errorMessage?: string;           // Error details if status is error
  startedAt?: Date;               // When analysis started
  completedAt?: Date;             // When analysis completed
}

// Generic analysis request structure
export interface AnalysisRequest {
  // TODO: Customize based on your specific analysis requirements
  // This is a template - modify fields according to your needs
  
  // Common GTM element structures:
  // tags?: TagData[];
  // triggers?: TriggerData[];
  // variables?: VariableData[];
  // folders?: FolderData[];
  
  // Analysis-specific options:
  // options?: AnalysisOptions;
}

// Configuration options for analysis behavior
export interface AnalysisOptions {
  includeLowSeverity?: boolean;    // Include low severity issues
  detailedReporting?: boolean;     // Include detailed element information
  maxIssuesPerModule?: number;     // Limit issues per module (0 = unlimited)
  excludeIssueTypes?: string[];    // Issue types to exclude
}

// Example GTM element interfaces - customize based on your module needs
export interface TagData {
  id: string;
  name: string;
  type: string;
  notes?: string;
  parentFolderId?: string;
  // Add more fields as needed for your analysis
}

export interface TriggerData {
  id: string;
  name: string;
  type: string;
  notes?: string;
  parentFolderId?: string;
  // Add more fields as needed for your analysis
}

export interface VariableData {
  id: string;
  name: string;
  type: string;
  notes?: string;
  parentFolderId?: string;
  // Add more fields as needed for your analysis
}

export interface FolderData {
  folderId: string;
  name: string;
}

// Analyzer interface for {MODULE_NAME} analysis
export interface {MODULE_NAME.charAt(0).toUpperCase() + MODULE_NAME.slice(1)}AnalyzerInterface {
  analyzeAll(): TestIssue[];
  getAnalysisSummary(issues: TestIssue[]): Record<string, any>;
}

// Helper functions for issue creation
export function createIssue(
  type: string,
  severity: TestIssue['severity'],
  element: Record<string, any>,
  message: string,
  recommendation: string,
  module: string = '{MODULE_NAME}'
): TestIssue {
  return {
    type,
    severity,
    element,
    message,
    recommendation,
    module,
    detectedAt: new Date()
  };
}

export function createSuccessResult(
  issues: TestIssue[],
  module: string = '{MODULE_NAME}',
  additionalSummary?: Record<string, number>
): ModuleResult {
  const summary: Record<string, number> = {
    total_issues: issues.length,
    critical: issues.filter(i => i.severity === 'critical').length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length,
    ...additionalSummary
  };
  
  return {
    module,
    status: 'success',
    issues,
    summary,
    startedAt: new Date(),
    completedAt: new Date()
  };
}

export function createErrorResult(
  errorMessage: string,
  module: string = '{MODULE_NAME}'
): ModuleResult {
  return {
    module,
    status: 'error',
    issues: [],
    summary: { total_errors: 1 },
    errorMessage,
    startedAt: new Date(),
    completedAt: new Date()
  };
}

// Type guards for runtime type checking
export function isTestIssue(obj: any): obj is TestIssue {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.type === 'string' &&
    ['critical', 'high', 'medium', 'low'].includes(obj.severity) &&
    typeof obj.element === 'object' &&
    typeof obj.message === 'string' &&
    typeof obj.recommendation === 'string' &&
    typeof obj.module === 'string'
  );
}

export function isModuleResult(obj: any): obj is ModuleResult {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.module === 'string' &&
    ['success', 'error', 'partial'].includes(obj.status) &&
    Array.isArray(obj.issues) &&
    typeof obj.summary === 'object'
  );
}

// Severity level utilities
export const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'] as const;

export function getSeverityWeight(severity: TestIssue['severity']): number {
  const weights = { low: 1, medium: 2, high: 3, critical: 4 };
  return weights[severity] || 0;
}

export function compareBySeverity(a: TestIssue, b: TestIssue): number {
  return getSeverityWeight(b.severity) - getSeverityWeight(a.severity);
}