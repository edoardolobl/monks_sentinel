/**
 * GTM Governance and Documentation Quality Analyzer
 * 
 * This analyzer evaluates GTM container governance focusing on:
 * 1. Documentation coverage (notes/annotations)
 * 2. Folder organization quality
 * 3. Organizational best practices
 * 
 * With the gRPC pattern, this analyzer now works with protobuf data
 * rather than complex typed schemas, simplifying the data handling.
 */

// Temporary type definitions for legacy code compatibility
interface Tag { id?: string; name?: string; notes?: string; parentFolderId?: string; }
interface Trigger { id?: string; name?: string; notes?: string; parentFolderId?: string; }
interface Variable { id?: string; name?: string; notes?: string; parentFolderId?: string; }
interface Folder { folderId?: string; name?: string; }

import {
  TestIssue,
  DocumentationCoverageResult,
  FolderOrganizationResult,
  GovernanceAnalysisResult,
  AnalysisRequest,
} from './models';

interface Logger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  warn?: (message: string, ...args: any[]) => void;
  debug?: (message: string, ...args: any[]) => void;
}

export class GovernanceAnalyzer {
  private readonly request: AnalysisRequest;
  private readonly logger: Logger;

  constructor(data: AnalysisRequest, logger?: Logger) {
    // Store the typed request data
    this.request = data;
    this.logger = logger || console;
  }

  /**
   * Main analysis method - runs all governance checks
   * Returns structured TestIssue objects matching the Python module pattern
   */
  public analyzeAll(): TestIssue[] {
    this.logger.info('Starting governance analysis');

    const issues: TestIssue[] = [];

    // Run documentation coverage analysis
    const documentationIssues = this.analyzeDocumentationCoverage();
    issues.push(...documentationIssues);

    // Run folder organization analysis
    const organizationIssues = this.analyzeFolderOrganization();
    issues.push(...organizationIssues);

    this.logger.info(`Governance analysis completed: ${issues.length} issues found`);
    return issues;
  }

  /**
   * Comprehensive governance analysis with detailed results
   * Useful for detailed reporting and debugging
   */
  public analyzeGovernance(): GovernanceAnalysisResult {
    const documentationCoverage = this.getDocumentationCoverageDetails();
    const folderOrganization = this.getFolderOrganizationDetails();
    const issues = this.analyzeAll();

    const summary = this.calculateSummary(issues, documentationCoverage, folderOrganization);

    return {
      documentationCoverage,
      folderOrganization,
      issues,
      summary,
    };
  }

  /**
   * Analyze documentation coverage across all GTM elements
   */
  private analyzeDocumentationCoverage(): TestIssue[] {
    const issues: TestIssue[] = [];

    // Check tags documentation
    for (const tag of this.request.tags) {
      if (!this.hasDocumentation(tag.notes)) {
        issues.push(this.createDocumentationIssue(tag, 'tag'));
      }
    }

    // Check triggers documentation
    for (const trigger of this.request.triggers) {
      if (!this.hasDocumentation(trigger.notes)) {
        issues.push(this.createDocumentationIssue(trigger, 'trigger'));
      }
    }

    // Check variables documentation
    for (const variable of this.request.variables) {
      if (!this.hasDocumentation(variable.notes)) {
        issues.push(this.createDocumentationIssue(variable, 'variable'));
      }
    }

    return issues;
  }

  /**
   * Analyze folder organization quality
   */
  private analyzeFolderOrganization(): TestIssue[] {
    const issues: TestIssue[] = [];
    const folders = this.request.folders || [];

    if (folders.length === 0) {
      // No folders detected - this is an organization issue
      issues.push({
        type: 'no_folder_structure',
        severity: 'medium',
        element: { 
          containerInfo: {
            totalTags: this.request.tags.length,
            totalTriggers: this.request.triggers.length,
            totalVariables: this.request.variables.length,
          }
        },
        message: 'Container has no folder organization structure',
        recommendation: 'Create folders to organize tags, triggers, and variables by purpose, team, or functionality',
      });
      
      // All items are unorganized if no folders exist
      [...this.request.tags, ...this.request.triggers, ...this.request.variables]
        .forEach(item => {
          issues.push(this.createUnorganizedItemIssue(item));
        });

      return issues;
    }

    // Check for empty folders
    for (const folder of folders) {
      if (this.isFolderEmpty(folder)) {
        issues.push(this.createEmptyFolderIssue(folder));
      }
    }

    // Check for unorganized items (items not in any folder)
    const unorganizedItems = this.findUnorganizedItems();
    for (const item of unorganizedItems) {
      issues.push(this.createUnorganizedItemIssue(item));
    }

    return issues;
  }

  /**
   * Get detailed documentation coverage metrics
   */
  private getDocumentationCoverageDetails(): DocumentationCoverageResult {
    const allItems = [
      ...this.request.tags.map((t: any) => ({ ...t, type: 'tag' as const })),
      ...this.request.triggers.map((t: any) => ({ ...t, type: 'trigger' as const })),
      ...this.request.variables.map((v: any) => ({ ...v, type: 'variable' as const })),
    ];

    const documentedItems = allItems.filter(item => this.hasDocumentation(item.notes));
    const undocumentedItems = allItems
      .filter(item => !this.hasDocumentation(item.notes))
      .map(item => ({
        id: this.getItemId(item),
        name: item.name,
        type: item.type,
      }));

    return {
      totalItems: allItems.length,
      documentedItems: documentedItems.length,
      coveragePercentage: allItems.length > 0 ? Math.round((documentedItems.length / allItems.length) * 100) : 0,
      undocumentedItems,
    };
  }

