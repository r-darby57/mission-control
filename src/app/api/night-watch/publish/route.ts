import { NextRequest, NextResponse } from 'next/server'
import { setLiveStore } from '@/data/live-night-watch-store'

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

  setLiveStore({
    state: body.state ?? null,
    trends: body.trends ?? null,
    swarmState: body.swarmState ?? null,
    swarmRecommendations: body.swarmRecommendations ?? null,
    updatedAt: new Date().toISOString(),
    source: 'live-publish',
  })

  return NextResponse.json({
    ok: true,
    source: 'live-publish',
    updatedAt: new Date().toISOString(),
  })
}
