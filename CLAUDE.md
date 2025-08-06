# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Node Janitor** is an Electron-based desktop application designed to help developers manage Node.js project dependencies and package manager caches. It provides two main features:

1. **Project Cleaner**: Scans directories for Node.js projects and allows bulk deletion of `node_modules` folders
2. **Cache Manager**: Detects and cleans package manager caches (npm, yarn, pnpm)

## Architecture

### Tech Stack

- **Frontend**: React 19 + TypeScript + Ant Design 5.x
- **Backend**: Electron (main process) + TypeScript
- **Build Tools**: Webpack + TypeScript compiler
- **Testing**: Jest + ts-jest
- **NPM Package Manager**: Yarn

### Project Structure

```
src/
├── index.ts          # Electron main process entry
├── ipcHandlers.ts    # IPC handlers for renderer/main communication
├── preload.ts        # Preload script for secure renderer API exposure
├── renderer.tsx      # React renderer entry point
├── App.tsx           # Main React app with navigation
├── ProjectCleaner.tsx # Project scanning and cleanup component
├── CacheManager.tsx   # Cache detection and cleanup component
├── utils.ts          # Utility functions (formatting, calculations)
└── types.ts          # TypeScript type definitions
```

## Testing

- **Test Environment**: Node.js environment with Jest
- **Test Files**: Located in `tests/` directory
- **Coverage**: Configured to exclude renderer, preload, and index files
- **Mocks**: Electron, fs-extra, and execa are mocked for unit testing

## Important Notes

- **Security**: Uses contextIsolation and nodeIntegration: false for security
- **Path Handling**: All file operations use absolute paths with proper error handling
- **User Experience**: All destructive operations require explicit user confirmation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: Directory scanning is async and reports progress via loading states
