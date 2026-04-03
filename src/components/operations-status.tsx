'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, Database, Shield, RadioTower, Workflow, BrainCircuit, Moon, CheckCircle2, AlertTriangle, ListTodo } from 'lucide-react'
import { CronOpsCard } from './cron-ops-card'

interface OpenLoopItem {
  id?: string
  title?: string
  status?: string
  priority?: string
  owner?: string
  area?: string
  summary?: string
  nextAction?: string
  lastUpdated?: string
}

interface SystemStatusPayload {
  generatedAt?: string
  source?: string
  updatedAt?: string | null
  modelFailsafe?: {
    currentModel?: string
    currentTier?: string
    status?: string
    operatingMode?: string
    lastEvaluated?: string | null
    dailyRemainingPercent?: number | null
    weeklyRemainingPercent?: number | null
    lastReason?: string | null
  } | null
  opsStatus?: {
    health?: string
    gatewayHealth?: string
    configHealth?: string
    currentModel?: string
    operatingMode?: string
    currentTier?: string
    dailyRemainingPercent?: number | null
    weeklyRemainingPercent?: number | null
    failoverReason?: string | null
    updatedAt?: string | null
  } | null
  cron?: {
    total?: number
    healthy?: number
    failing?: number
    nextRunAtMs?: number | null
  }
  nightWatch?: {
    lastRun?: string | null
    lastStatus?: string
    currentMode?: string
  }
  missionSwarm?: {
    lastRun?: string | null
    lastStatus?: string
    topRecommendation?: string | null
    safeBuilderStatus?: string | null
  }
  openLoops?: {
    updatedAt?: string | null
    total?: number
    blocked?: number
    ready?: number
    items?: OpenLoopItem[]
  }
}

const fallbackData: SystemStatusPayload = {
  source: 'unknown',
  modelFailsafe: null,
  opsStatus: null,
  cron: { total: 0, healthy: 0, failing: 0, nextRunAtMs: null },
  nightWatch: { lastRun: null, lastStatus: 'unknown', currentMode: 'unknown' },
  missionSwarm: { lastRun: null, lastStatus: 'unknown', topRecommendation: null, safeBuilderStatus: null },
  openLoops: { updatedAt: null, total: 0, blocked: 0, ready: 0, items: [] },
}

