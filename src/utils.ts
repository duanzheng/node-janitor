import { Project, Cache } from './types';

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 格式化日期
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

// 计算总大小
export function calculateTotalSize(projects: Project[]): number {
  return projects.reduce((total, project) => total + project.nodeModulesSize, 0);
}

// 获取包管理器图标
export function getPackageManagerIcon(packageManager: string): string {
  const icons: { [key: string]: string } = {
    npm: '📦',
    yarn: '🧶',
    pnpm: '⚡'
  };
  return icons[packageManager] || '📦';
}