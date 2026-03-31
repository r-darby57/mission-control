#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Syncing Night Watch snapshots"
node scripts/sync-night-watch-snapshots.mjs

echo "==> Building Mission Control"
npm run build

echo "==> Deploying to Fly"
fly deploy "$@"
