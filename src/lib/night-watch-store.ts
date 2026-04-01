import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises'
import path from 'node:path'

const STORE_DIR = process.env.NIGHT_WATCH_STORE_DIR || '/data/night-watch'
const STORE_PATH = path.join(STORE_DIR, 'live-state.json')
const EVENTS_PATH = path.join(STORE_DIR, 'swarm-events.jsonl')

type LiveStorePayload = {
  state: unknown
  trends: unknown
  swarmState: unknown
  swarmRecommendations: unknown
  cronStatus?: unknown
  updatedAt: string
  source: string
}

export type SwarmEventRecord = {
  ts: string
  source: string
  nightWatchLastRun?: string | null
  swarmLastRun?: string | null
  swarmStatus?: string | null
  topRecommendationTitle?: string | null
  topRecommendationScore?: number | null
  consensusAverage?: number | null
  consensusSpread?: number | null
  safeBuilderStatus?: string | null
  safeBuilderSummary?: string | null
  safeBuilderValidation?: string | null
  safeBuilderScope?: string[]
  roleOutputs?: Record<string, unknown>
}

const fallbackPayload: LiveStorePayload = {
  state: null,
  trends: null,
  swarmState: null,
  swarmRecommendations: null,
  cronStatus: { jobs: [] },
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

export async function appendSwarmEvent(event: SwarmEventRecord) {
  await mkdir(STORE_DIR, { recursive: true })
  await appendFile(EVENTS_PATH, `${JSON.stringify(event)}\n`, 'utf8')
}

export async function readSwarmEvents(limit = 50): Promise<SwarmEventRecord[]> {
  try {
    const raw = await readFile(EVENTS_PATH, 'utf8')
    return raw
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SwarmEventRecord)
      .slice(-limit)
      .reverse()
  } catch {
    return []
  }
}

export { STORE_DIR, STORE_PATH, EVENTS_PATH }
