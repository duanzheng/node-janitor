# 🧹 Node Janitor

<div align="center">

**A powerful desktop application for cleaning Node.js project dependencies and package manager caches**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/duanzheng/node-janitor?cache=0)](https://github.com/duanzheng/node-janitor/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/duanzheng/node-janitor/release.yml?branch=main&cache=0)](https://github.com/duanzheng/node-janitor/actions)
[![Downloads](https://img.shields.io/github/downloads/duanzheng/node-janitor/total?cache=0)](https://github.com/duanzheng/node-janitor/releases)
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

**📥 [Download Latest Release](https://github.com/duanzheng/node-janitor/releases/latest)**

Choose the appropriate download for your operating system:

#### 🍎 **macOS**

- Prefer the signed & notarized `.dmg` (available for Apple Silicon and Intel)
- Open the DMG and drag `Node Janitor.app` to Applications
- If you downloaded `.zip`, you may need to right-click "Open" on first launch

#### 🪟 **Windows**

- Download the `.exe` installer
- Run the installer and follow the setup wizard
- Launch from Start Menu or Desktop shortcut

#### 🐧 **Linux**

- **Debian/Ubuntu**: Download the `.deb` file and install with `sudo dpkg -i <filename>.deb`
- **Red Hat/Fedora**: Download the `.rpm` file and install with `sudo rpm -i <filename>.rpm`
- Or use your distribution's package manager

### System Requirements

**Minimum Requirements:**

- **macOS**: 10.15 (Catalina) or later
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 18.04+ / Debian 10+ / Fedora 32+ or equivalent
- **RAM**: 512 MB available memory
- **Disk**: 200 MB free space for installation

**Recommended:**

- **RAM**: 1 GB or more for better performance with large projects
- **Disk**: 500 MB free space

### Build from Source

**Prerequisites:**

- Node.js (>= 20.0.0)
- Yarn package manager

```bash
# Clone the repository
git clone https://github.com/duanzheng/node-janitor.git
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

## 🚀 Release Process

This project uses automated releases via GitHub Actions:

### Automated Releases

- **Trigger**: Push a version tag (e.g., `v1.2.3`) to trigger automated builds
- **Cross-Platform**: Automatically builds for macOS, Windows, and Linux
- **Distribution**: Creates installers and packages for all platforms
- **GitHub Release**: Automatically publishes to GitHub Releases with generated notes

### Creating a New Release

```bash
# Update version in package.json
yarn version --patch   # or --minor / --major

# Push commit and tag
git push origin main --follow-tags
```

The GitHub Actions workflow will:

1. ✅ Run tests on all platforms
2. 🏗️ Build applications for macOS (Intel + Apple Silicon), Windows, and Linux
3. 🔏 Sign & Notarize macOS builds when credentials are provided
4. 📦 Create platform-specific installers (DMG/ZIP/EXE/DEB/RPM)
5. 🚀 Publish to GitHub Releases automatically

### macOS Signing & Notarization (CI)

Set these repository secrets to enable automatic signing & notarization:

- `APPLE_ID`: Apple ID email
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password
- `APPLE_TEAM_ID`: Developer Team ID
- `CSC_NAME`: Certificate common name, e.g. `Developer ID Application: Your Name (TEAMID)`
- `MAC_CERT_P12` (optional): Base64-encoded `Developer ID Application` certificate
- `MAC_CERT_PASSWORD` (optional): Password for P12

Notes:

- When `APPLE_*` and `CSC_NAME` are present, the build will be signed with hardened runtime and sent for notarization. The workflow will staple tickets to DMG/APP.
- If you do not provide credentials, macOS artifacts will still be built but may be blocked by Gatekeeper when downloaded from the internet.

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
- GitHub: [@duanzheng](https://github.com/duanzheng)

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- UI powered by [Ant Design](https://ant.design/)
- Icons from [Ant Design Icons](https://ant.design/components/icon/)

---

<div align="center">

**If Node Janitor helped you reclaim disk space, please give it a ⭐!**

</div>
