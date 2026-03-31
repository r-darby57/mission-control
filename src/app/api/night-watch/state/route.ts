import { NextResponse } from 'next/server'
import { getNightWatchData } from '@/lib/night-watch-data'

export async function GET() {
  const { state, meta } = getNightWatchData()
  return NextResponse.json({ ...((state as Record<string, unknown>) ?? {}), _meta: meta })
}
