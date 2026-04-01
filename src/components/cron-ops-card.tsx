'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock3, ShieldAlert, CheckCircle2, TimerReset } from 'lucide-react'

interface CronJob {
  id: string
  name: string
  description?: string
  enabled: boolean
  schedule?: {
    kind?: string
    expr?: string
    tz?: string
  }
  state?: {
    nextRunAtMs?: number
    lastRunAtMs?: number
    lastRunStatus?: string
    lastStatus?: string
    lastDurationMs?: number
    consecutiveErrors?: number
  }
  failureAlert?: {
    after?: number
    cooldownMs?: number
  }
}

interface CronStatusPayload {
  jobs: CronJob[]
  total?: number
  error?: string
}

function formatTime(ms?: number) {
  if (!ms) return '—'
  return new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDuration(ms?: number) {
  if (!ms) return '—'
  const sec = Math.round(ms / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  const rem = sec % 60
  return rem === 0 ? `${min}m` : `${min}m ${rem}s`
}

export function CronOpsCard() {
  const [data, setData] = useState<CronStatusPayload>({ jobs: [] })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/cron/status')
        const json = await res.json()
        setData(json)
      } catch {
        setData({ jobs: [], error: 'Failed to load cron status' })
      }
    }

    load()
  }, [])

  const summary = useMemo(() => {
    const jobs = data.jobs || []
    return {
      total: jobs.length,
      healthy: jobs.filter((job) => job.state?.lastStatus === 'ok').length,
      failing: jobs.filter((job) => (job.state?.consecutiveErrors || 0) > 0 || job.state?.lastStatus === 'error').length,
      nextRun: jobs
        .map((job) => job.state?.nextRunAtMs)
        .filter((value): value is number => typeof value === 'number')
        .sort((a, b) => a - b)[0],
    }
  }, [data.jobs])

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-cyan-400">⏱️ CRON OPS</h2>
        <div className="flex items-center gap-2 text-sm text-cyan-300">
          <Clock3 className="w-4 h-4" />
          <span>{summary.total} jobs</span>
        </div>
      </div>

      {data.error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{data.error}</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">{summary.healthy}</div>
              <div className="text-xs text-slate-400">Healthy</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-400">{summary.failing}</div>
              <div className="text-xs text-slate-400">Failing</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-3 text-center">
              <div className="text-sm font-bold text-blue-300">{summary.nextRun ? formatTime(summary.nextRun) : '—'}</div>
              <div className="text-xs text-slate-400">Next Run</div>
            </div>
          </div>

          <div className="space-y-3">
            {data.jobs.map((job) => {
              const isOk = job.state?.lastStatus === 'ok'
              const hasErrors = (job.state?.consecutiveErrors || 0) > 0 || job.state?.lastStatus === 'error'
              return (
                <div key={job.id} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="text-sm font-semibold text-white">{job.name}</div>
                      <div className="text-xs text-slate-400">{job.description || 'No description'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasErrors ? <ShieldAlert className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      <span className={`text-xs font-mono ${isOk ? 'text-green-400' : 'text-red-400'}`}>{job.state?.lastStatus || 'unknown'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div>
                      <div className="text-slate-500">Last run</div>
                      <div>{formatTime(job.state?.lastRunAtMs)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Duration</div>
                      <div>{formatDuration(job.state?.lastDurationMs)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Next run</div>
                      <div>{formatTime(job.state?.nextRunAtMs)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Failure alert</div>
                      <div className="flex items-center gap-1"><TimerReset className="w-3 h-3 text-slate-500" />after {job.failureAlert?.after ?? '—'}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
