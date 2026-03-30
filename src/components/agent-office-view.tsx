'use client'

import { useState, useEffect } from 'react'
import { Bot, Activity, MessageSquare, Settings, Zap, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

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

function AgentAvatar({ agent, onClick }: { agent: Agent; onClick: () => void }) {
  return (
    <div 
      className="absolute cursor-pointer group transition-all duration-300 hover:scale-110"
      style={{ left: `${agent.position.x}%`, top: `${agent.position.y}%` }}
      onClick={onClick}
    >
      <div className="relative">
        {/* Status Ring */}
        <div className={`
          absolute -inset-2 rounded-full animate-pulse
          ${statusColors[agent.status]}
          ${agent.status === 'active' ? 'animate-pulse' : ''}
        `} />
        
        {/* Avatar */}
        <div className="relative w-16 h-16 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center text-2xl hover:border-blue-500 transition-colors">
          {agent.avatar}
        </div>
        
        {/* Status Indicator */}
        <div className={`
          absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950
          ${statusColors[agent.status]}
        `} />
        
        {/* Activity Indicator */}
        {agent.status === 'active' && (
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
          </div>
        )}
      </div>
      
      {/* Hover Info */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 bg-slate-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-slate-700">
        <div className="font-semibold">{agent.name}</div>
        <div className="text-slate-400">{statusLabels[agent.status]}</div>
      </div>
    </div>
  )
}

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full m-4 border border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-3xl">
              {agent.avatar}
            </div>
            <div className={`
              absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800
              ${statusColors[agent.status]}
            `} />
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
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">{agent.productivity}%</div>
              <div className="text-xs text-slate-400">Productivity</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-400">{agent.messagesProcessed}</div>
              <div className="text-xs text-slate-400">Messages</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">{agent.tasksCompleted}</div>
              <div className="text-xs text-slate-400">Tasks Done</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
            <button className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AgentOfficeView() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  const activeAgents = agents.filter(agent => agent.status === 'active').length
  const totalProductivity = Math.round(agents.reduce((acc, agent) => acc + agent.productivity, 0) / agents.length)
  const totalTasks = agents.reduce((acc, agent) => acc + agent.tasksCompleted, 0)
  
  return (
    <div className="bg-slate-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-2">
            🏢 AGENT OFFICE VIEW
          </h2>
          <p className="text-slate-400">
            Real-time Strategic Command Operations Center
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-green-400">
            {currentTime.toLocaleTimeString('en-US', { 
              timeZone: 'America/New_York',
              hour12: false 
            })} EST
          </div>
          <div className="text-sm text-slate-400">
            {activeAgents}/{agents.length} Agents Active
          </div>
        </div>
      </div>
      
      {/* Office Floor Plan */}
      <div className="bg-slate-950 rounded-lg p-8 mb-6 relative min-h-96 border border-slate-700">
        {/* Office Layout Background */}
        <div className="absolute inset-4 border-2 border-dashed border-slate-700 rounded-lg opacity-50" />
        
        {/* Room Labels */}
        <div className="absolute top-6 left-6 text-slate-500 text-sm font-mono">COMMAND CENTER</div>
        <div className="absolute bottom-6 left-6 text-slate-500 text-sm font-mono">OPERATIONS FLOOR</div>
        <div className="absolute bottom-6 right-6 text-slate-500 text-sm font-mono">ANALYSIS LABS</div>
        
        {/* Agent Avatars */}
        {agents.map(agent => (
          <AgentAvatar 
            key={agent.id} 
            agent={agent} 
            onClick={() => setSelectedAgent(agent)} 
          />
        ))}
        
        {/* Connection Lines (showing agent communication) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Strategic Command to all agents */}
          <line x1="50%" y1="20%" x2="15%" y2="60%" stroke="#3b82f6" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="50%" y1="20%" x2="80%" y2="60%" stroke="#3b82f6" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="50%" y1="20%" x2="20%" y2="80%" stroke="#3b82f6" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
          <line x1="50%" y1="20%" x2="75%" y2="80%" stroke="#3b82f6" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" />
        </svg>
      </div>
      
      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-lg font-bold text-green-400">{activeAgents}</span>
          </div>
          <div className="text-sm text-slate-400">Active Agents</div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-bold text-blue-400">{totalProductivity}%</span>
          </div>
          <div className="text-sm text-slate-400">Avg Productivity</div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold text-yellow-400">{totalTasks}</span>
          </div>
          <div className="text-sm text-slate-400">Tasks Completed</div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-bold text-purple-400">24/7</span>
          </div>
          <div className="text-sm text-slate-400">Uptime</div>
        </div>
      </div>
      
      {/* Recent Activity Feed */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          Recent Agent Activity
        </h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white">RJ: Compiling morning briefing intelligence</span>
            <span className="text-slate-400 ml-auto">30s ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-white">Performance Tracker: Updated Apple Watch sync</span>
            <span className="text-slate-400 ml-auto">1m ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-white">Intel Officer: NIST framework analysis complete</span>
            <span className="text-slate-400 ml-auto">2m ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-white">Study Coordinator: Generated 15 CISSP practice questions</span>
            <span className="text-slate-400 ml-auto">3m ago</span>
          </div>
        </div>
      </div>
      
      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailPanel 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </div>
  )
}