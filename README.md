## 🧹 Node Janitor

A tiny desktop tool to reclaim disk space by cleaning `node_modules` and package manager caches.

[Download Latest Release](https://github.com/duanzheng/node-janitor/releases/latest)

### ✨ Features

- **Project Cleaner**: Scan folders, list projects, bulk-delete `node_modules`
- **Cache Manager**: Detect and clean npm/yarn/pnpm caches
- **Space Insight**: Estimate reclaimable space before cleaning
- **Safe by default**: Confirmation before destructive actions

### 📦 Install

- **macOS（最快捷）**: 一键下载安装并自动处理隔离标记

  ```bash
  curl -fsSL https://raw.githubusercontent.com/duanzheng/node-janitor/main/scripts/install-macos.sh -o /tmp/install-node-janitor.sh
  bash /tmp/install-node-janitor.sh
  ```

  说明：脚本会自动识别芯片架构（Apple Silicon/Intel）、下载最新 DMG、挂载、复制到“应用程序”，并清理 `com.apple.quarantine` 后直接打开应用。

- **Windows**: 从 [Releases](https://github.com/duanzheng/node-janitor/releases/latest) 下载 `.exe` 并安装
- **Linux**: 从 [Releases](https://github.com/duanzheng/node-janitor/releases/latest) 下载 `.deb` 或 `.rpm` 并安装

### 🖥️ Usage

- **Project Cleaner**: 选择需要扫描的目录 → 扫描 → 勾选项目 → 清理 `node_modules`
- **Cache Manager**: 一键检测 npm/yarn/pnpm 缓存 → 选择要清理的缓存 → 确认清理

### 🛠️ Development

```bash
# Clone & install
git clone https://github.com/duanzheng/node-janitor.git
cd node-janitor && yarn install

# Start dev
yarn dev

# Build distributables
yarn make
```

### 📄 License

MIT
