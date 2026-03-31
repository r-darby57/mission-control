#!/usr/bin/env bash
set -euo pipefail

export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="/Users/rj"

WORKSPACE_ROOT="/Users/rj/.openclaw/workspace"
LOG_DIR="$WORKSPACE_ROOT/night-watch/logs"
mkdir -p "$LOG_DIR"

{
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] launchd wrapper start"
  cd "$WORKSPACE_ROOT/mission-control"
  export NIGHT_WATCH_PUBLISH_TOKEN="mc_live_publish_39d11b528ee90a9b110c0db9cbed81ebfdab34aa3a01c59d"
  export NIGHT_WATCH_PUBLISH_URL="https://mission-control-ryan.fly.dev/api/night-watch/publish"
  bash scripts/night-watch-to-live-prod.sh
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] launchd wrapper complete"
} >> "$LOG_DIR/launchd.out.log" 2>> "$LOG_DIR/launchd.err.log"
