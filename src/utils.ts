import { Project, Cache } from './types';

// Format file size
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date
export function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
}

// Calculate total size
export function calculateTotalSize(projects: Project[]): number {
    return projects.reduce(
        (total, project) => total + project.nodeModulesSize,
        0
    );
}

// Get package manager icon
export function getPackageManagerIcon(packageManager: string): string {
    const icons: { [key: string]: string } = {
        npm: '📦',
        yarn: '🧶',
        pnpm: '⚡',
    };
    return icons[packageManager] || '📦';
}
