'use client'

import { useEffect, useMemo, useState } from 'react'

interface NightWatchState {
  lastRun: string | null
  lastTask: {
    type?: string
    status?: string
    score?: number
    findings?: string[]
    recommendation?: string
  } | null
  lastStatus: string
  lastReport: string | null
  currentMode: string
  missionSwarm?: {
    lastRun?: string | null
    lastStatus?: string
    topRecommendation?: {
      title?: string
      role?: string
      score?: number
      summary?: string
      reasoning?: string
    } | null
    lastSafeBuilderAction?: {
      status?: string
      summary?: string
      validation?: string
      scope?: string[]
    } | null
    lastReport?: string | null
  }
}

interface TrendItem {
  topic?: string
  relevance?: string | number
  action?: string
}

interface SwarmRecommendationItem {
  id?: string
  title?: string
  role?: string
  score?: number
  summary?: string
  reasoning?: string
}

interface SwarmPayload {
  state?: {
    lastRun?: string | null
    lastStatus?: string
    lastRecommendation?: SwarmRecommendationItem | null
    lastSafeBuilderAction?: {
      status?: string
      summary?: string
      validation?: string
      scope?: string[]
    } | null
    history?: Array<{
      ts?: string
      topRecommendation?: string
      status?: string
    }>
  }
  recommendations?: {
    generatedAt?: string
    topRecommendation?: SwarmRecommendationItem
    roleOutputs?: Record<string, SwarmRecommendationItem>
    items?: SwarmRecommendationItem[]
  }
}

interface SwarmEventItem {
  ts?: string
  source?: string
  nightWatchLastRun?: string | null
  swarmLastRun?: string | null
  swarmStatus?: string | null
  topRecommendationTitle?: string | null
  topRecommendationScore?: number | null
  consensusAverage?: number | null
  consensusSpread?: number | null
  safeBuilderStatus?: string | null
  safeBuilderSummary?: string | null
  safeBuilderValidation?: string | null
  safeBuilderScope?: string[]
}

const fallbackState: NightWatchState = {
  lastRun: null,
  lastTask: null,
  lastStatus: 'unknown',
  lastReport: null,
  currentMode: 'safe-internal',
}

