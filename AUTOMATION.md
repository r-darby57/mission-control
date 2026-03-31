# Mission Control Automation

## Best current automation

The safest useful automation path is:
1. Sync latest Night Watch + Mission Swarm snapshots into `src/data/`
2. Commit only when snapshot data changed
3. Push to GitHub
4. Deploy to Fly

This avoids:
- empty commits
- pointless deploys
- surprise releases when nothing changed
- manual copy/paste deployment loops

## Commands

### Manual safe deploy
```bash
npm run deploy:fly
```

### Smart automation
```bash
bash scripts/auto-sync-commit-deploy.sh
```

What it does:
- syncs latest snapshot files
- checks whether snapshot JSON actually changed
- if no changes: exits cleanly
- if changed: commits, pushes, deploys

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

Run Night Watch first, then run automation.

Example sequence:
```bash
cd /Users/rj/.openclaw/workspace/night-watch && python3 night_watch.py
cd /Users/rj/.openclaw/workspace/mission-control && bash scripts/auto-sync-commit-deploy.sh
```

## Safety notes
- This automation only stages/commits snapshot files in `src/data/`
- It does not auto-stage unrelated work
- It skips deploy if there is no snapshot change
- It is best for production snapshot publishing, not arbitrary code releases
