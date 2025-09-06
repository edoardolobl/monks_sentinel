/**
 * Tests for GTM Governance Analyzer
 * Ensures governance analysis works correctly and matches expected patterns
 */

import { GovernanceAnalyzer } from '../governanceAnalyzer';
import { AnalysisRequest } from '../models';

describe('GovernanceAnalyzer', () => {
  describe('analyzeAll', () => {
    it('should return empty issues for fully documented and organized container', () => {
      const request: AnalysisRequest = {
        tags: [
          testHelpers.createMockTag({
            tagId: '1',
            name: 'Well Documented Tag',
            notes: 'This tag tracks user interactions with the main CTA button for conversion analysis',
            parentFolderId: 'folder1',
          }),
        ],
        triggers: [
          testHelpers.createMockTrigger({
            triggerId: '1',
            name: 'CTA Click Trigger',
            notes: 'Fires when users click on the main call-to-action button',
            parentFolderId: 'folder1',
          }),
        ],
        variables: [
          testHelpers.createMockVariable({
            variableId: '1',
            name: 'User ID Variable',
            notes: 'Retrieves the authenticated user ID from the data layer for user tracking',
            parentFolderId: 'folder1',
          }),
        ],
        builtin_variables: [],
        folders: [
          testHelpers.createMockFolder({
            folderId: 'folder1',
            name: 'User Tracking',
          }),
        ],
      };

      const analyzer = new GovernanceAnalyzer(request);
      const issues = analyzer.analyzeAll();

      expect(issues).toHaveLength(0);
    });

    it('should detect missing documentation issues', () => {
      const request: AnalysisRequest = {
        tags: [
          testHelpers.createMockTag({
            tagId: '1',
            name: 'Undocumented Tag',
            notes: undefined,
          }),
          testHelpers.createMockTag({
            tagId: '2',
            name: 'Poorly Documented Tag',
            notes: 'tag', // Too short/boilerplate
          }),
        ],
        triggers: [],
        variables: [],
        builtin_variables: [],
        folders: [],
      };

      const analyzer = new GovernanceAnalyzer(request);
      const issues = analyzer.analyzeAll();

      const documentationIssues = issues.filter(issue => issue.type === 'missing_documentation');
      expect(documentationIssues).toHaveLength(2);
      
      expect(documentationIssues[0]).toMatchObject({
        type: 'missing_documentation',
        severity: 'medium',
        message: 'Tag "Undocumented Tag" lacks proper documentation',
      });
    });

    it('should detect unorganized elements when no folders exist', () => {
      const request: AnalysisRequest = {
        tags: [
          testHelpers.createMockTag({ tagId: '1', name: 'Tag 1' }),
          testHelpers.createMockTag({ tagId: '2', name: 'Tag 2' }),
        ],
        triggers: [
          testHelpers.createMockTrigger({ triggerId: '1', name: 'Trigger 1' }),
        ],
        variables: [],
        builtin_variables: [],
        folders: [], // No folders
      };

      const analyzer = new GovernanceAnalyzer(request);
      const issues = analyzer.analyzeAll();

      const organizationIssues = issues.filter(issue => 
        issue.type === 'no_folder_structure' || issue.type === 'unorganized_element'
      );
      
      expect(organizationIssues.length).toBeGreaterThan(0);
      
      const noFolderIssue = issues.find(issue => issue.type === 'no_folder_structure');
      expect(noFolderIssue).toBeDefined();
      expect(noFolderIssue?.severity).toBe('medium');
    });

    it('should detect empty folders', () => {
      const request: AnalysisRequest = {
        tags: [
          testHelpers.createMockTag({
            tagId: '1',
            name: 'Organized Tag',
            parentFolderId: 'folder1',
          }),
        ],
        triggers: [],
        variables: [],
        builtin_variables: [],
        folders: [
          testHelpers.createMockFolder({ folderId: 'folder1', name: 'Used Folder' }),
          testHelpers.createMockFolder({ folderId: 'folder2', name: 'Empty Folder' }),
        ],
      };

      const analyzer = new GovernanceAnalyzer(request);
      const issues = analyzer.analyzeAll();

      const emptyFolderIssues = issues.filter(issue => issue.type === 'empty_folder');
      expect(emptyFolderIssues).toHaveLength(1);
      
      expect(emptyFolderIssues[0]).toMatchObject({
        type: 'empty_folder',
        severity: 'low',
        element: {
          folderId: 'folder2',
          name: 'Empty Folder',
        },
      });
    });

    it('should detect unorganized items when folders exist', () => {
      const request: AnalysisRequest = {
        tags: [
          testHelpers.createMockTag({
            tagId: '1',
            name: 'Organized Tag',
            parentFolderId: 'folder1',
          }),
          testHelpers.createMockTag({
            tagId: '2',
            name: 'Unorganized Tag',
            parentFolderId: undefined,
          }),
        ],
        triggers: [],
        variables: [],
        builtin_variables: [],
        folders: [
          testHelpers.createMockFolder({ folderId: 'folder1', name: 'Main Folder' }),
        ],
      };

      const analyzer = new GovernanceAnalyzer(request);
      const issues = analyzer.analyzeAll();

      const unorganizedIssues = issues.filter(issue => issue.type === 'unorganized_element');
      expect(unorganizedIssues).toHaveLength(1);
      
      expect(unorganizedIssues[0]).toMatchObject({
        type: 'unorganized_element',
        severity: 'low',
        element: {
          id: '2',
          name: 'Unorganized Tag',
          type: 'tag',
        },
      });
    });
  });

  describe('analyzeGovernance', () => {
    it('should return detailed governance metrics', () => {
      const request: AnalysisRequest = {
        tags: [
          testHelpers.createMockTag({
            tagId: '1',
            name: 'Documented Tag',
            notes: 'This is a well documented tag with clear purpose and usage',
            parentFolderId: 'folder1',
          }),
          testHelpers.createMockTag({
            tagId: '2',
            name: 'Undocumented Tag',
            notes: undefined,
            parentFolderId: undefined,
          }),
        ],
        triggers: [],
        variables: [],
        builtin_variables: [],
        folders: [
          testHelpers.createMockFolder({ folderId: 'folder1', name: 'Main Folder' }),
        ],
      };

      const analyzer = new GovernanceAnalyzer(request);
      const result = analyzer.analyzeGovernance();

      expect(result.documentationCoverage).toMatchObject({
        totalItems: 2,
        documentedItems: 1,
        coveragePercentage: 50,
        undocumentedItems: [
          {
            id: '2',
            name: 'Undocumented Tag',
            type: 'tag',
          },
        ],
      });

      expect(result.folderOrganization).toMatchObject({
        totalFolders: 1,
        totalItems: 2,
        organizedItems: 1,
        organizationPercentage: 50,
        emptyFolders: [],
        unorganizedItems: [
          {
            id: '2',
            name: 'Undocumented Tag',
            type: 'tag',
          },
        ],
      });

      expect(result.summary).toHaveProperty('documentation_coverage_percentage', 50);
      expect(result.summary).toHaveProperty('organization_percentage', 50);
    });
  });

  describe('hasDocumentation', () => {
    it('should correctly identify meaningful documentation', () => {
      const analyzer = new GovernanceAnalyzer(testHelpers.createMockAnalysisRequest());
      
      // Test private method via reflection for thorough testing
      const hasDocumentation = (analyzer as any).hasDocumentation.bind(analyzer);

      expect(hasDocumentation('This tag tracks user signup conversions')).toBe(true);
      expect(hasDocumentation('Comprehensive tracking for e-commerce checkout flow')).toBe(true);
      
      expect(hasDocumentation('')).toBe(false);
      expect(hasDocumentation(undefined)).toBe(false);
      expect(hasDocumentation('tag')).toBe(false);
      expect(hasDocumentation('test')).toBe(false);
      expect(hasDocumentation('todo')).toBe(false);
      expect(hasDocumentation('short')).toBe(false); // Too short
      
      // Should clean auto-generated prefixes
      expect(hasDocumentation('[2023-10-15] john@company.com This is meaningful documentation')).toBe(true);
    });
  });
});