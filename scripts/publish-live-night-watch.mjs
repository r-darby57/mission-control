import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

const payload = {
  state: await loadJson(path.join('night-watch', 'state.json')),
  trends: await loadJson(path.join('night-watch', 'trends.json')),
  swarmState: await loadJson(path.join('night-watch', 'mission-swarm', 'state.json')),
  swarmRecommendations: await loadJson(path.join('night-watch', 'mission-swarm', 'recommendations.json')),
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
console.log(JSON.stringify(result, null, 2))
