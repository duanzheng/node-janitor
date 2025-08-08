#!/usr/bin/env bash
set -euo pipefail

# Node Janitor - macOS one-shot installer for unsigned builds
# - Detects CPU arch (arm64/x64)
# - Downloads the latest DMG from GitHub Releases
# - Mounts, copies to /Applications, removes quarantine, and opens the app

REPO="duanzheng/node-janitor"
APP_NAME="Node Janitor.app"
INSTALL_DIR="/Applications"
DMG_PATH="${TMPDIR:-/tmp}/node-janitor-installer.dmg"

info()  { printf "\033[1;34m[INFO]\033[0m %s\n"  "$*"; }
success(){ printf "\033[1;32m[SUCCESS]\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m[WARN]\033[0m %s\n"  "$*"; }
err()   { printf "\033[1;31m[ERROR]\033[0m %s\n" "$*"; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { err "Missing required command: $1"; exit 1; }
}

require_cmd curl
require_cmd hdiutil
require_cmd xattr
require_cmd awk
require_cmd grep

ARCH=$(uname -m)
case "$ARCH" in
  arm64|aarch64) TARGET_ARCH="arm64" ;;
  x86_64|amd64)  TARGET_ARCH="x64"   ;;
  *) warn "Unknown arch '$ARCH', defaulting to 'x64'"; TARGET_ARCH="x64" ;;
esac

info "Detected architecture: $TARGET_ARCH"

API_URL="https://api.github.com/repos/${REPO}/releases/latest"
info "Resolving latest release asset from $API_URL"

# Fetch all .dmg asset URLs from the latest release
ASSET_URLS=$(curl -fsSL -H "Accept: application/vnd.github+json" "$API_URL" | \
  grep -oE 'https://[^" ]+\.dmg') || true

if [ -z "$ASSET_URLS" ]; then
  err "No DMG assets found in the latest release."
  exit 1
fi

# Prefer exact-arch match; otherwise fall back to universal; otherwise pick the first DMG
URL=""
if [ "$TARGET_ARCH" = "arm64" ]; then
  URL=$(printf '%s\n' "$ASSET_URLS" | grep -Ei '(arm64|aarch64|universal)' | head -n1 || true)
else
  URL=$(printf '%s\n' "$ASSET_URLS" | grep -Ei '(x64|amd64|universal)' | head -n1 || true)
fi

if [ -z "$URL" ]; then
  warn "Could not find architecture-specific DMG; using the first DMG asset."
  URL=$(printf '%s\n' "$ASSET_URLS" | head -n1)
fi

info "Downloading: $URL"
curl -fL "$URL" -o "$DMG_PATH"

info "Mounting DMG..."
# Capture the volume mount point (last column containing /Volumes/...) 
ATTACH_OUT=$(hdiutil attach -nobrowse "$DMG_PATH")
VOLUME_PATH=$(printf '%s\n' "$ATTACH_OUT" | awk '/\/Volumes\// { vol=$NF } END { print vol }')
if [ -z "$VOLUME_PATH" ] || [ ! -d "$VOLUME_PATH" ]; then
  err "Failed to mount DMG. Output: $ATTACH_OUT"
  exit 1
fi
info "Mounted at: $VOLUME_PATH"

APP_SOURCE="$VOLUME_PATH/$APP_NAME"
if [ ! -d "$APP_SOURCE" ]; then
  err "Cannot find '$APP_NAME' inside DMG at: $VOLUME_PATH"
  hdiutil detach "$VOLUME_PATH" || true
  exit 1
fi

TARGET_PATH="$INSTALL_DIR/$APP_NAME"
info "Copying app to $INSTALL_DIR (may require password if not writable)..."
# Try to copy; if permission denied, re-run with sudo
if cp -R "$APP_SOURCE" "$INSTALL_DIR/" 2>/dev/null; then
  :
else
  warn "Permission denied; retrying with sudo"
  sudo cp -R "$APP_SOURCE" "$INSTALL_DIR/"
fi

info "Detaching DMG..."
hdiutil detach "$VOLUME_PATH" || warn "Failed to detach. You can eject it from Finder later."

info "Clearing quarantine attribute..."
if xattr -dr com.apple.quarantine "$TARGET_PATH" 2>/dev/null; then
  :
else
  warn "Failed to clear quarantine automatically; retrying with sudo"
  sudo xattr -dr com.apple.quarantine "$TARGET_PATH"
fi

success "Installed: $TARGET_PATH"
info "Launching application..."
open "$TARGET_PATH"
