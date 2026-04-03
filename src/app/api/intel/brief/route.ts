import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const workspaceRoot = path.resolve(process.cwd(), '..')

export async function GET() {
  try {
    const filePath = path.join(workspaceRoot, 'memory', 'intel-brief.json')
    const raw = await readFile(filePath, 'utf8')
    const intel = JSON.parse(raw)
    return NextResponse.json(intel)
  } catch {
    return NextResponse.json({
      updatedAt: null,
      items: [],
    })
  }
}
