const baseUrl = process.env.VERIFY_BASE_URL || 'https://mission-control-ryan.fly.dev'
const expectedLastRun = process.env.EXPECTED_LAST_RUN

if (!expectedLastRun) {
  console.error('EXPECTED_LAST_RUN is required')
  process.exit(1)
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
  return res.json()
}

const state = await getJson(`${baseUrl}/api/night-watch/state`)
const store = await getJson(`${baseUrl}/api/night-watch/debug-store`)

console.log(JSON.stringify({
  apiLastRun: state.lastRun ?? null,
  storeLastRun: store?.state?.lastRun ?? null,
  apiUpdatedAt: state?._meta?.updatedAt ?? null,
  storeUpdatedAt: store?.updatedAt ?? null,
  expectedLastRun,
}, null, 2))

if ((state.lastRun ?? null) !== expectedLastRun || (store?.state?.lastRun ?? null) !== expectedLastRun) {
  console.error('Live publish verification mismatch')
  process.exit(1)
}
