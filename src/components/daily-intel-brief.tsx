'use client'

import { BrainCircuit, Cpu, FlaskConical, Briefcase, Shield, Clock, ArrowRight } from 'lucide-react'

interface IntelItem {
  category: 'ai' | 'technology' | 'science' | 'business' | 'cybersecurity'
  priority: 'high' | 'medium' | 'low'
  title: string
  summary: string
  operatorValue: string
  source: string
  timestamp: string
}

const mockIntel: IntelItem[] = [
  {
    category: 'ai',
    priority: 'high',
    title: 'Frontier labs keep compressing the gap between assistant and operator tooling',
    summary: 'Agent products are shifting from chat wrappers into system-control surfaces with memory, automation, and trust telemetry as differentiators.',
    operatorValue: 'Push Mission Control toward observable automations, receipts, and bounded execution instead of generic chat UX.',
    source: 'Operator synthesis',
    timestamp: 'fresh',
  },
  {
    category: 'technology',
    priority: 'medium',
    title: 'Operational dashboards are winning when they show fewer, sharper signals',
    summary: 'Dense monitoring walls are useful only if the top layer compresses what matters right now into immediate operator decisions.',
    operatorValue: 'Keep summary cards, status indicators, and ranked next actions above deep detail panes.',
    source: 'Product/infra trend scan',
    timestamp: 'today',
  },
  {
    category: 'science',
    priority: 'medium',
    title: 'Scientific workflows are increasingly agent-assisted, but trust remains the bottleneck',
    summary: 'Teams are adopting AI help for synthesis and exploration, but validation chains still decide whether outputs are actually usable.',
    operatorValue: 'Show proof of work, not just conclusions. Receipts matter more than swagger.',
    source: 'Research tooling landscape',
    timestamp: 'today',
  },
  {
    category: 'business',
    priority: 'high',
    title: 'The real moat is reliability plus decision velocity',
    summary: 'Businesses are rewarding systems that reduce coordination drag and make action legible under uncertainty.',
    operatorValue: 'Make Mission Control a control plane that helps Ryan understand the machine in seconds.',
    source: 'Business model synthesis',
    timestamp: 'today',
  },
  {
    category: 'cybersecurity',
    priority: 'high',
    title: 'Security posture for agent systems is drifting toward scope control and auditability',
    summary: 'The strongest pattern is not “maximum autonomy,” it is tightly scoped automation with visible boundaries and logs.',
    operatorValue: 'Keep Safe Builder constrained and make every meaningful action explainable.',
    source: 'Security architecture scan',
    timestamp: 'today',
  },
]

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
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'America/Los_Angeles',
  })

  const highPriorityCount = mockIntel.filter((item) => item.priority === 'high').length

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_20px_50px_-30px_rgba(8,145,178,0.4)]">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Intelligence briefing</div>
          <h2 className="mt-2 text-xl font-bold text-cyan-300">AI · Tech · Science · Business</h2>
          <p className="mt-1 text-sm text-slate-400">Curated signal layer for Ryan, filtered through what actually helps the system.</p>
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
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Mission use</div>
          <div className="mt-2 text-lg font-semibold text-emerald-300">Decision advantage</div>
          <div className="mt-1 text-sm text-slate-400">Intel should make the machine smarter, not just more informed.</div>
        </div>
      </div>

      <div className="space-y-4">
        {mockIntel.map((item, index) => (
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
