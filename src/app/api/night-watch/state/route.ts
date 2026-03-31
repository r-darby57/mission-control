import { NextResponse } from 'next/server'
import nightWatchState from '@/data/night-watch-state.json'

export async function GET() {
  return NextResponse.json(nightWatchState)
}
