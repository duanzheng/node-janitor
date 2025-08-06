// Test setup file
import * as fs from 'fs-extra';
import * as path from 'path';

// Mock Electron dependencies
jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn(),
  },
  dialog: {
    showOpenDialog: jest.fn(),
    showMessageBox: jest.fn(),
  },
}));

// Mock fs-extra
jest.mock('fs-extra');
jest.mock('execa');

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
global.createTestProject = async (projectName: string, hasNodeModules = true) => {
  const projectPath = path.join('/tmp', projectName);
  
  // Create project directory
  await fs.ensureDir(projectPath);
  
  // Create package.json
  await fs.writeJson(path.join(projectPath, 'package.json'), {
    name: projectName,
    version: '1.0.0',
  });
  
  // Create node_modules if requested
  if (hasNodeModules) {
    const nodeModulesPath = path.join(projectPath, 'node_modules');
    await fs.ensureDir(nodeModulesPath);
    
    // Create some dummy files to simulate node_modules
    await fs.writeFile(path.join(nodeModulesPath, 'dummy-package', 'dummy content'));
  }
  
  return projectPath;
};

global.cleanupTestProject = async (projectPath: string) => {
  await fs.remove(projectPath);
};