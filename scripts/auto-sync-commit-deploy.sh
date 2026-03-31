#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
STAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
FORCE_DEPLOY="${FORCE_DEPLOY:-0}"
SKIP_PUSH="${SKIP_PUSH:-0}"
SKIP_DEPLOY="${SKIP_DEPLOY:-0}"

log() {
  echo "[$(date '+%H:%M:%S')] $*"
}

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
  exit 0
fi

log "Snapshot changes detected"
git add "${SNAPSHOT_FILES[@]}"

git commit -m "Update Night Watch snapshots (${STAMP})" || {
  log "Nothing to commit after staging. Exiting."
  exit 0
}

if [ "$SKIP_PUSH" = "1" ]; then
  log "SKIP_PUSH=1 set. Commit created locally; not pushing."
  exit 0
fi

log "Pushing snapshot update to origin/${BRANCH}"
git push origin "HEAD:${BRANCH}"

if [ "$SKIP_DEPLOY" = "1" ]; then
  log "SKIP_DEPLOY=1 set. Push complete; not deploying."
  exit 0
fi

log "Deploying snapshot-backed Mission Control to Fly"
fly deploy

log "Automation complete"
