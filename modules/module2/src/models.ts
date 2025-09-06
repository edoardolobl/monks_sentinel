/**
 * TypeScript models for GTM governance analysis responses.
 * 
 * With the API Gateway pattern, modules now receive plain JSON and only need
 * to define their response formats for communication back to the core orchestrator.
 * Removed all legacy GTM schema definitions as they are now handled by the core.
 */

import { z } from 'zod';

// Response models for module communication
export const TestIssueSchema = z.object({
  type: z.string(), // missing_documentation, empty_folder, etc.
  severity: z.enum(['critical', 'medium', 'low']),
  element: z.record(z.any()), // The GTM element with the issue
  message: z.string(), // Human-readable description
  recommendation: z.string(), // How to fix it
});

export type TestIssue = z.infer<typeof TestIssueSchema>;

// Module result schema for governance module responses
export const ModuleResultSchema = z.object({
  module: z.string(), // "governance"
  status: z.enum(['success', 'error']),
  issues: z.array(TestIssueSchema).default([]),
  summary: z.record(z.union([z.number(), z.string()])).default({}), // total_issues, critical, medium, low, error messages
});

export type ModuleResult = z.infer<typeof ModuleResultSchema>;

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