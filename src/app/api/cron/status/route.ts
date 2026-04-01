import { NextResponse } from 'next/server'
import { getNightWatchData } from '@/lib/night-watch-data'

export async function GET() {
  const { cronStatus, meta } = await getNightWatchData()
  return NextResponse.json({
    ...((cronStatus as Record<string, unknown>) ?? { jobs: [] }),
    _meta: meta,
  })
}
