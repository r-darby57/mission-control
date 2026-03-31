import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const STORE_DIR = process.env.NIGHT_WATCH_STORE_DIR || '/data/night-watch'
const STORE_PATH = path.join(STORE_DIR, 'live-state.json')

type LiveStorePayload = {
  state: unknown
  trends: unknown
  swarmState: unknown
  swarmRecommendations: unknown
  updatedAt: string
  source: string
}

const fallbackPayload: LiveStorePayload = {
  state: null,
  trends: null,
  swarmState: null,
  swarmRecommendations: null,
  updatedAt: '',
  source: 'snapshot',
}

export async function readDurableNightWatchStore(): Promise<LiveStorePayload> {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    return JSON.parse(raw) as LiveStorePayload
  } catch {
    return fallbackPayload
  }
}

export async function writeDurableNightWatchStore(payload: LiveStorePayload) {
  await mkdir(STORE_DIR, { recursive: true })
  await writeFile(STORE_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

export { STORE_DIR, STORE_PATH }
