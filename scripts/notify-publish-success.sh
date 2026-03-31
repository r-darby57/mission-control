#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${1:-Night Watch publish succeeded}"
SAFE_MESSAGE="${MESSAGE//$'\n'/ }"

if command -v openclaw >/dev/null 2>&1; then
  openclaw system event --text "${SAFE_MESSAGE}" --mode now >/dev/null 2>&1 || true
fi

echo "Success event sent: ${SAFE_MESSAGE}"
