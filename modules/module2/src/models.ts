/**
 * TypeScript models for GTM governance analysis responses.
 * 
 * With the API Gateway pattern, modules now receive plain JSON and only need
 * to define their response formats for communication back to the core orchestrator.
 * Removed all legacy GTM schema definitions as they are now handled by the core.
 */

// Response models for module communication (converted from zod to plain TypeScript)
export interface TestIssue {
  type: string; // missing_documentation, empty_folder, etc.
  severity: 'critical' | 'medium' | 'low';
  element: Record<string, any>; // The GTM element with the issue
  message: string; // Human-readable description
  recommendation: string; // How to fix it
}

// Module result interface for governance module responses
export interface ModuleResult {
  module: string; // "governance"
  status: 'success' | 'error';
  issues: TestIssue[];
  summary: Record<string, number | string>; // total_issues, critical, medium, low, error messages
}

// Analysis request interface for type safety
export interface AnalysisRequest {
  tags: Array<{
    id?: string;
    name?: string;
    notes?: string;
    parentFolderId?: string;
    [key: string]: any;
  }>;
  triggers: Array<{
    id?: string;
    name?: string;
    notes?: string;
    parentFolderId?: string;
    [key: string]: any;
  }>;
  variables: Array<{
    id?: string;
    name?: string;
    notes?: string;
    parentFolderId?: string;
    [key: string]: any;
  }>;
  folders?: Array<{
    folderId?: string;
    name?: string;
    [key: string]: any;
  }>;
}

// Governance-specific types for analysis results
export interface DocumentationCoverageResult {
  totalItems: number;
  documentedItems: number;
  coveragePercentage: number;
  undocumentedItems: Array<{
    id: string;
    name: string;
    type: 'tag' | 'trigger' | 'variable';
  }>;
}

export interface FolderOrganizationResult {
  totalFolders: number;
  totalItems: number;
  organizedItems: number;
  organizationPercentage: number;
  emptyFolders: Array<{
    folderId: string;
    name: string;
  }>;
  unorganizedItems: Array<{
    id: string;
    name: string;
    type: 'tag' | 'trigger' | 'variable';
  }>;
}

export interface GovernanceAnalysisResult {
  documentationCoverage: DocumentationCoverageResult;
  folderOrganization: FolderOrganizationResult;
  issues: TestIssue[];
  summary: Record<string, number>;
}