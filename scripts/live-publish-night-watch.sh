#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PUBLISH_TOKEN="${NIGHT_WATCH_PUBLISH_TOKEN:-}"
PUBLISH_URL="${NIGHT_WATCH_PUBLISH_URL:-https://mission-control-ryan.fly.dev/api/night-watch/publish}"
LAST_ACTION="started"

log() {
  echo "[$(date '+%H:%M:%S')] $*"
}

record_status() {
  local status="$1"
  local detail="$2"
  node scripts/log-publish-status.mjs "$status" "$detail" >/dev/null 2>&1 || true
}

notify_failure() {
  local message="$1"
  bash scripts/notify-publish-failure.sh "$message" >/dev/null 2>&1 || true
}

notify_success() {
  local message="$1"
  bash scripts/notify-publish-success.sh "$message" >/dev/null 2>&1 || true
}

fail() {
  local message="$1"
  log "ERROR: $message"
  record_status "failure" "$message"
  notify_failure "$message"
  exit 1
}

trap 'fail "Live publish pipeline failed while: ${LAST_ACTION}"' ERR

if [ -z "$PUBLISH_TOKEN" ]; then
  fail "NIGHT_WATCH_PUBLISH_TOKEN is not set"
fi

record_status "started" "Night Watch live publish started"

LAST_ACTION="publishing live Night Watch data"
log "Publishing live Night Watch data to production"
NIGHT_WATCH_PUBLISH_TOKEN="$PUBLISH_TOKEN" NIGHT_WATCH_PUBLISH_URL="$PUBLISH_URL" node scripts/publish-live-night-watch.mjs

LAST_ACTION="verifying live Night Watch publish"
log "Verifying live publish freshness"
VERIFY_URL="https://mission-control-ryan.fly.dev/api/night-watch/state" \
VERIFY_LOCAL_STATE_PATH="/Users/rj/.openclaw/workspace/night-watch/state.json" \
node scripts/verify-night-watch-deploy.mjs

LAST_ACTION="complete"
record_status "success" "Night Watch live publish completed successfully"
notify_success "Night Watch live publish succeeded and production verified"
log "Live publish complete"
