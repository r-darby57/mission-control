'use client'

import { useEffect, useState } from 'react'

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

interface SwarmPayload {
  state?: {
    lastRun?: string | null
    lastStatus?: string
    lastRecommendation?: {
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
  }
  recommendations?: {
    items?: Array<{
      id?: string
      title?: string
      role?: string
      score?: number
      summary?: string
      reasoning?: string
    }>
  }
}

const fallbackState: NightWatchState = {
  lastRun: null,
  lastTask: null,
  lastStatus: 'unknown',
  lastReport: null,
  currentMode: 'safe-internal',
}

export function NightWatchDashboard() {
  const [state, setState] = useState<NightWatchState>(fallbackState)
  const [reportPreview, setReportPreview] = useState<string>('No report loaded yet.')
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [swarm, setSwarm] = useState<SwarmPayload>({ recommendations: { items: [] } })

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
    }

    loadNightWatch()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-indigo-400">🌙 Night Watch Status</h2>
            <span className="px-3 py-1 text-xs font-mono rounded border bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
              {state.currentMode || 'safe-internal'}
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last run</span>
              <span className="text-white font-mono">{state.lastRun || 'Never'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last status</span>
              <span className="text-green-400 font-semibold">{state.lastStatus || 'unknown'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last task</span>
              <span className="text-white">{state.lastTask?.type || 'none'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Task score</span>
              <span className="text-blue-400 font-mono">{state.lastTask?.score ?? 'n/a'}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Recommendation</h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {state.lastTask?.recommendation || 'No recommendation available yet.'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-blue-400">📄 Latest Morning Memo</h2>
            <span className="text-xs text-slate-400">latest report preview</span>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40">
            <pre className="text-xs md:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">
              {reportPreview}
            </pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-400 mb-6">🔍 Latest Findings</h2>
          <div className="space-y-3">
            {(state.lastTask?.findings || ['No findings available yet.']).map((finding, idx) => (
              <div key={idx} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 text-sm text-slate-200">
                {finding}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6">🧠 Mission Swarm</h2>
          <div className="space-y-3">
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">status</div>
              <div className="text-sm text-white font-semibold">{swarm.state?.lastStatus || state.missionSwarm?.lastStatus || 'idle'}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">top recommendation</div>
              <div className="text-sm text-white font-semibold">{swarm.state?.lastRecommendation?.title || state.missionSwarm?.topRecommendation?.title || 'No recommendation yet.'}</div>
              <div className="text-xs text-blue-300 mt-1">{swarm.state?.lastRecommendation?.summary || state.missionSwarm?.topRecommendation?.summary || 'Waiting for first advisory cycle.'}</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-xs text-slate-400">safe builder</div>
              <div className="text-sm text-white">{swarm.state?.lastSafeBuilderAction?.summary || state.missionSwarm?.lastSafeBuilderAction?.summary || 'Safe Builder not ready yet.'}</div>
              <div className="text-xs text-slate-400 mt-1">{swarm.state?.lastSafeBuilderAction?.validation || state.missionSwarm?.lastSafeBuilderAction?.validation || 'Validation rules pending.'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-6">🏅 Swarm Recommendations</h2>
          <div className="space-y-3">
            {(swarm.recommendations?.items || []).length === 0 ? (
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 text-sm text-slate-300">
                No swarm recommendations loaded yet.
              </div>
            ) : (
              (swarm.recommendations?.items || []).slice(0, 5).map((item, idx) => (
                <div key={item.id || idx} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-white font-semibold">{item.title || 'Untitled recommendation'}</div>
                    <div className="text-xs font-mono text-orange-300">score {item.score ?? 'n/a'}</div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{item.role || 'unknown role'}</div>
                  <div className="text-xs text-slate-200 mt-2">{item.summary || 'No summary provided.'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-purple-400 mb-6">📡 Trend Radar</h2>
          <div className="space-y-3">
            {trends.length === 0 ? (
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 text-sm text-slate-300">
                No trend items loaded yet. Trend Radar scaffolding is ready.
              </div>
            ) : (
              trends.map((item, idx) => (
                <div key={idx} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                  <div className="text-white font-semibold text-sm">{item.topic || 'Unknown topic'}</div>
                  <div className="text-xs text-slate-400 mt-1">relevance: {String(item.relevance ?? 'unknown')}</div>
                  <div className="text-xs text-blue-300 mt-1">action: {item.action || 'review'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
