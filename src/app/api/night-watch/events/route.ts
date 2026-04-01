import { NextResponse } from 'next/server'
import { readSwarmEvents } from '@/lib/night-watch-store'

export async function GET() {
  const events = await readSwarmEvents(50)
  return NextResponse.json({ items: events })
}
