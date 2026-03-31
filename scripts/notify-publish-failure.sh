#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${1:-Night Watch publish failed}"
SAFE_MESSAGE="${MESSAGE//$'\n'/ }"
TITLE="Mission Control Alert"

# macOS local notification (best effort)
/usr/bin/osascript -e 'display notification (item 1 of argv) with title (item 2 of argv)' "$SAFE_MESSAGE" "$TITLE" >/dev/null 2>&1 || true

# OpenClaw wake event (best effort)
if command -v openclaw >/dev/null 2>&1; then
  openclaw system event --text "Night Watch publish failure: ${SAFE_MESSAGE}" --mode now >/dev/null 2>&1 || true
fi

echo "Failure alert sent: ${SAFE_MESSAGE}"
