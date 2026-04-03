import { readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const workspaceRoot = path.resolve(projectRoot, '..')

const publishUrl = process.env.NIGHT_WATCH_PUBLISH_URL || 'https://mission-control-ryan.fly.dev/api/night-watch/publish'
const publishToken = process.env.NIGHT_WATCH_PUBLISH_TOKEN

if (!publishToken) {
  console.error('NIGHT_WATCH_PUBLISH_TOKEN is required for live publish.')
  process.exit(1)
}

async function loadJson(relativePath) {
  const fullPath = path.join(workspaceRoot, relativePath)
  return JSON.parse(await readFile(fullPath, 'utf8'))
}

async function loadCronStatus() {
  try {
    const { stdout } = await execFileAsync('openclaw', ['cron', 'list', '--json'], {
      cwd: workspaceRoot,
      timeout: 15000,
      maxBuffer: 1024 * 1024,
    })
    return JSON.parse(stdout)
  } catch (error) {
    return {
      jobs: [],
      error: error instanceof Error ? error.message : 'Failed to read cron status',
    }
  }
}

const state = await loadJson(path.join('night-watch', 'state.json'))
const swarmState = await loadJson(path.join('night-watch', 'mission-swarm', 'state.json'))

const payload = {
  state,
  trends: await loadJson(path.join('night-watch', 'trends.json')),
  swarmState,
  swarmRecommendations: await loadJson(path.join('night-watch', 'mission-swarm', 'recommendations.json')),
  cronStatus: await loadCronStatus(),
}

const response = await fetch(publishUrl, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    authorization: `Bearer ${publishToken}`,
  },
  body: JSON.stringify(payload),
})

if (!response.ok) {
  const body = await response.text()
  console.error(`Live publish failed: HTTP ${response.status} ${body}`)
  process.exit(1)
}

const result = await response.json()
console.log(JSON.stringify({
  ...result,
  expectedNightWatchLastRun: state.lastRun ?? null,
  expectedSwarmLastRun: swarmState.lastRun ?? null,
}, null, 2))
