#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${1:-Night Watch publish failed}"
SAFE_MESSAGE="${MESSAGE//$'\n'/ }"
TITLE="Mission Control Alert"
LOG_DIR="/Users/rj/.openclaw/workspace/night-watch/logs"
mkdir -p "$LOG_DIR"

# macOS local notification (primary reliable path)
/usr/bin/osascript -e 'display notification (item 1 of argv) with title (item 2 of argv)' "$SAFE_MESSAGE" "$TITLE" >/dev/null 2>&1 || true

# Local durable fallback log
echo "$(date '+%Y-%m-%d %H:%M:%S %Z') FAILURE ${SAFE_MESSAGE}" >> "$LOG_DIR/notifications.log"

# OpenClaw wake event (best effort; may fail if local CLI pairing is broken)
if command -v openclaw >/dev/null 2>&1; then
  openclaw system event --text "Night Watch publish failure: ${SAFE_MESSAGE}" --mode now >/dev/null 2>&1 || true
fi

echo "Failure alert sent: ${SAFE_MESSAGE}"
