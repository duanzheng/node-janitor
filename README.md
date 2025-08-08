## 🧹 Node Janitor

Free disk space fast: bulk‑clean `node_modules` and package manager caches.

[Download Latest Release](https://github.com/duanzheng/node-janitor/releases/latest)

### Why Node Janitor

- **Project cleanup**: Scan folders, list projects, bulk‑delete `node_modules`
- **Cache cleanup**: Detect and clean npm / yarn / pnpm caches
- **Space insight**: See estimated space to reclaim before cleaning
- **Safe by default**: Confirmation before destructive actions

### Install

- **macOS (recommended)**: one‑line installer that downloads the latest DMG, mounts, installs to Applications, removes quarantine, and launches the app

  ```bash
  curl -fsSL https://raw.githubusercontent.com/duanzheng/node-janitor/main/scripts/install-macos.sh -o /tmp/install-node-janitor.sh
  bash /tmp/install-node-janitor.sh
  ```

  The script auto‑detects Apple Silicon vs Intel and picks the right artifact.

- **Windows**: download the `.exe` from the [latest release](https://github.com/duanzheng/node-janitor/releases/latest)
- **Linux**: download the `.deb` or `.rpm` from the [latest release](https://github.com/duanzheng/node-janitor/releases/latest)

### Use

- **Project Cleaner**: choose a folder → scan → select projects → clean `node_modules`
- **Cache Manager**: detect npm/yarn/pnpm → select caches → confirm clean

### Developer quick start

```bash
# Clone & install
git clone https://github.com/duanzheng/node-janitor.git
cd node-janitor && yarn install

# Start dev
yarn dev

# Build distributables
yarn make
```

### License

MIT