  /**
   * Get detailed folder organization metrics
   */
  private getFolderOrganizationDetails(): FolderOrganizationResult {
    const folders = this.request.folders || [];
    const allItems = [
      ...this.request.tags.map((t: any) => ({ ...t, type: 'tag' as const })),
      ...this.request.triggers.map((t: any) => ({ ...t, type: 'trigger' as const })),
      ...this.request.variables.map((v: any) => ({ ...v, type: 'variable' as const })),
    ];

    const organizedItems = allItems.filter(item => item.parentFolderId);
    const emptyFolders = folders
      .filter((folder: any) => this.isFolderEmpty(folder))
      .map((folder: any) => ({
        folderId: folder.folderId,
        name: folder.name,
      }));

    const unorganizedItems = allItems
      .filter(item => !item.parentFolderId)
      .map(item => ({
        id: this.getItemId(item),
        name: item.name,
        type: item.type,
      }));

    return {
      totalFolders: folders.length,
      totalItems: allItems.length,
      organizedItems: organizedItems.length,
      organizationPercentage: allItems.length > 0 ? Math.round((organizedItems.length / allItems.length) * 100) : 0,
      emptyFolders,
      unorganizedItems,
    };
  }

  /**
   * Check if an item has meaningful documentation
   */
  private hasDocumentation(notes?: string | null): boolean {
    if (!notes) return false;
    
    // Clean up the notes and check for meaningful content
    const cleanNotes = notes.trim()
      // Remove common auto-generated prefixes (dates, emails)
      .replace(/^\[.*?\]\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*/, '')
      // Remove timestamp patterns
      .replace(/^\d{4}-\d{2}-\d{2}.*?:\s*/, '')
      .trim();

    // Must have at least 10 characters of meaningful content
    return cleanNotes.length >= 10 && !this.isBoilerplateText(cleanNotes);
  }

  /**
   * Detect common boilerplate or meaningless documentation
   */
  private isBoilerplateText(text: string): boolean {
    const boilerplatePatterns = [
      /^(tag|trigger|variable)$/i,
      /^(todo|fixme|temp|temporary)$/i,
      /^(test|testing)$/i,
      /^(new|old|legacy)$/i,
      /^\w{1,5}$/, // Very short text likely not meaningful
    ];

    return boilerplatePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if a folder is empty (has no items assigned to it)
   */
  private isFolderEmpty(folder: Folder): boolean {
    const hasItems = [
      ...this.request.tags,
      ...this.request.triggers,
      ...this.request.variables,
    ].some(item => item.parentFolderId === folder.folderId);

    return !hasItems;
  }

  /**
   * Find items that are not organized in any folder
   */
  private findUnorganizedItems(): Array<Tag | Trigger | Variable> {
    return [
      ...this.request.tags.filter((tag: any) => !tag.parentFolderId),
      ...this.request.triggers.filter((trigger: any) => !trigger.parentFolderId),
      ...this.request.variables.filter((variable: any) => !variable.parentFolderId),
    ];
  }

  /**
   * Create a documentation-related issue
   */
  private createDocumentationIssue(item: Tag | Trigger | Variable, type: string): TestIssue {
    const itemType = this.getItemType(item);
    
    return {
      type: 'missing_documentation',
      severity: 'medium',
      element: {
        id: this.getItemId(item),
        name: item.name,
        type: itemType,
      },
      message: `${this.capitalizeFirst(itemType)} "${item.name}" lacks proper documentation`,
      recommendation: `Add meaningful notes/annotations to explain the purpose, configuration, and usage of this ${itemType}`,
    };
  }

  /**
   * Create an empty folder issue
   */
  private createEmptyFolderIssue(folder: Folder): TestIssue {
    return {
      type: 'empty_folder',
      severity: 'low',
      element: {
        folderId: folder.folderId,
        name: folder.name,
        type: 'folder',
      },
      message: `Folder "${folder.name}" is empty and contains no elements`,
      recommendation: 'Either assign elements to this folder or remove it to maintain clean organization',
    };
  }

  /**
   * Create an unorganized item issue
   */
  private createUnorganizedItemIssue(item: Tag | Trigger | Variable): TestIssue {
    const itemType = this.getItemType(item);
    
    return {
      type: 'unorganized_element',
      severity: 'low',
      element: {
        id: this.getItemId(item),
        name: item.name,
        type: itemType,
      },
      message: `${this.capitalizeFirst(itemType)} "${item.name}" is not organized in any folder`,
      recommendation: `Assign this ${itemType} to an appropriate folder based on its functionality or ownership`,
    };
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(
    issues: TestIssue[], 
    docCoverage: DocumentationCoverageResult,
    folderOrg: FolderOrganizationResult
  ): Record<string, number> {
    return {
      total_issues: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
      documentation_coverage_percentage: docCoverage.coveragePercentage,
      organization_percentage: folderOrg.organizationPercentage,
      documented_items: docCoverage.documentedItems,
      undocumented_items: docCoverage.undocumentedItems.length,
      organized_items: folderOrg.organizedItems,
      unorganized_items: folderOrg.unorganizedItems.length,
      empty_folders: folderOrg.emptyFolders.length,
      total_folders: folderOrg.totalFolders,
    };
  }

  /**
   * Helper method to get item ID based on type
   */
  private getItemId(item: Tag | Trigger | Variable): string {
    if ('tagId' in item) return item.tagId as string;
    if ('triggerId' in item) return item.triggerId as string;
    if ('variableId' in item) return item.variableId as string;
    return 'unknown';
  }

  /**
   * Helper method to get item type as string
   */
  private getItemType(item: Tag | Trigger | Variable): string {
    if ('tagId' in item) return 'tag';
    if ('triggerId' in item) return 'trigger';
    if ('variableId' in item) return 'variable';
    return 'unknown';
  }

  /**
   * Helper method to capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}