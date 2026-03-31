type LiveStorePayload = {
  state: unknown
  trends: unknown
  swarmState: unknown
  swarmRecommendations: unknown
  updatedAt: string
  source: string
}

declare global {
  // eslint-disable-next-line no-var
  var __nightWatchLiveStore: LiveStorePayload | undefined
}

const fallbackPayload: LiveStorePayload = {
  state: null,
  trends: null,
  swarmState: null,
  swarmRecommendations: null,
  updatedAt: '',
  source: 'snapshot',
}

export function getLiveStore(): LiveStorePayload {
  return globalThis.__nightWatchLiveStore ?? fallbackPayload
}

export function setLiveStore(payload: LiveStorePayload) {
  globalThis.__nightWatchLiveStore = payload
}
