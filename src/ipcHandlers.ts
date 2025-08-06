import { ipcMain, dialog, IpcMainInvokeEvent } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import {
    Project,
    Cache,
    IPCResult,
    DeleteResult,
    DeleteOperationResult,
    ConfirmDialogOptions,
} from './types';

// Scan Node.js projects in specified directory
async function scanNodeProjects(rootPath: string): Promise<Project[]> {
    const projects: Project[] = [];

    async function scanDirectory(dir: string): Promise<void> {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);

            if (item.isDirectory()) {
                // Check if contains package.json
                const packageJsonPath = path.join(fullPath, 'package.json');
                if (await fs.pathExists(packageJsonPath)) {
                    const nodeModulesPath = path.join(fullPath, 'node_modules');
                    let nodeModulesSize = 0;
                    let lastModified = 0;

                    try {
                        // Get node_modules size
                        if (await fs.pathExists(nodeModulesPath)) {
                            nodeModulesSize =
                                await getDirectorySize(nodeModulesPath);
                        }

                        // Get project last modified time
                        const stats = await fs.stat(fullPath);
                        lastModified = stats.mtime.getTime();

                        projects.push({
                            name: item.name,
                            path: fullPath,
                            nodeModulesSize,
                            lastModified,
                            hasNodeModules:
                                await fs.pathExists(nodeModulesPath),
                        });
                    } catch (error) {
                        console.error(`Error scanning ${fullPath}:`, error);
                    }
                } else {
                    // Recursively scan subdirectories
                    await scanDirectory(fullPath);
                }
            }
        }
    }

    await scanDirectory(rootPath);
    return projects;
}

// Calculate directory size
async function getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;

    async function calculateSize(dir: string): Promise<void> {
        try {
            const items = await fs.readdir(dir, { withFileTypes: true });

            for (const item of items) {
                const fullPath = path.join(dir, item.name);

                try {
                    if (item.isDirectory()) {
                        await calculateSize(fullPath);
                    } else {
                        const stats = await fs.stat(fullPath);
                        totalSize += stats.size;
                    }
                } catch (error) {
                    console.log(
                        `Error accessing ${fullPath}:`,
                        (error as Error).message
                    );
                    // Continue processing other files
                }
            }
        } catch (error) {
            console.log(
                `Error reading directory ${dir}:`,
                (error as Error).message
            );
            // If directory cannot be read, return 0
        }
    }

    try {
        await calculateSize(dirPath);
    } catch (error) {
        console.log(
            `Error calculating size for ${dirPath}:`,
            (error as Error).message
        );
        return 0;
    }

    return totalSize;
}

// Delete node_modules directories
async function deleteNodeModules(
    projectPaths: string[]
): Promise<DeleteResult> {
    const results: DeleteOperationResult[] = [];

    for (const projectPath of projectPaths) {
        const nodeModulesPath = path.join(projectPath, 'node_modules');

        try {
            if (await fs.pathExists(nodeModulesPath)) {
                await fs.remove(nodeModulesPath);
                results.push({
                    path: projectPath,
                    success: true,
                    message: 'Successfully deleted node_modules',
                });
            } else {
                results.push({
                    path: projectPath,
                    success: false,
                    message: 'node_modules not found',
                });
            }
        } catch (error) {
            results.push({
                path: projectPath,
                success: false,
                message: (error as Error).message,
            });
        }
    }

    return { success: true, results };
}

