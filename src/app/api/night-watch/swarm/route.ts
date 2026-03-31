import { NextResponse } from 'next/server'
import swarmState from '@/data/mission-swarm-state.json'
import recommendations from '@/data/mission-swarm-recommendations.json'

export async function GET() {
  return NextResponse.json({
    state: swarmState,
    recommendations,
  })
}
