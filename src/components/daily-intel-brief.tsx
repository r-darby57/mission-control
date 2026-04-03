'use client'

import { useEffect, useMemo, useState } from 'react'
import { BrainCircuit, Cpu, FlaskConical, Briefcase, Shield, Clock, ArrowRight, Radar } from 'lucide-react'

interface IntelItem {
  category: 'ai' | 'technology' | 'science' | 'business' | 'cybersecurity'
  priority: 'high' | 'medium' | 'low'
  title: string
  summary: string
  operatorValue: string
  source: string
  timestamp: string
}

interface IntelPayload {
  updatedAt?: string | null
  items: IntelItem[]
}

function PriorityIndicator({ priority }: { priority: IntelItem['priority'] }) {
  const styles = {
    high: 'bg-red-500 shadow-red-500/30',
    medium: 'bg-yellow-500 shadow-yellow-500/30',
    low: 'bg-green-500 shadow-green-500/30',
  }

  return <div className={`h-2.5 w-2.5 rounded-full shadow ${styles[priority]}`} />
}

function CategoryIcon({ category }: { category: IntelItem['category'] }) {
  const icons = {
    ai: <BrainCircuit className="h-4 w-4" />,
    technology: <Cpu className="h-4 w-4" />,
    science: <FlaskConical className="h-4 w-4" />,
    business: <Briefcase className="h-4 w-4" />,
    cybersecurity: <Shield className="h-4 w-4" />,
  }

  return <div className="text-cyan-300">{icons[category]}</div>
}

export function DailyIntelBrief() {
  const [data, setData] = useState<IntelPayload>({ items: [] })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/intel/brief')
        if (!res.ok) throw new Error('Failed to load intel brief')
        const json = await res.json()
        setData(json)
      } catch {
        setData({ items: [] })
      }
    }

    load()
  }, [])

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'America/Los_Angeles',
  })

  const highPriorityCount = useMemo(() => data.items.filter((item) => item.priority === 'high').length, [data.items])

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_20px_50px_-30px_rgba(8,145,178,0.4)]">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Intelligence briefing</div>
          <h2 className="mt-2 text-xl font-bold text-cyan-300">AI · Tech · Science · Business</h2>
          <p className="mt-1 text-sm text-slate-400">File-backed signal layer for Ryan, filtered through what actually helps the system.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="h-4 w-4" />
          <span>{currentTime} PDT</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Signal posture</div>
          <div className="mt-2 text-lg font-semibold text-white">Operator-focused</div>
          <div className="mt-1 text-sm text-slate-400">Low-noise summaries tied to action, trust, and system leverage.</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">High-priority items</div>
          <div className="mt-2 text-lg font-semibold text-red-300">{highPriorityCount}</div>
          <div className="mt-1 text-sm text-slate-400">Worth attention now, not someday.</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Source mode</div>
          <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-emerald-300"><Radar className="h-4 w-4" />Local intel file</div>
          <div className="mt-1 text-sm text-slate-400">Now backed by a real workspace source instead of hardcoded UI filler.</div>
        </div>
      </div>

      <div className="mb-4 text-[11px] text-slate-500">
        Updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : 'unknown'}
      </div>

      <div className="space-y-4">
        {data.items.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">No intel items loaded yet.</div>
        ) : data.items.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-start gap-3">
              <PriorityIndicator priority={item.priority} />
              <CategoryIcon category={item.category} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <div className="text-xs text-slate-500">{item.timestamp}</div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.summary}</p>
                <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    <ArrowRight className="h-3.5 w-3.5" />
                    Why Ryan should care
                  </div>
                  <div className="mt-1 text-sm text-cyan-100">{item.operatorValue}</div>
                </div>
                <div className="mt-3 text-xs text-slate-500">Source: {item.source}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
