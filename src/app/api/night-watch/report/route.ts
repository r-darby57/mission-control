import { NextResponse } from 'next/server'
import { getNightWatchData } from '@/lib/night-watch-data'

async function buildPreview() {
  const { state, swarmState, swarmRecommendations, meta } = await getNightWatchData()
  const typedState = (state as Record<string, any>) ?? {}
  const typedSwarmState = (swarmState as Record<string, any>) ?? {}
  const typedRecommendations = (swarmRecommendations as Record<string, any>) ?? {}

  const lines = [
    'Night Watch Morning Memo',
    `Status: ${typedState.lastStatus ?? 'unknown'}`,
    `Mode: ${typedState.currentMode ?? 'safe-internal'}`,
    `Source: ${meta.source ?? 'snapshot'}`,
    `Last task: ${typedState.lastTask?.type ?? 'none'} (${typedState.lastTask?.score ?? 'n/a'})`,
    '',
    'Findings:',
    ...(((typedState.lastTask?.findings ?? []) as string[]).map((finding) => `- ${finding}`)),
    '',
    `Recommendation: ${typedState.lastTask?.recommendation ?? 'No recommendation available.'}`,
    '',
    'Mission Swarm:',
    `Status: ${typedSwarmState.lastStatus ?? 'idle'}`,
    `Top recommendation: ${typedSwarmState.lastRecommendation?.title ?? 'None'}`,
    `Safe builder: ${typedSwarmState.lastSafeBuilderAction?.summary ?? 'Not ready'}`,
    '',
    'Top swarm queue:',
    ...((((typedRecommendations.items ?? []) as Array<Record<string, any>>).slice(0, 3)).map((item, idx) => `${idx + 1}. ${item.title} [${item.role}] score=${item.score ?? 'n/a'}`)),
  ]

  return {
    preview: lines.join('\n'),
    meta,
  }
}

export async function GET() {
  const { preview, meta } = await buildPreview()
  return NextResponse.json({
    preview,
    _meta: meta,
  })
}
