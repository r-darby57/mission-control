import { NextResponse } from 'next/server'
import nightWatchState from '@/data/night-watch-state.json'
import swarmState from '@/data/mission-swarm-state.json'
import recommendations from '@/data/mission-swarm-recommendations.json'

function buildPreview() {
  const lines = [
    'Night Watch Morning Memo',
    `Status: ${nightWatchState.lastStatus ?? 'unknown'}`,
    `Mode: ${nightWatchState.currentMode ?? 'safe-internal'}`,
    `Last task: ${nightWatchState.lastTask?.type ?? 'none'} (${nightWatchState.lastTask?.score ?? 'n/a'})`,
    '',
    'Findings:',
    ...((nightWatchState.lastTask?.findings ?? []).map((finding) => `- ${finding}`)),
    '',
    `Recommendation: ${nightWatchState.lastTask?.recommendation ?? 'No recommendation available.'}`,
    '',
    'Mission Swarm:',
    `Status: ${swarmState.lastStatus ?? 'idle'}`,
    `Top recommendation: ${swarmState.lastRecommendation?.title ?? 'None'}`,
    `Safe builder: ${swarmState.lastSafeBuilderAction?.summary ?? 'Not ready'}`,
    '',
    'Top swarm queue:',
    ...((recommendations.items ?? []).slice(0, 3).map((item, idx) => `${idx + 1}. ${item.title} [${item.role}] score=${item.score ?? 'n/a'}`)),
  ]

  return lines.join('\n')
}

export async function GET() {
  return NextResponse.json({
    preview: buildPreview(),
  })
}