// Detect package manager caches
async function detectPackageManagerCaches(): Promise<Cache[]> {
    const caches: Cache[] = [];

    // Detect npm cache
    try {
        const { stdout: npmCachePath } = await execa('npm', [
            'config',
            'get',
            'cache',
        ]);
        const npmCacheSize = await getDirectorySize(npmCachePath.trim());
        caches.push({
            name: 'npm',
            path: npmCachePath.trim(),
            size: npmCacheSize,
            detected: true,
        });
    } catch (error) {
        caches.push({
            name: 'npm',
            path: '',
            size: 0,
            detected: false,
            error: (error as Error).message,
        });
    }

    // Detect yarn cache
    try {
        // First check system PATH
        const { stdout: whichYarn } = await execa('which', ['yarn']);
        const yarnPath = whichYarn.trim();

        // Use full path to call yarn
        const { stdout: yarnCachePath } = await execa(yarnPath, [
            'cache',
            'dir',
        ]);

        const yarnCacheSize = await getDirectorySize(yarnCachePath.trim());
        caches.push({
            name: 'yarn',
            path: yarnCachePath.trim(),
            size: yarnCacheSize,
            detected: true,
        });
    } catch (error) {
        caches.push({
            name: 'yarn',
            path: '',
            size: 0,
            detected: false,
            error: (error as Error).message,
        });
    }

    // Detect pnpm cache
    try {
        const { stdout: pnpmCachePath } = await execa('pnpm', [
            'store',
            'path',
        ]);
        const pnpmCacheSize = await getDirectorySize(pnpmCachePath.trim());
        caches.push({
            name: 'pnpm',
            path: pnpmCachePath.trim(),
            size: pnpmCacheSize,
            detected: true,
        });
    } catch (error) {
        caches.push({
            name: 'pnpm',
            path: '',
            size: 0,
            detected: false,
            error: (error as Error).message,
        });
    }

    return caches;
}

// Clean package manager cache
async function cleanPackageManagerCache(
    packageManager: string
): Promise<IPCResult> {
    try {
        switch (packageManager) {
            case 'npm':
                await execa('npm', ['cache', 'clean', '--force']);
                break;
            case 'yarn':
                await execa('yarn', ['cache', 'clean']);
                break;
            case 'pnpm':
                await execa('pnpm', ['store', 'prune']);
                break;
            default:
                throw new Error(
                    `Unsupported package manager: ${packageManager}`
                );
        }

        // Re-detect cache size to ensure cleanup took effect
        const caches = await detectPackageManagerCaches();
        const cache = caches.find((c) => c.name === packageManager);
        const newSize = cache ? cache.size : 0;

        return {
            success: true,
            message: `Successfully cleaned ${packageManager} cache. New size: ${newSize}`,
        };
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        };
    }
}

// Setup IPC handlers
function setupIPCHandlers(): void {
    // Select directory
    ipcMain.handle('select-directory', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        if (result.canceled) {
            return null;
        }

        return result.filePaths[0];
    });

    // Scan projects
    ipcMain.handle(
        'scan-projects',
        async (_: IpcMainInvokeEvent, rootPath: string) => {
            try {
                const projects = await scanNodeProjects(rootPath);
                return { success: true, projects };
            } catch (error) {
                console.error('Scan projects error:', error);
                return { success: false, error: (error as Error).message };
            }
        }
    );

    // Delete node_modules
    ipcMain.handle(
        'delete-node-modules',
        async (_: IpcMainInvokeEvent, projectPaths: string[]) => {
            try {
                const results = await deleteNodeModules(projectPaths);
                return results;
            } catch (error) {
                console.error('Delete node modules error:', error);
                return { success: false, error: (error as Error).message };
            }
        }
    );

    // Detect cache
    ipcMain.handle('detect-caches', async () => {
        try {
            const caches = await detectPackageManagerCaches();
            return { success: true, caches };
        } catch (error) {
            console.error('Detect caches error:', error);
            return { success: false, error: (error as Error).message };
        }
    });

    // Clean cache
    ipcMain.handle(
        'clean-cache',
        async (_: IpcMainInvokeEvent, packageManager: string) => {
            try {
                const result = await cleanPackageManagerCache(packageManager);
                return result;
            } catch (error) {
                console.error('Clean cache error:', error);
                return { success: false, error: (error as Error).message };
            }
        }
    );

    // Show confirmation dialog
    ipcMain.handle(
        'show-confirm-dialog',
        async (_: IpcMainInvokeEvent, options: ConfirmDialogOptions) => {
            try {
                const result = await dialog.showMessageBox({
                    type: 'question',
                    title: options.title,
                    message: options.message,
                    buttons: options.buttons,
                    defaultId: 0,
                    cancelId: 1,
                });
                return result.response === 0; // Return whether user clicked the first button (confirm)
            } catch (error) {
                console.error('Show confirm dialog error:', error);
                return false;
            }
        }
    );
}

export {
    setupIPCHandlers,
    detectPackageManagerCaches,
    scanNodeProjects,
    deleteNodeModules,
    cleanPackageManagerCache,
};
