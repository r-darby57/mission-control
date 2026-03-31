import { NextResponse } from 'next/server'
import trends from '@/data/night-watch-trends.json'

export async function GET() {
  return NextResponse.json(trends)
}
