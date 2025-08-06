# 🧹 Node Janitor

<div align="center">

**A powerful desktop application for cleaning Node.js project dependencies and package manager caches**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-37.2.6-47848F.svg)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6.svg)](https://www.typescriptlang.org/)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing)

</div>

---

## 🚀 Overview

Node Janitor is a cross-platform desktop application built with Electron that helps developers reclaim disk space by efficiently managing Node.js project dependencies and package manager caches. Whether you're dealing with hundreds of `node_modules` folders or bloated package caches, Node Janitor makes cleanup simple and safe.

## ✨ Features

### 🗂️ **Project Cleaner**

- **Smart Scanning**: Recursively scan directories to find all Node.js projects
- **Bulk Operations**: Select and delete multiple `node_modules` folders at once
- **Space Calculation**: See exactly how much disk space you'll reclaim
- **Safe Deletion**: Confirmation dialogs prevent accidental deletions
- **Progress Tracking**: Real-time progress updates during cleanup operations

### 🗃️ **Cache Manager**

- **Multi-Manager Support**: Detect and clean caches from npm, yarn, and pnpm
- **Cache Statistics**: View cache sizes and locations before cleaning
- **Selective Cleaning**: Choose which package managers to clean
- **Instant Results**: See freed space immediately after cleanup

### 🛡️ **Built for Safety**

- **Secure Architecture**: Uses Electron's security best practices
- **User Confirmation**: All destructive operations require explicit approval
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Async Operations**: Non-blocking UI during intensive file operations

## 📦 Installation

### Download Pre-built Binaries

> _Coming soon - binaries will be available on the releases page_

### Build from Source

**Prerequisites:**

- Node.js (>= 16.0.0)
- Yarn package manager

```bash
# Clone the repository
git clone https://github.com/yourusername/node-janitor.git
cd node-janitor

# Install dependencies
yarn install

# Start in development mode
yarn dev

# Build for production
yarn make
```

## 🖥️ Usage

### Project Cleaner

1. **Select Directory**: Choose the root directory to scan for Node.js projects
2. **Scan Projects**: Click "Scan" to find all projects with `node_modules` folders
3. **Review Results**: See the list of found projects and their sizes
4. **Clean Up**: Select projects and click "Clean Selected" to remove `node_modules`

### Cache Manager

1. **Detect Caches**: The app automatically detects package manager caches
2. **View Sizes**: See how much space each cache is using
3. **Clean Caches**: Select which caches to clean and confirm the operation
4. **Verify Results**: Check the freed space summary

## 🛠️ Development

### Tech Stack

- **Frontend**: React 19 + TypeScript + Ant Design 5.x
- **Backend**: Electron + Node.js
- **Build Tools**: Webpack + Electron Forge
- **Testing**: Jest + ts-jest
- **Package Manager**: Yarn

### Development Commands

```bash
# Start development server
yarn dev

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Build the app
yarn build

# Package the app
yarn package

# Create distributable packages
yarn make
```

### Testing

- **Test Environment**: Node.js with Jest
- **Mocking**: Electron, fs-extra, and execa are mocked for unit testing
- **Coverage**: Configured to exclude renderer, preload, and main entry files

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if needed
4. **Run tests**: `yarn test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**TonyDuan**

- Email: duanzheng21518@gmail.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- UI powered by [Ant Design](https://ant.design/)
- Icons from [Ant Design Icons](https://ant.design/components/icon/)

---

<div align="center">

**If Node Janitor helped you reclaim disk space, please give it a ⭐!**

</div>
