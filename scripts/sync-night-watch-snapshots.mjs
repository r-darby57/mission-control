import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const workspaceRoot = path.resolve(projectRoot, '..')
const sourceRoot = path.join(workspaceRoot, 'night-watch')
const targetRoot = path.join(projectRoot, 'src', 'data')

const fileMap = [
  ['state.json', 'night-watch-state.json'],
  ['trends.json', 'night-watch-trends.json'],
  [path.join('mission-swarm', 'state.json'), 'mission-swarm-state.json'],
  [path.join('mission-swarm', 'recommendations.json'), 'mission-swarm-recommendations.json'],
]

async function copyJson(relativeSource, targetName) {
  const sourcePath = path.join(sourceRoot, relativeSource)
  const targetPath = path.join(targetRoot, targetName)
  const raw = await readFile(sourcePath, 'utf8')
  const parsed = JSON.parse(raw)
  await writeFile(targetPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8')
  return { sourcePath, targetPath }
}

async function main() {
  await mkdir(targetRoot, { recursive: true })
  const results = []

  for (const [relativeSource, targetName] of fileMap) {
    results.push(await copyJson(relativeSource, targetName))
  }

  console.log('Synced Night Watch snapshots:')
  for (const result of results) {
    console.log(`- ${path.relative(projectRoot, result.targetPath)} <= ${path.relative(workspaceRoot, result.sourcePath)}`)
  }
}

main().catch((error) => {
  console.error('Failed to sync Night Watch snapshots.')
  console.error(error)
  process.exit(1)
})
