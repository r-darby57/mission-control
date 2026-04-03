'use client'

import { Activity, Bot, Database, Globe, Shield, Cpu, RadioTower, Workflow } from 'lucide-react'
import { CronOpsCard } from './cron-ops-card'

interface OperatorModule {
  id: string
  name: string
  role: string
  status: 'active' | 'watching' | 'degraded' | 'idle'
  currentTask: string
  lastUpdate: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
}

const modules: OperatorModule[] = [
  {
    id: 'night-watch',
    name: 'Night Watch',
    role: 'Overnight monitoring + report generation',
    status: 'active',
    currentTask: 'Publishing live state and maintaining durable swarm event history',
    lastUpdate: 'live',
    confidence: 96,
    priority: 'high',
  },
  {
    id: 'mission-swarm',
    name: 'Mission Swarm',
    role: 'Recommendation engine + trust scoring',
    status: 'active',
    currentTask: 'Ranking next operator improvements and measuring consensus',
    lastUpdate: 'recent',
    confidence: 93,
    priority: 'high',
  },
  {
    id: 'model-failsafe',
    name: 'Model Failsafe',
    role: 'Routing, fallback, and degradation control',
    status: 'watching',
    currentTask: 'Checking primary/backup model posture and remaining runway',
    lastUpdate: 'heartbeat',
    confidence: 91,
    priority: 'high',
  },
  {
    id: 'memory-system',
    name: 'Memory System',
    role: 'Daily logs + long-term continuity',
    status: 'active',
    currentTask: 'Recording durable project context and preserving open loops',
    lastUpdate: 'today',
    confidence: 94,
    priority: 'medium',
  },
  {
    id: 'intel-pipeline',
    name: 'Intel Pipeline',
    role: 'AI / technology / science / business signal layer',
    status: 'watching',
    currentTask: 'Condensing external signals into operator-useful briefings',
    lastUpdate: 'today',
    confidence: 88,
    priority: 'medium',
  },
]

interface SystemMetric {
  name: string
  value: string
  status: 'good' | 'warning' | 'critical'
  icon: React.ReactNode
  description: string
}

const systemMetrics: SystemMetric[] = [
  {
    name: 'Gateway + Runtime',
    value: 'Operational',
    status: 'good',
    icon: <RadioTower className="h-4 w-4" />,
    description: 'Primary control plane reachable and responding',
  },
  {
    name: 'Automation Layer',
    value: 'Cron + launchd live',
    status: 'good',
    icon: <Workflow className="h-4 w-4" />,
    description: 'Scheduled checks and summaries are wired into ops flow',
  },
  {
    name: 'Memory Continuity',
    value: 'Daily capture active',
    status: 'good',
    icon: <Database className="h-4 w-4" />,
    description: 'Operational state preserved across compaction and wake cycles',
  },
  {
    name: 'Exposure Posture',
    value: 'Bounded',
    status: 'good',
    icon: <Shield className="h-4 w-4" />,
    description: 'Safe Builder and system changes remain intentionally constrained',
  },
]

function StatusIndicator({ status }: { status: OperatorModule['status'] }) {
  const styles = {
    active: 'bg-green-500 shadow-green-500/30',
    watching: 'bg-blue-500 shadow-blue-500/30',
    degraded: 'bg-red-500 shadow-red-500/30 animate-pulse',
    idle: 'bg-slate-500 shadow-slate-500/30',
  }

  return <div className={`h-3 w-3 rounded-full shadow ${styles[status]}`} />
}

function PriorityBadge({ priority }: { priority: OperatorModule['priority'] }) {
  const styles = {
    high: 'border-red-500/20 bg-red-500/10 text-red-300',
    medium: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300',
    low: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  }

  return <span className={`rounded border px-2 py-1 text-[11px] font-mono uppercase tracking-[0.14em] ${styles[priority]}`}>{priority}</span>
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const tone = confidence >= 92 ? 'bg-emerald-500' : confidence >= 85 ? 'bg-cyan-500' : 'bg-yellow-500'

  return (
    <div className="h-2 w-full rounded-full bg-slate-800">
      <div className={`h-2 rounded-full ${tone}`} style={{ width: `${confidence}%` }} />
    </div>
  )
}

function MetricStatus({ status }: { status: SystemMetric['status'] }) {
  const styles = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  }

  const icons = {
    good: '✓',
    warning: '⚠',
    critical: '✗',
  }

  return <span className={`font-mono ${styles[status]}`}>{icons[status]}</span>
}

export function OperationsStatus() {
  const activeModules = modules.filter((module) => module.status === 'active' || module.status === 'watching').length
  const avgConfidence = Math.round(modules.reduce((acc, module) => acc + module.confidence, 0) / modules.length)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_20px_50px_-30px_rgba(34,197,94,0.25)]">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">System command</div>
          <h2 className="mt-2 text-xl font-bold text-emerald-300">RJ Operations Status</h2>
          <p className="mt-1 text-sm text-slate-400">Mission Control is now centered on the machine room, not Ryan’s habit tracker.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-emerald-300">
          <Activity className="h-4 w-4" />
          <span className="font-mono">{activeModules}/{modules.length} online</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Operator stance</div>
          <div className="mt-2 text-lg font-semibold text-white">Control plane first</div>
          <div className="mt-1 text-sm text-slate-400">Observe, explain, and optimize the system before adding more widgets.</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Average confidence</div>
          <div className="mt-2 text-lg font-semibold text-cyan-300">{avgConfidence}%</div>
          <div className="mt-1 text-sm text-slate-400">Confidence is about legibility and boundedness, not vibes.</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Optimization mode</div>
          <div className="mt-2 text-lg font-semibold text-amber-300">Active</div>
          <div className="mt-1 text-sm text-slate-400">The system is now framed around what RJ should improve next.</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Core modules</h3>
        <div className="space-y-3">
          {modules.map((module) => (
            <div key={module.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <StatusIndicator status={module.status} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{module.name}</div>
                    <div className="text-xs text-slate-400">{module.role}</div>
                    <div className="mt-2 text-sm text-slate-300">{module.currentTask}</div>
                    <div className="mt-1 text-xs text-slate-500">Last update: {module.lastUpdate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-mono text-white">{module.confidence}%</div>
                  <PriorityBadge priority={module.priority} />
                </div>
              </div>
              <div className="mt-3">
                <ConfidenceBar confidence={module.confidence} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-white">System health</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {systemMetrics.map((metric) => (
            <div key={metric.name} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-cyan-300">{metric.icon}</div>
                  <span className="text-sm font-semibold text-white">{metric.name}</span>
                </div>
                <MetricStatus status={metric.status} />
              </div>
              <div className="text-sm text-slate-300">{metric.value}</div>
              <div className="mt-1 text-xs text-slate-500">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-emerald-300">{activeModules}</div>
            <div className="text-xs text-slate-400">Watching / active</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-300">{avgConfidence}%</div>
            <div className="text-xs text-slate-400">Avg confidence</div>
          </div>
          <div>
            <div className="text-lg font-bold text-violet-300">Bounded</div>
            <div className="text-xs text-slate-400">Automation posture</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <CronOpsCard />
      </div>
    </div>
  )
}
