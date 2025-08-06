export interface Project {
  name: string;
  path: string;
  nodeModulesSize: number;
  lastModified: number;
  hasNodeModules: boolean;
}

export interface Cache {
  name: string;
  path: string;
  size: number;
  detected: boolean;
  error?: string;
}

export interface ScanResult {
  success: boolean;
  projects?: Project[];
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  results?: DeleteOperationResult[];
  error?: string;
}

export interface DeleteOperationResult {
  path: string;
  success: boolean;
  message: string;
}

export interface CacheResult {
  success: boolean;
  caches?: Cache[];
  error?: string;
}

export interface CleanCacheResult {
  success: boolean;
  message: string;
}

export interface IPCResult {
  success: boolean;
  error?: string;
  message?: string;
  results?: any[];
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  buttons: string[];
}

export interface ElectronAPI {
  selectDirectory: () => Promise<string | null>;
  scanProjects: (path: string) => Promise<ScanResult>;
  deleteNodeModules: (paths: string[]) => Promise<DeleteResult>;
  detectCaches: () => Promise<CacheResult>;
  cleanCache: (manager: string) => Promise<CleanCacheResult>;
  showConfirmDialog: (options: ConfirmDialogOptions) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}