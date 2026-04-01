#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

JOB_NAME="${1:-manual-cron-test}"
DETAIL="${2:-cron audit test triggered}"

node scripts/log-cron-audit.mjs "$JOB_NAME" "started" "$DETAIL"
/usr/bin/osascript -e 'display notification (item 1 of argv) with title (item 2 of argv)' "${DETAIL}" "Mission Control Cron Audit" >/dev/null 2>&1 || true
node scripts/log-cron-audit.mjs "$JOB_NAME" "completed" "$DETAIL"
