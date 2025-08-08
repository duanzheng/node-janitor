## 🧹 Node Janitor

让开发者快速释放磁盘空间的桌面工具：批量清理 `node_modules` 与包管理器缓存。

A tiny desktop tool to reclaim disk space by cleaning `node_modules` and package manager caches.

[Download Latest Release](https://github.com/duanzheng/node-janitor/releases/latest)

### 面向用户：为什么用它

- **一键清理项目依赖**：扫描文件夹、列出项目、批量删除 `node_modules`
- **清理包管理器缓存**：支持 npm / yarn / pnpm
- **可见的空间收益**：清理前展示可回收空间
- **默认安全**：删除前需确认，避免误操作

### 安装（用户最关心）

- **macOS（推荐）**：一键下载安装，并自动处理隔离标记

  ```bash
  curl -fsSL https://raw.githubusercontent.com/duanzheng/node-janitor/main/scripts/install-macos.sh -o /tmp/install-node-janitor.sh
  bash /tmp/install-node-janitor.sh
  ```

  说明：脚本会自动识别芯片架构（Apple Silicon/Intel）、下载最新 DMG、挂载、复制到“应用程序”，并清理 `com.apple.quarantine` 后直接打开应用。

- **Windows**: 从 [Releases](https://github.com/duanzheng/node-janitor/releases/latest) 下载 `.exe` 并安装
- **Linux**: 从 [Releases](https://github.com/duanzheng/node-janitor/releases/latest) 下载 `.deb` 或 `.rpm` 并安装

### 使用（两分钟上手）

- **项目清理**：选择目录 → 扫描 → 勾选项目 → 清理 `node_modules`
- **缓存清理**：自动检测 npm/yarn/pnpm → 选择要清理的缓存 → 确认

### 面向开发者：快速上手

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