function NightWatchCard({ title, accent, meta, children }: { title: string; accent: string; meta?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-xl p-4 md:p-6 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.8)] ${accent}`}>
      <div className="flex items-center justify-between mb-5 gap-3">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        {meta ? <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{meta}</span> : null}
      </div>
      {children}
    </div>
  )
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

export function NightWatchDashboard() {
  const [state, setState] = useState<NightWatchState>(fallbackState)
  const [reportPreview, setReportPreview] = useState<string>('No report loaded yet.')
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [swarm, setSwarm] = useState<SwarmPayload>({ recommendations: { items: [] } })
  const [swarmEvents, setSwarmEvents] = useState<SwarmEventItem[]>([])

  useEffect(() => {
    async function loadNightWatch() {
      try {
        const stateRes = await fetch('/api/night-watch/state')
        if (stateRes.ok) {
          const stateJson = await stateRes.json()
          setState(stateJson)
        }
      } catch {}

      try {
        const reportRes = await fetch('/api/night-watch/report')
        if (reportRes.ok) {
          const reportJson = await reportRes.json()
          setReportPreview(reportJson.preview || 'No report preview available.')
        }
      } catch {}

      try {
        const trendsRes = await fetch('/api/night-watch/trends')
        if (trendsRes.ok) {
          const trendsJson = await trendsRes.json()
          setTrends(trendsJson.items || [])
        }
      } catch {}

      try {
        const swarmRes = await fetch('/api/night-watch/swarm')
        if (swarmRes.ok) {
          const swarmJson = await swarmRes.json()
          setSwarm(swarmJson)
        }
      } catch {}

      try {
        const eventsRes = await fetch('/api/night-watch/events')
        if (eventsRes.ok) {
          const eventsJson = await eventsRes.json()
          setSwarmEvents(eventsJson.items || [])
        }
      } catch {}
    }

    loadNightWatch()
  }, [])

  const swarmHistory = swarm.state?.history || []
  const swarmItems = swarm.recommendations?.items || []
  const roleOutputs = swarm.recommendations?.roleOutputs || {}

  const consensus = useMemo(() => {
    const scores = Object.values(roleOutputs)
      .map((item) => item.score)
      .filter((score): score is number => typeof score === 'number')

    if (scores.length === 0) {
      return { average: null, spread: null, label: 'unknown' }
    }

    const average = Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
    const spread = Math.max(...scores) - Math.min(...scores)
    const label = spread <= 6 ? 'tight alignment' : spread <= 12 ? 'healthy debate' : 'divergent views'

    return { average, spread, label }
  }, [roleOutputs])

  const recurrence = useMemo(() => {
    const title = swarm.state?.lastRecommendation?.title || state.missionSwarm?.topRecommendation?.title
    if (!title) return 0
    return swarmHistory.filter((item) => item.topRecommendation === title).length
  }, [swarmHistory, swarm.state?.lastRecommendation?.title, state.missionSwarm?.topRecommendation?.title])

  const eventAnalytics = useMemo(() => {
    if (swarmEvents.length === 0) {
      return {
        avgConsensus: null as number | null,
        avgSpread: null as number | null,
        repeatCount: 0,
        validationPattern: 'No validation receipts yet.',
      }
    }

    const consensusValues = swarmEvents.map((item) => item.consensusAverage).filter((value): value is number => typeof value === 'number')
    const spreadValues = swarmEvents.map((item) => item.consensusSpread).filter((value): value is number => typeof value === 'number')
    const topTitle = swarmEvents[0]?.topRecommendationTitle
    const repeatCount = topTitle ? swarmEvents.filter((item) => item.topRecommendationTitle === topTitle).length : 0
    const validationPattern = swarmEvents[0]?.safeBuilderValidation || 'No validation receipts yet.'

    return {
      avgConsensus: consensusValues.length ? Math.round(consensusValues.reduce((acc, value) => acc + value, 0) / consensusValues.length) : null,
      avgSpread: spreadValues.length ? Math.round(spreadValues.reduce((acc, value) => acc + value, 0) / spreadValues.length) : null,
      repeatCount,
      validationPattern,
    }
  }, [swarmEvents])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <NightWatchCard title="🌙 Night Watch Status" meta={state.currentMode || 'safe-internal'} accent="ring-1 ring-indigo-500/10">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3"><span className="text-slate-400">Last run</span><span className="text-white font-mono text-right">{state.lastRun || 'Never'}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-slate-400">Last status</span><span className="text-green-400 font-semibold">{state.lastStatus || 'unknown'}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-slate-400">Last task</span><span className="text-white text-right">{state.lastTask?.type || 'none'}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-slate-400">Task score</span><span className="text-blue-400 font-mono">{state.lastTask?.score ?? 'n/a'}</span></div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Recommendation</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{state.lastTask?.recommendation || 'No recommendation available yet.'}</p>
          </div>
        </NightWatchCard>

        <NightWatchCard title="📄 Latest Morning Memo" meta="latest report preview" accent="ring-1 ring-blue-500/10">
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/40">
            <pre className="text-xs md:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">{reportPreview}</pre>
          </div>
        </NightWatchCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <NightWatchCard title="🧠 Mission Swarm" meta={swarm.state?.lastStatus || state.missionSwarm?.lastStatus || 'idle'} accent="ring-1 ring-cyan-500/10">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">consensus score</div>
              <div className="text-lg font-bold text-cyan-300 mt-1">{consensus.average ?? 'n/a'}</div>
              <div className="text-[11px] text-slate-500 mt-1">{consensus.label}</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">recurrence</div>
              <div className="text-lg font-bold text-orange-300 mt-1">{recurrence}x</div>
              <div className="text-[11px] text-slate-500 mt-1">same top recommendation</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">top recommendation</div>
              <div className="text-sm text-white font-semibold mt-1">{swarm.state?.lastRecommendation?.title || state.missionSwarm?.topRecommendation?.title || 'No recommendation yet.'}</div>
              <div className="text-xs text-blue-300 mt-2">{swarm.state?.lastRecommendation?.summary || state.missionSwarm?.topRecommendation?.summary || 'Waiting for first advisory cycle.'}</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">safe builder</div>
              <div className="text-sm text-white mt-1">{swarm.state?.lastSafeBuilderAction?.summary || state.missionSwarm?.lastSafeBuilderAction?.summary || 'Safe Builder not ready yet.'}</div>
              <div className="text-xs text-slate-400 mt-2">validation: {swarm.state?.lastSafeBuilderAction?.validation || state.missionSwarm?.lastSafeBuilderAction?.validation || 'Validation rules pending.'}</div>
              <div className="text-xs text-slate-500 mt-2">scope: {(swarm.state?.lastSafeBuilderAction?.scope || state.missionSwarm?.lastSafeBuilderAction?.scope || []).join(', ') || 'no scope declared'}</div>
            </div>
          </div>
        </NightWatchCard>

        <NightWatchCard title="📈 Swarm Analytics" meta="operator trust" accent="ring-1 ring-amber-500/10">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">avg consensus</div>
              <div className="text-lg font-bold text-amber-300 mt-1">{eventAnalytics.avgConsensus ?? 'n/a'}</div>
              <div className="text-[11px] text-slate-500 mt-1">across durable events</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">avg disagreement</div>
              <div className="text-lg font-bold text-rose-300 mt-1">{eventAnalytics.avgSpread ?? 'n/a'}</div>
              <div className="text-[11px] text-slate-500 mt-1">consensus spread</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">repeat pressure</div>
              <div className="text-sm text-white font-semibold mt-1">{eventAnalytics.repeatCount} recent event(s) repeating the current top recommendation</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">current validation pattern</div>
              <div className="text-sm text-slate-200 mt-1">{eventAnalytics.validationPattern}</div>
            </div>
          </div>
        </NightWatchCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <NightWatchCard title="🧾 Builder Receipts" meta="trust layer" accent="ring-1 ring-emerald-500/10">
          <div className="space-y-3">
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">last action status</div>
              <div className="text-sm text-white font-semibold mt-1">{swarm.state?.lastSafeBuilderAction?.status || state.missionSwarm?.lastSafeBuilderAction?.status || 'unknown'}</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">validation receipt</div>
              <div className="text-sm text-slate-200 mt-1">{swarm.state?.lastSafeBuilderAction?.validation || state.missionSwarm?.lastSafeBuilderAction?.validation || 'No validation receipt recorded.'}</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">operator summary</div>
              <div className="text-sm text-slate-200 mt-1">{swarm.state?.lastSafeBuilderAction?.summary || state.missionSwarm?.lastSafeBuilderAction?.summary || 'No operator summary recorded.'}</div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">declared scope</div>
              <div className="text-sm text-slate-200 mt-1">{(swarm.state?.lastSafeBuilderAction?.scope || state.missionSwarm?.lastSafeBuilderAction?.scope || []).join(', ') || 'No scope declared.'}</div>
            </div>
          </div>
        </NightWatchCard>

        <NightWatchCard title="🏅 Swarm Recommendations" meta={`${swarmItems.length} queued`} accent="ring-1 ring-orange-500/10">
          <div className="space-y-3">
            {swarmItems.length === 0 ? (
              <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30 text-sm text-slate-300">No swarm recommendations loaded yet.</div>
            ) : (
              swarmItems.slice(0, 5).map((item, idx) => (
                <div key={item.id || idx} className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex items-center justify-between gap-3"><div className="text-sm text-white font-semibold">{item.title || 'Untitled recommendation'}</div><div className="text-xs font-mono text-orange-300 whitespace-nowrap">score {item.score ?? 'n/a'}</div></div>
                  <div className="text-xs text-slate-400 mt-1">{item.role || 'unknown role'}</div>
                  <div className="text-xs text-slate-200 mt-2">{item.summary || 'No summary provided.'}</div>
                </div>
              ))
            )}
          </div>
        </NightWatchCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <NightWatchCard title="🤝 Role Consensus" meta={`${Object.keys(roleOutputs).length} roles`} accent="ring-1 ring-violet-500/10">
          <div className="space-y-3">
            {Object.entries(roleOutputs).length === 0 ? (
              <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30 text-sm text-slate-300">No role outputs loaded yet.</div>
            ) : (
              Object.entries(roleOutputs).map(([role, item]) => (
                <div key={role} className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-white font-semibold">{role}</div>
                    <div className="text-xs font-mono text-violet-300">{item.score ?? 'n/a'}</div>
                  </div>
                  <div className="text-xs text-slate-300 mt-2">{item.title || 'No title provided.'}</div>
                  <div className="text-[11px] text-slate-500 mt-2">{item.reasoning || 'No reasoning provided.'}</div>
                </div>
              ))
            )}
          </div>
        </NightWatchCard>

        <NightWatchCard title="🕘 Swarm Timeline" meta={`${swarmEvents.length || swarmHistory.length} checkpoints`} accent="ring-1 ring-blue-500/10">
          <div className="space-y-3">
            {(swarmEvents.length > 0 ? swarmEvents : swarmHistory.slice().reverse()).slice(0, 6).map((item: any, idx) => (
              <div key={`${item.ts || 'unknown'}-${idx}`} className="relative pl-5">
                <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-400" />
                <div className="absolute left-[4px] top-4 bottom-[-12px] w-px bg-slate-800 last:hidden" />
                <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-white font-semibold">{item.topRecommendationTitle || item.topRecommendation || 'Unknown recommendation'}</div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">{item.swarmStatus || item.status || 'unknown'}</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">{formatTs(item.ts)}</div>
                  {'consensusAverage' in item ? <div className="text-xs text-cyan-300 mt-2">consensus {item.consensusAverage ?? 'n/a'} / spread {item.consensusSpread ?? 'n/a'}</div> : null}
                  {'safeBuilderValidation' in item ? <div className="text-[11px] text-slate-400 mt-2">{item.safeBuilderValidation || 'No validation receipt recorded.'}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </NightWatchCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <NightWatchCard title="📡 Trend Radar" meta={`${trends.length} signals`} accent="ring-1 ring-purple-500/10">
          <div className="space-y-3">
            {trends.length === 0 ? (
              <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30 text-sm text-slate-300">No trend items loaded yet. Trend Radar scaffolding is ready.</div>
            ) : (
              trends.map((item, idx) => (
                <div key={idx} className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                  <div className="text-white font-semibold text-sm">{item.topic || 'Unknown topic'}</div>
                  <div className="text-xs text-slate-400 mt-1">relevance: {String(item.relevance ?? 'unknown')}</div>
                  <div className="text-xs text-blue-300 mt-1">action: {item.action || 'review'}</div>
                </div>
              ))
            )}
          </div>
        </NightWatchCard>
      </div>
    </div>
  )
}
