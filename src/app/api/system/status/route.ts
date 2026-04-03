import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getNightWatchData } from '@/lib/night-watch-data'

const workspaceRoot = path.resolve(process.cwd(), '..')

async function readJson(relativePath: string) {
  try {
    const filePath = path.join(workspaceRoot, relativePath)
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function GET() {
  const [modelFailsafe, opsStatus, openLoops] = await Promise.all([
    readJson('model-failsafe/state.json'),
    readJson('ops-logs/status.json'),
    readJson('memory/open-loops.json'),
  ])

  const { cronStatus, meta, state, swarmState } = await getNightWatchData()
  const jobs = Array.isArray((cronStatus as any)?.jobs) ? (cronStatus as any).jobs : []
  const failingJobs = jobs.filter((job: any) => (job?.state?.consecutiveErrors || 0) > 0 || job?.state?.lastStatus === 'error').length
  const healthyJobs = jobs.filter((job: any) => job?.state?.lastStatus === 'ok').length
  const loopItems = Array.isArray(openLoops?.items) ? openLoops.items : []

  const systemStatus = {
    generatedAt: new Date().toISOString(),
    source: meta.source,
    updatedAt: meta.updatedAt,
    modelFailsafe: modelFailsafe
      ? {
          currentModel: modelFailsafe.currentModel ?? 'unknown',
          currentTier: modelFailsafe.currentTier ?? 'unknown',
          status: modelFailsafe.status ?? 'unknown',
          operatingMode: modelFailsafe.operatingMode ?? 'unknown',
          lastEvaluated: modelFailsafe.lastEvaluated ?? null,
          dailyRemainingPercent: modelFailsafe.dailyRemainingPercent ?? null,
          weeklyRemainingPercent: modelFailsafe.weeklyRemainingPercent ?? null,
          lastReason: modelFailsafe.lastReason ?? null,
        }
      : null,
    opsStatus: opsStatus
      ? {
          health: opsStatus.health ?? 'unknown',
          gatewayHealth: opsStatus.gatewayHealth ?? 'unknown',
          configHealth: opsStatus.configHealth ?? 'unknown',
          currentModel: opsStatus.currentModel ?? 'unknown',
          operatingMode: opsStatus.operatingMode ?? 'unknown',
          currentTier: opsStatus.currentTier ?? 'unknown',
          dailyRemainingPercent: opsStatus.dailyRemainingPercent ?? null,
          weeklyRemainingPercent: opsStatus.weeklyRemainingPercent ?? null,
          failoverReason: opsStatus.failoverReason ?? null,
          updatedAt: opsStatus.updatedAt ?? null,
        }
      : null,
    cron: {
      total: jobs.length,
      healthy: healthyJobs,
      failing: failingJobs,
      nextRunAtMs: jobs
        .map((job: any) => job?.state?.nextRunAtMs)
        .filter((value: unknown): value is number => typeof value === 'number')
        .sort((a: number, b: number) => a - b)[0] ?? null,
    },
    nightWatch: {
      lastRun: (state as any)?.lastRun ?? null,
      lastStatus: (state as any)?.lastStatus ?? 'unknown',
      currentMode: (state as any)?.currentMode ?? 'unknown',
    },
    missionSwarm: {
      lastRun: (swarmState as any)?.lastRun ?? null,
      lastStatus: (swarmState as any)?.lastStatus ?? 'unknown',
      topRecommendation: (swarmState as any)?.lastRecommendation?.title ?? null,
      safeBuilderStatus: (swarmState as any)?.lastSafeBuilderAction?.status ?? null,
    },
    openLoops: {
      updatedAt: openLoops?.updatedAt ?? null,
      total: loopItems.length,
      blocked: loopItems.filter((item: any) => item?.status === 'blocked').length,
      ready: loopItems.filter((item: any) => item?.status === 'ready').length,
      items: loopItems.slice(0, 5),
    },
  }

  return NextResponse.json(systemStatus)
}
