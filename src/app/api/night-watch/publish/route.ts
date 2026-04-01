import { NextRequest, NextResponse } from 'next/server'
import { appendSwarmEvent, writeDurableNightWatchStore } from '@/lib/night-watch-store'

function buildSwarmEvent(body: any, updatedAt: string) {
  const roleOutputs = body?.swarmRecommendations?.roleOutputs || {}
  const scores = Object.values(roleOutputs)
    .map((item: any) => item?.score)
    .filter((score: unknown): score is number => typeof score === 'number')

  const consensusAverage = scores.length ? Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length) : null
  const consensusSpread = scores.length ? Math.max(...scores) - Math.min(...scores) : null

  return {
    ts: updatedAt,
    source: 'live-publish',
    nightWatchLastRun: body?.state?.lastRun ?? null,
    swarmLastRun: body?.swarmState?.lastRun ?? null,
    swarmStatus: body?.swarmState?.lastStatus ?? null,
    topRecommendationTitle: body?.swarmState?.lastRecommendation?.title ?? body?.swarmRecommendations?.topRecommendation?.title ?? null,
    topRecommendationScore: body?.swarmState?.lastRecommendation?.score ?? body?.swarmRecommendations?.topRecommendation?.score ?? null,
    consensusAverage,
    consensusSpread,
    safeBuilderStatus: body?.swarmState?.lastSafeBuilderAction?.status ?? null,
    safeBuilderSummary: body?.swarmState?.lastSafeBuilderAction?.summary ?? null,
    safeBuilderValidation: body?.swarmState?.lastSafeBuilderAction?.validation ?? null,
    safeBuilderScope: body?.swarmState?.lastSafeBuilderAction?.scope ?? [],
    roleOutputs,
  }
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.NIGHT_WATCH_PUBLISH_TOKEN

  if (!expectedToken) {
    return NextResponse.json({ error: 'Publish token not configured' }, { status: 503 })
  }

  const authHeader = request.headers.get('authorization') || ''
  const providedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!providedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const updatedAt = new Date().toISOString()

  await writeDurableNightWatchStore({
    state: body.state ?? null,
    trends: body.trends ?? null,
    swarmState: body.swarmState ?? null,
    swarmRecommendations: body.swarmRecommendations ?? null,
    cronStatus: body.cronStatus ?? { jobs: [] },
    updatedAt,
    source: 'live-publish',
  })

  await appendSwarmEvent(buildSwarmEvent(body, updatedAt))

  return NextResponse.json({
    ok: true,
    source: 'live-publish',
    updatedAt,
  })
}
