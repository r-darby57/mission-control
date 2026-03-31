import { NextResponse } from 'next/server'
import { getNightWatchData } from '@/lib/night-watch-data'

export async function GET() {
  const { trends, meta } = await getNightWatchData()
  return NextResponse.json({ ...((trends as Record<string, unknown>) ?? {}), _meta: meta })
}
