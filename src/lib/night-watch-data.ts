import snapshotState from '@/data/night-watch-state.json'
import snapshotTrends from '@/data/night-watch-trends.json'
import snapshotSwarmState from '@/data/mission-swarm-state.json'
import snapshotSwarmRecommendations from '@/data/mission-swarm-recommendations.json'
import { readDurableNightWatchStore } from '@/lib/night-watch-store'

export async function getNightWatchData() {
  const live = await readDurableNightWatchStore()

  return {
    state: live.state ?? snapshotState,
    trends: live.trends ?? snapshotTrends,
    swarmState: live.swarmState ?? snapshotSwarmState,
    swarmRecommendations: live.swarmRecommendations ?? snapshotSwarmRecommendations,
    meta: {
      source: live.source || 'snapshot',
      updatedAt: live.updatedAt || null,
    },
  }
}
