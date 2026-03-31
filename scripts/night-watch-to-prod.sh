#!/usr/bin/env bash
set -euo pipefail

WORKSPACE_ROOT="/Users/rj/.openclaw/workspace"

cd "$WORKSPACE_ROOT/night-watch"
python3 night_watch.py

cd "$WORKSPACE_ROOT/mission-control"
bash scripts/auto-sync-commit-deploy.sh
