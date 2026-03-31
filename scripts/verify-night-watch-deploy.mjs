import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const localStatePath = path.join(projectRoot, 'src', 'data', 'night-watch-state.json')
const productionUrl = process.env.VERIFY_URL || 'https://mission-control-ryan.fly.dev/api/night-watch/state'
const retries = Number(process.env.VERIFY_RETRIES || 18)
const delayMs = Number(process.env.VERIFY_DELAY_MS || 10000)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { 'cache-control': 'no-cache' },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`)
  }

  return response.json()
}

async function main() {
  const localState = JSON.parse(await readFile(localStatePath, 'utf8'))
  const expectedLastRun = localState.lastRun

  if (!expectedLastRun) {
    throw new Error('Local snapshot missing lastRun; cannot verify deploy.')
  }

  console.log(`Verifying production Night Watch state against expected lastRun=${expectedLastRun}`)

  let lastSeen = null
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const remoteState = await fetchJson(productionUrl)
      lastSeen = remoteState.lastRun ?? null
      console.log(`Attempt ${attempt}/${retries}: production lastRun=${lastSeen}`)

      if (lastSeen === expectedLastRun) {
        console.log('Verification passed: production matches local snapshot.')
        return
      }
    } catch (error) {
      console.log(`Attempt ${attempt}/${retries}: verification request failed: ${error.message}`)
    }

    if (attempt < retries) {
      await sleep(delayMs)
    }
  }

  throw new Error(`Verification failed. Expected lastRun=${expectedLastRun}, last seen production lastRun=${lastSeen}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
