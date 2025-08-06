import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI, ConfirmDialogOptions } from './types';

// Expose IPC methods to the renderer process
const electronAPI: ElectronAPI = {
  // Directory selection
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Project scanning
  scanProjects: (rootPath: string) => ipcRenderer.invoke('scan-projects', rootPath),
  
  // Node modules deletion
  deleteNodeModules: (projectPaths: string[]) => ipcRenderer.invoke('delete-node-modules', projectPaths),
  
  // Cache management
  detectCaches: () => ipcRenderer.invoke('detect-caches'),
  cleanCache: (packageManager: string) => ipcRenderer.invoke('clean-cache', packageManager),
  
  // Confirmation dialog
  showConfirmDialog: (options: ConfirmDialogOptions) => ipcRenderer.invoke('show-confirm-dialog', options)
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);