function formatTs(ts?: string | null) {
  if (!ts) return 'unknown'
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatNextRun(ms?: number | null) {
  if (!ms) return 'unknown'
  return new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function HealthPill({ healthy, label }: { healthy: boolean; label: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${healthy ? 'border-green-500/20 bg-green-500/10 text-green-300' : 'border-red-500/20 bg-red-500/10 text-red-300'}`}>
      {healthy ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
      {label}
    </div>
  )
}

export function OperationsStatus() {
  const [data, setData] = useState<SystemStatusPayload>(fallbackData)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/system/status')
        if (!res.ok) throw new Error('Failed to load system status')
        const json = await res.json()
        setData(json)
      } catch {
        setData(fallbackData)
      }
    }

    load()
  }, [])

  const summary = useMemo(() => {
    const opsHealthy = data.opsStatus?.health === 'healthy'
    const gatewayHealthy = data.opsStatus?.gatewayHealth === 'healthy'
    const configHealthy = data.opsStatus?.configHealth === 'valid'
    const cronFailing = data.cron?.failing || 0
    const blockedLoops = data.openLoops?.blocked || 0
    const avgConfidence = [opsHealthy, gatewayHealthy, configHealthy, cronFailing === 0].filter(Boolean).length * 25

    return {
      opsHealthy,
      gatewayHealthy,
      configHealthy,
      cronFailing,
      blockedLoops,
      avgConfidence,
    }
  }, [data])

  const systemCards = [
    {
      name: 'Model Failsafe',
      icon: <BrainCircuit className="h-4 w-4" />,
      value: data.modelFailsafe?.currentModel || 'unknown',
      detail: `${data.modelFailsafe?.currentTier || 'unknown'} · ${data.modelFailsafe?.operatingMode || 'unknown'}`,
      subdetail: data.modelFailsafe?.lastReason || 'No reason recorded',
      tone: 'text-cyan-300',
    },
    {
      name: 'Gateway + Config',
      icon: <RadioTower className="h-4 w-4" />,
      value: `${data.opsStatus?.gatewayHealth || 'unknown'} / ${data.opsStatus?.configHealth || 'unknown'}`,
      detail: `ops ${data.opsStatus?.health || 'unknown'}`,
      subdetail: `Updated ${formatTs(data.opsStatus?.updatedAt)}`,
      tone: 'text-emerald-300',
    },
    {
      name: 'Night Watch',
      icon: <Moon className="h-4 w-4" />,
      value: data.nightWatch?.lastStatus || 'unknown',
      detail: `mode ${data.nightWatch?.currentMode || 'unknown'}`,
      subdetail: `Last run ${formatTs(data.nightWatch?.lastRun)}`,
      tone: 'text-indigo-300',
    },
    {
      name: 'Automation Layer',
      icon: <Workflow className="h-4 w-4" />,
      value: `${data.cron?.healthy ?? 0}/${data.cron?.total ?? 0} healthy`,
      detail: `${data.cron?.failing ?? 0} failing`,
      subdetail: `Next run ${formatNextRun(data.cron?.nextRunAtMs)}`,
      tone: 'text-amber-300',
    },
  ]

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_20px_50px_-30px_rgba(34,197,94,0.25)]">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">System command</div>
          <h2 className="mt-2 text-xl font-bold text-emerald-300">RJ Operations Status</h2>
          <p className="mt-1 text-sm text-slate-400">Live telemetry plus explicit open loops, because good operators track unfinished business.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-emerald-300">
          <Activity className="h-4 w-4" />
          <span className="font-mono">source {data.source || 'unknown'}</span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <HealthPill healthy={summary.opsHealthy} label={`Ops ${data.opsStatus?.health || 'unknown'}`} />
        <HealthPill healthy={summary.gatewayHealthy} label={`Gateway ${data.opsStatus?.gatewayHealth || 'unknown'}`} />
        <HealthPill healthy={summary.configHealthy} label={`Config ${data.opsStatus?.configHealth || 'unknown'}`} />
        <HealthPill healthy={summary.cronFailing === 0} label={`Cron failing ${summary.cronFailing}`} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Operator confidence</div>
          <div className="mt-2 text-lg font-semibold text-white">{summary.avgConfidence}%</div>
          <div className="mt-1 text-sm text-slate-400">Driven by real health signals, not theater.</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Remaining runway</div>
          <div className="mt-2 text-lg font-semibold text-cyan-300">{data.modelFailsafe?.dailyRemainingPercent ?? 'n/a'}% / {data.modelFailsafe?.weeklyRemainingPercent ?? 'n/a'}%</div>
          <div className="mt-1 text-sm text-slate-400">Daily and weekly allowance from model failsafe.</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Top swarm pressure</div>
          <div className="mt-2 text-sm font-semibold text-amber-300">{data.missionSwarm?.topRecommendation || 'No recommendation loaded'}</div>
          <div className="mt-1 text-sm text-slate-400">Safe Builder: {data.missionSwarm?.safeBuilderStatus || 'unknown'}</div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {systemCards.map((card) => (
          <div key={card.name} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-1 flex items-center gap-2">
              <div className={card.tone}>{card.icon}</div>
              <div className="text-sm font-semibold text-white">{card.name}</div>
            </div>
            <div className={`text-sm font-semibold ${card.tone}`}>{card.value}</div>
            <div className="mt-1 text-xs text-slate-300">{card.detail}</div>
            <div className="mt-1 text-xs text-slate-500">{card.subdetail}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white"><Database className="h-4 w-4 text-violet-300" />Telemetry source</div>
          <div className="text-sm text-slate-300">Updated {formatTs(data.updatedAt)}</div>
          <div className="mt-1 text-xs text-slate-500">Latest consolidated snapshot for the operator console.</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white"><Shield className="h-4 w-4 text-rose-300" />Failover reason</div>
          <div className="text-sm text-slate-300">{data.opsStatus?.failoverReason || data.modelFailsafe?.lastReason || 'No failover reason recorded.'}</div>
          <div className="mt-1 text-xs text-slate-500">If this changes overnight, it should show up here first.</div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><ListTodo className="h-4 w-4 text-cyan-300" />Open loops</div>
          <div className="text-xs text-slate-500">updated {formatTs(data.openLoops?.updatedAt)}</div>
        </div>
        <div className="mb-3 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-slate-900/80 px-3 py-2"><div className="text-lg font-bold text-white">{data.openLoops?.total ?? 0}</div><div className="text-[11px] text-slate-500">Total</div></div>
          <div className="rounded-lg bg-slate-900/80 px-3 py-2"><div className="text-lg font-bold text-red-300">{data.openLoops?.blocked ?? 0}</div><div className="text-[11px] text-slate-500">Blocked</div></div>
          <div className="rounded-lg bg-slate-900/80 px-3 py-2"><div className="text-lg font-bold text-emerald-300">{data.openLoops?.ready ?? 0}</div><div className="text-[11px] text-slate-500">Ready</div></div>
        </div>
        <div className="space-y-2">
          {(data.openLoops?.items || []).length === 0 ? (
            <div className="text-sm text-slate-400">No open loops recorded.</div>
          ) : (
            (data.openLoops?.items || []).slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{item.title || 'Untitled loop'}</div>
                  <div className={`text-[11px] uppercase tracking-[0.14em] ${item.status === 'blocked' ? 'text-red-300' : 'text-emerald-300'}`}>{item.status || 'unknown'}</div>
                </div>
                <div className="mt-1 text-xs text-slate-400">{item.summary || 'No summary provided.'}</div>
                <div className="mt-2 text-[11px] text-cyan-300">Next: {item.nextAction || 'No next action recorded.'}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-emerald-300">{summary.avgConfidence}%</div>
            <div className="text-xs text-slate-400">Confidence</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-300">{data.cron?.total ?? 0}</div>
            <div className="text-xs text-slate-400">Cron jobs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-300">{data.modelFailsafe?.currentTier || 'unknown'}</div>
            <div className="text-xs text-slate-400">Current tier</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <CronOpsCard />
      </div>
    </div>
  )
}
