/**
 * Jest test setup file for GTM Governance Analyzer
 * Configures global test environment and utilities
 */

// Extend Jest matchers if needed
import 'jest';

// Global test configuration
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
});

// Global test utilities
global.testHelpers = {
  createMockTag: (overrides: any = {}) => ({
    tagId: '1',
    name: 'Test Tag',
    type: 'html',
    parameter: [],
    firingTriggerId: [],
    blockingTriggerId: [],
    setupTag: [],
    teardownTag: [],
    ...overrides,
  }),

  createMockTrigger: (overrides: any = {}) => ({
    triggerId: '1',
    name: 'Test Trigger',
    type: 'pageview',
    customEventFilter: [],
    filter: [],
    ...overrides,
  }),

  createMockVariable: (overrides: any = {}) => ({
    variableId: '1',
    name: 'Test Variable',
    type: 'constant',
    parameter: [],
    ...overrides,
  }),

  createMockFolder: (overrides: any = {}) => ({
    folderId: '1',
    name: 'Test Folder',
    ...overrides,
  }),

  createMockAnalysisRequest: (overrides: any = {}) => ({
    tags: [],
    triggers: [],
    variables: [],
    builtin_variables: [],
    folders: [],
    ...overrides,
  }),
};

// Type declarations for global test utilities
declare global {
  var testHelpers: {
    createMockTag: (overrides?: any) => any;
    createMockTrigger: (overrides?: any) => any;
    createMockVariable: (overrides?: any) => any;
    createMockFolder: (overrides?: any) => any;
    createMockAnalysisRequest: (overrides?: any) => any;
  };
}