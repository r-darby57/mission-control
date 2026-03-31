'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Settings, Zap, Clock, CheckCircle2, Activity } from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  status: 'active' | 'idle' | 'busy' | 'offline'
  currentTask: string
  lastActivity: string
  productivity: number
  messagesProcessed: number
  tasksCompleted: number
  position: { x: number; y: number }
  workstation: string
}

const agents: Agent[] = [
  {
    id: 'strategic-command',
    name: 'RJ',
    role: 'Strategic Command',
    avatar: '🎯',
    status: 'active',
    currentTask: 'Coordinating morning briefing compilation',
    lastActivity: '30 seconds ago',
    productivity: 94,
    messagesProcessed: 127,
    tasksCompleted: 8,
    position: { x: 50, y: 20 },
    workstation: 'Command Center'
  },
  {
    id: 'intel-officer',
    name: 'Intel Officer',
    role: 'Cybersecurity Intelligence',
    avatar: '🕵️',
    status: 'busy',
    currentTask: 'Processing NIST framework updates',
    lastActivity: '2 minutes ago',
    productivity: 87,
    messagesProcessed: 45,
    tasksCompleted: 3,
    position: { x: 15, y: 60 },
    workstation: 'Intelligence Station'
  },
  {
    id: 'performance-tracker',
    name: 'Performance Tracker',
    role: 'Health & Fitness Optimization',
    avatar: '💪',
    status: 'active',
    currentTask: 'Analyzing Apple Watch recovery metrics',
    lastActivity: '1 minute ago',
    productivity: 91,
    messagesProcessed: 32,
    tasksCompleted: 5,
    position: { x: 80, y: 60 },
    workstation: 'Performance Lab'
  },
  {
    id: 'study-coordinator',
    name: 'Study Coordinator',
    role: 'CISSP Certification Management',
    avatar: '📚',
    status: 'active',
    currentTask: 'Generating Domain 6 practice questions',
    lastActivity: '45 seconds ago',
    productivity: 89,
    messagesProcessed: 38,
    tasksCompleted: 4,
    position: { x: 20, y: 80 },
    workstation: 'Study Center'
  },
  {
    id: 'finance-controller',
    name: 'Finance Controller',
    role: 'Financial Optimization',
    avatar: '💰',
    status: 'idle',
    currentTask: 'Monitoring HYSA rate changes',
    lastActivity: '5 minutes ago',
    productivity: 85,
    messagesProcessed: 28,
    tasksCompleted: 2,
    position: { x: 75, y: 80 },
    workstation: 'Finance Hub'
  }
]

const statusColors = {
  active: 'bg-green-500 shadow-green-500/50',
  busy: 'bg-yellow-500 shadow-yellow-500/50',
  idle: 'bg-blue-500 shadow-blue-500/50', 
  offline: 'bg-gray-500 shadow-gray-500/50'
}

const statusLabels = {
  active: 'ACTIVE',
  busy: 'BUSY',
  idle: 'IDLE',
  offline: 'OFFLINE'
}

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full m-4 border border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-3xl">{agent.avatar}</div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${statusColors[agent.status]}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{agent.name}</h3>
            <p className="text-slate-400">{agent.role}</p>
            <p className="text-sm text-slate-500">{agent.workstation}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-1">Current Task</h4>
            <p className="text-white">{agent.currentTask}</p>
            <p className="text-xs text-slate-400 mt-1">Last activity: {agent.lastActivity}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center"><div className="text-lg font-bold text-green-400">{agent.productivity}%</div><div className="text-xs text-slate-400">Productivity</div></div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center"><div className="text-lg font-bold text-blue-400">{agent.messagesProcessed}</div><div className="text-xs text-slate-400">Messages</div></div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center"><div className="text-lg font-bold text-yellow-400">{agent.tasksCompleted}</div><div className="text-xs text-slate-400">Tasks Done</div></div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" />Message</button>
            <button className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors flex items-center justify-center gap-2"><Settings className="w-4 h-4" />Configure</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AgentCard({ agent, onClick }: { agent: Agent; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-left hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-2xl">{agent.avatar}</div>
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${statusColors[agent.status]}`} />
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm">{agent.name}</div>
            <div className="text-xs text-slate-400">{agent.role}</div>
            <div className="mt-2 text-xs text-slate-300 leading-relaxed">{agent.currentTask}</div>
          </div>
        </div>
        <span className="text-[10px] text-slate-400">{statusLabels[agent.status]}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-900/70 px-2 py-2"><div className="text-sm font-bold text-green-400">{agent.productivity}%</div><div className="text-[10px] text-slate-500">Prod</div></div>
        <div className="rounded-lg bg-slate-900/70 px-2 py-2"><div className="text-sm font-bold text-blue-400">{agent.messagesProcessed}</div><div className="text-[10px] text-slate-500">Msgs</div></div>
        <div className="rounded-lg bg-slate-900/70 px-2 py-2"><div className="text-sm font-bold text-yellow-400">{agent.tasksCompleted}</div><div className="text-[10px] text-slate-500">Done</div></div>
      </div>
    </button>
  )
}

export function AgentOfficeView() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  const activeAgents = agents.filter(agent => agent.status === 'active').length
  const totalProductivity = Math.round(agents.reduce((acc, agent) => acc + agent.productivity, 0) / agents.length)
  const totalTasks = agents.reduce((acc, agent) => acc + agent.tasksCompleted, 0)
  
  return (
    <div className="bg-slate-900 rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-blue-400 mb-1 md:mb-2">🏢 AGENT OFFICE VIEW</h2>
          <p className="text-sm md:text-base text-slate-400">Real-time strategic command operations center</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-lg md:text-2xl font-mono text-green-400">{currentTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false })} EST</div>
          <div className="text-xs md:text-sm text-slate-400">{activeAgents}/{agents.length} Agents Active</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="flex items-center justify-center gap-2 mb-2"><Activity className="w-4 h-4 text-green-400" /><span className="text-lg font-bold text-green-400">{activeAgents}</span></div><div className="text-xs text-slate-400">Active</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="flex items-center justify-center gap-2 mb-2"><Zap className="w-4 h-4 text-blue-400" /><span className="text-lg font-bold text-blue-400">{totalProductivity}%</span></div><div className="text-xs text-slate-400">Avg Prod</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="flex items-center justify-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-yellow-400" /><span className="text-lg font-bold text-yellow-400">{totalTasks}</span></div><div className="text-xs text-slate-400">Done</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="flex items-center justify-center gap-2 mb-2"><Clock className="w-4 h-4 text-purple-400" /><span className="text-lg font-bold text-purple-400">24/7</span></div><div className="text-xs text-slate-400">Uptime</div></div>
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {agents.map((agent) => <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />)}
        </div>
      )}
      
      <div className="mt-6 bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-400" />Recent Agent Activity</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-white">RJ: Compiling morning briefing intelligence</span><span className="text-slate-400 ml-auto">30s ago</span></div>
          <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 bg-blue-400 rounded-full" /><span className="text-white">Performance Tracker: Updated Apple Watch sync</span><span className="text-slate-400 ml-auto">1m ago</span></div>
          <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 bg-yellow-400 rounded-full" /><span className="text-white">Intel Officer: NIST framework analysis complete</span><span className="text-slate-400 ml-auto">2m ago</span></div>
          <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 bg-purple-400 rounded-full" /><span className="text-white">Study Coordinator: Generated 15 CISSP practice questions</span><span className="text-slate-400 ml-auto">3m ago</span></div>
        </div>
      </div>
      
      {selectedAgent && <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </div>
  )
}
