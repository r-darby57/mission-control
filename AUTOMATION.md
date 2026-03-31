# Mission Control Automation

## Best current automation

The best current production path is now:
1. Run Night Watch locally
2. Publish Night Watch + Mission Swarm data directly to production API
3. Verify production reflects the new `lastRun`
4. Log status + send success/failure signals

This avoids:
- empty commits
- pointless deploys
- surprise releases when nothing changed
- using code releases as a data transport mechanism

## Commands

### Manual safe deploy
```bash
npm run deploy:fly
```

### Live publish automation
```bash
npm run live:publish
```

### End-to-end Night Watch → live production
```bash
npm run nightwatch:live
```

What the live path does:
- reads latest local Night Watch + Mission Swarm JSON
- publishes directly to production API
- verifies production reflects the latest `lastRun`
- writes a status line to `night-watch/logs/publish-status.jsonl`
- sends success/failure signals

### Legacy snapshot/deploy automation
```bash
npm run auto:publish
```

Use this for fallback or when you intentionally want to refresh the checked-in snapshot/deploy path.

## Optional environment flags

### Commit only, no push
```bash
SKIP_PUSH=1 bash scripts/auto-sync-commit-deploy.sh
```

### Push but do not deploy
```bash
SKIP_DEPLOY=1 bash scripts/auto-sync-commit-deploy.sh
```

### Force a deploy even if snapshots did not change
```bash
FORCE_DEPLOY=1 bash scripts/auto-sync-commit-deploy.sh
```

## Recommended scheduler target

Run Night Watch first, then live publish.

Example sequence:
```bash
cd /Users/rj/.openclaw/workspace/night-watch && python3 night_watch.py
cd /Users/rj/.openclaw/workspace/mission-control && bash scripts/live-publish-night-watch.sh
```

## Verification, logging, and alerts

### Verify production snapshot freshness manually
```bash
npm run verify:deploy
```

### Publish status log
The pipeline appends structured status entries to:
```bash
/Users/rj/.openclaw/workspace/night-watch/logs/publish-status.jsonl
```

Status values include:
- `started`
- `noop`
- `committed`
- `pushed`
- `success`
- `failure`

### Failure alerting
On publish failure, the pipeline now attempts:
1. a macOS local notification
2. an OpenClaw wake event (`openclaw system event --mode now`)

On success, it sends a lightweight OpenClaw success event after production verification.

## Safety notes
- The live automation updates production data without a code deploy
- The legacy snapshot automation only stages/commits snapshot files in `src/data/`
- Legacy snapshot automation does not auto-stage unrelated work
- Live automation verifies production freshness by checking `lastRun`
- Both paths log success/failure/no-op status for auditability
- Use deploy-based publishing only for fallback or deliberate code releases
