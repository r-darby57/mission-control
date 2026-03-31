#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
STAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
FORCE_DEPLOY="${FORCE_DEPLOY:-0}"
SKIP_PUSH="${SKIP_PUSH:-0}"
SKIP_DEPLOY="${SKIP_DEPLOY:-0}"
VERIFY_DEPLOY="${VERIFY_DEPLOY:-1}"
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

trap 'fail "Pipeline failed while: ${LAST_ACTION}"' ERR

record_status "started" "Night Watch publish pipeline started"

LAST_ACTION="syncing latest Night Watch snapshots"
log "Syncing latest Night Watch snapshots"
node scripts/sync-night-watch-snapshots.mjs

SNAPSHOT_FILES=(
  "src/data/night-watch-state.json"
  "src/data/night-watch-trends.json"
  "src/data/mission-swarm-state.json"
  "src/data/mission-swarm-recommendations.json"
)

if git diff --quiet -- "${SNAPSHOT_FILES[@]}" && [ "$FORCE_DEPLOY" != "1" ]; then
  log "No snapshot changes detected. Skipping commit/push/deploy."
  record_status "noop" "No snapshot changes detected"
  exit 0
fi

LAST_ACTION="staging snapshot files"
log "Snapshot changes detected"
git add "${SNAPSHOT_FILES[@]}"

LAST_ACTION="creating git commit"
git commit -m "Update Night Watch snapshots (${STAMP})" || {
  log "Nothing to commit after staging. Exiting."
  record_status "noop" "Nothing to commit after staging snapshot files"
  exit 0
}

if [ "$SKIP_PUSH" = "1" ]; then
  log "SKIP_PUSH=1 set. Commit created locally; not pushing."
  record_status "committed" "Snapshot commit created locally; push skipped"
  exit 0
fi

LAST_ACTION="pushing snapshot update"
log "Pushing snapshot update to origin/${BRANCH}"
git push origin "HEAD:${BRANCH}"

if [ "$SKIP_DEPLOY" = "1" ]; then
  log "SKIP_DEPLOY=1 set. Push complete; not deploying."
  record_status "pushed" "Snapshot update pushed; deploy skipped"
  exit 0
fi

LAST_ACTION="deploying to Fly"
log "Deploying snapshot-backed Mission Control to Fly"
fly deploy

if [ "$VERIFY_DEPLOY" = "1" ]; then
  LAST_ACTION="verifying production deploy"
  log "Verifying production snapshot freshness"
  node scripts/verify-night-watch-deploy.mjs
fi

LAST_ACTION="complete"
record_status "success" "Snapshot publish and deploy completed successfully"
notify_success "Night Watch publish succeeded and production verified"
log "Automation complete"
