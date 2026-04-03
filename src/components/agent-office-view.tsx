'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Settings, Zap, Clock, CheckCircle2, Activity } from 'lucide-react'

interface OperatorNode {
  id: string
  name: string
  role: string
  avatar: string
  status: 'active' | 'idle' | 'busy' | 'offline'
  currentTask: string
  lastActivity: string
  reliability: number
  signalsProcessed: number
  improvementsShipped: number
  workstation: string
}

const nodes: OperatorNode[] = [
  {
    id: 'rj-core',
    name: 'RJ Core',
    role: 'Strategic command + orchestration',
    avatar: '🧠',
    status: 'active',
    currentTask: 'Reshaping Mission Control into a real operator console',
    lastActivity: 'just now',
    reliability: 95,
    signalsProcessed: 127,
    improvementsShipped: 8,
    workstation: 'Command Deck',
  },
  {
    id: 'night-watch',
    name: 'Night Watch',
    role: 'Monitoring and reporting engine',
    avatar: '🌙',
    status: 'busy',
    currentTask: 'Publishing live state, tracking repeated issues, preserving event history',
    lastActivity: '2 min ago',
    reliability: 94,
    signalsProcessed: 63,
    improvementsShipped: 5,
    workstation: 'Observation Bay',
  },
  {
    id: 'mission-swarm',
    name: 'Mission Swarm',
    role: 'Recommendation ranking + trust analysis',
    avatar: '🤝',
    status: 'active',
    currentTask: 'Scoring next operator improvements and measuring consensus spread',
    lastActivity: '1 min ago',
    reliability: 92,
    signalsProcessed: 41,
    improvementsShipped: 4,
    workstation: 'Strategy Table',
  },
  {
    id: 'memory-layer',
    name: 'Memory Layer',
    role: 'Continuity + durable context preservation',
    avatar: '🗂️',
    status: 'active',
    currentTask: 'Capturing decisions, deployments, and open loops into durable files',
    lastActivity: 'recent',
    reliability: 96,
    signalsProcessed: 38,
    improvementsShipped: 3,
    workstation: 'Archive Vault',
  },
  {
    id: 'intel-briefing',
    name: 'Intel Briefing',
    role: 'AI, tech, science, and business synthesis',
    avatar: '📡',
    status: 'idle',
    currentTask: 'Preparing compact operator-useful briefs for Ryan',
    lastActivity: 'today',
    reliability: 89,
    signalsProcessed: 25,
    improvementsShipped: 2,
    workstation: 'Signal Room',
  },
]

const statusColors = {
  active: 'bg-green-500 shadow-green-500/50',
  busy: 'bg-yellow-500 shadow-yellow-500/50',
  idle: 'bg-blue-500 shadow-blue-500/50',
  offline: 'bg-gray-500 shadow-gray-500/50',
}

const statusLabels = {
  active: 'ACTIVE',
  busy: 'BUSY',
  idle: 'IDLE',
  offline: 'OFFLINE',
}

