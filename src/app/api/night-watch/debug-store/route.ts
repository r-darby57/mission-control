import { NextResponse } from 'next/server'
import { readDurableNightWatchStore } from '@/lib/night-watch-store'

export async function GET() {
  const store = await readDurableNightWatchStore()
  return NextResponse.json(store)
}
