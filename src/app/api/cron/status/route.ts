import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { NextResponse } from 'next/server'

const execFileAsync = promisify(execFile)

export async function GET() {
  try {
    const { stdout } = await execFileAsync('openclaw', ['cron', 'list', '--json'], {
      cwd: '/Users/rj/.openclaw/workspace',
      timeout: 15000,
      maxBuffer: 1024 * 1024,
    })

    return NextResponse.json(JSON.parse(stdout))
  } catch (error: any) {
    return NextResponse.json(
      {
        jobs: [],
        error: error?.message || 'Failed to read cron status',
      },
      { status: 500 }
    )
  }
}