function NodeDetailPanel({ node, onClose }: { node: OperatorNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="m-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-3xl">{node.avatar}</div>
            <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 ${statusColors[node.status]}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{node.name}</h3>
            <p className="text-slate-400">{node.role}</p>
            <p className="text-sm text-slate-500">{node.workstation}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="mb-1 text-sm font-semibold text-cyan-300">Current task</h4>
            <p className="text-white">{node.currentTask}</p>
            <p className="mt-1 text-xs text-slate-400">Last activity: {node.lastActivity}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-800/60 p-3 text-center"><div className="text-lg font-bold text-emerald-300">{node.reliability}%</div><div className="text-xs text-slate-400">Reliability</div></div>
            <div className="rounded-xl bg-slate-800/60 p-3 text-center"><div className="text-lg font-bold text-cyan-300">{node.signalsProcessed}</div><div className="text-xs text-slate-400">Signals</div></div>
            <div className="rounded-xl bg-slate-800/60 p-3 text-center"><div className="text-lg font-bold text-amber-300">{node.improvementsShipped}</div><div className="text-xs text-slate-400">Shipped</div></div>
          </div>

          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600 transition-colors"><MessageSquare className="h-4 w-4" />Inspect</button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 transition-colors"><Settings className="h-4 w-4" />Tune</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NodeCard({ node, onClick }: { node: OperatorNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left transition-colors hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-2xl">{node.avatar}</div>
            <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${statusColors[node.status]}`} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">{node.name}</div>
            <div className="text-xs text-slate-400">{node.role}</div>
            <div className="mt-2 text-xs leading-relaxed text-slate-300">{node.currentTask}</div>
          </div>
        </div>
        <span className="text-[10px] text-slate-400">{statusLabels[node.status]}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-900/80 px-2 py-2"><div className="text-sm font-bold text-emerald-300">{node.reliability}%</div><div className="text-[10px] text-slate-500">Reliability</div></div>
        <div className="rounded-lg bg-slate-900/80 px-2 py-2"><div className="text-sm font-bold text-cyan-300">{node.signalsProcessed}</div><div className="text-[10px] text-slate-500">Signals</div></div>
        <div className="rounded-lg bg-slate-900/80 px-2 py-2"><div className="text-sm font-bold text-amber-300">{node.improvementsShipped}</div><div className="text-[10px] text-slate-500">Shipped</div></div>
      </div>
    </button>
  )
}

export function AgentOfficeView() {
  const [selectedNode, setSelectedNode] = useState<OperatorNode | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeNodes = nodes.filter((node) => node.status === 'active' || node.status === 'busy').length
  const avgReliability = Math.round(nodes.reduce((acc, node) => acc + node.reliability, 0) / nodes.length)
  const shippedCount = nodes.reduce((acc, node) => acc + node.improvementsShipped, 0)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Operator workspace</div>
          <h2 className="mt-2 text-2xl font-bold text-cyan-300">RJ System Office</h2>
          <p className="mt-1 text-sm text-slate-400">A clearer model of the system I actually run for you.</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-2xl font-mono text-emerald-300">{currentTime.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour12: false })} PDT</div>
          <div className="text-sm text-slate-400">{activeNodes}/{nodes.length} core nodes engaged</div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-slate-950/60 p-3 text-center"><div className="mb-2 flex items-center justify-center gap-2"><Activity className="h-4 w-4 text-emerald-300" /><span className="text-lg font-bold text-emerald-300">{activeNodes}</span></div><div className="text-xs text-slate-400">Engaged</div></div>
        <div className="rounded-xl bg-slate-950/60 p-3 text-center"><div className="mb-2 flex items-center justify-center gap-2"><Zap className="h-4 w-4 text-cyan-300" /><span className="text-lg font-bold text-cyan-300">{avgReliability}%</span></div><div className="text-xs text-slate-400">Reliability</div></div>
        <div className="rounded-xl bg-slate-950/60 p-3 text-center"><div className="mb-2 flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-300" /><span className="text-lg font-bold text-amber-300">{shippedCount}</span></div><div className="text-xs text-slate-400">Shipped</div></div>
        <div className="rounded-xl bg-slate-950/60 p-3 text-center"><div className="mb-2 flex items-center justify-center gap-2"><Clock className="h-4 w-4 text-violet-300" /><span className="text-lg font-bold text-violet-300">24/7</span></div><div className="text-xs text-slate-400">Coverage</div></div>
      </div>

      <div className="space-y-3">
        {nodes.map((node) => (
          <NodeCard key={node.id} node={node} onClick={() => setSelectedNode(node)} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-950/60 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white"><MessageSquare className="h-5 w-5 text-cyan-300" />Recent system activity</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /><span className="text-white">RJ Core: reframing Mission Control around system optimization</span><span className="ml-auto text-slate-500">now</span></div>
          <div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-cyan-400" /><span className="text-white">Mission Swarm: summary cards shipped, next trust-layer work identified</span><span className="ml-auto text-slate-500">recent</span></div>
          <div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-yellow-400" /><span className="text-white">Night Watch: live publish path healthy and durable store verified</span><span className="ml-auto text-slate-500">today</span></div>
          <div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-violet-400" /><span className="text-white">Memory Layer: preserved compaction-safe state for next session continuity</span><span className="ml-auto text-slate-500">today</span></div>
        </div>
      </div>

      {selectedNode ? <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} /> : null}
    </div>
  )
}
