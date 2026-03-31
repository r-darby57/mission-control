import { NextResponse } from 'next/server'
import { getNightWatchData } from '@/lib/night-watch-data'

export async function GET() {
  const { swarmState, swarmRecommendations, meta } = await getNightWatchData()
  return NextResponse.json({
    state: swarmState,
    recommendations: swarmRecommendations,
    _meta: meta,
  })
}
