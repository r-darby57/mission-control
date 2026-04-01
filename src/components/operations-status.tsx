'use client'

import { Bot, Activity, Zap, Database, Globe, Shield } from 'lucide-react'
import { CronOpsCard } from './cron-ops-card'

interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'offline' | 'error'
  currentTask: string
  lastUpdate: string
  performance: number
  priority: 'high' | 'medium' | 'low'
}

const agents: Agent[] = [
  {
    id: 'research-agent',
    name: 'Intel Officer',
    role: 'Research & Analysis',
    status: 'active',
    currentTask: 'Scanning CISSP forums for Domain 6 updates',
    lastUpdate: '2 minutes ago',
    performance: 94,
    priority: 'high'
  },
  {
    id: 'fitness-agent', 
    name: 'Performance Tracker',
    role: 'Health & Fitness',
    status: 'active',
    currentTask: 'Processing Apple Watch running data',
    lastUpdate: '5 minutes ago',
    performance: 87,
    priority: 'high'
  },
  {
    id: 'finance-agent',
    name: 'Finance Controller',
    role: 'Financial Monitoring',
    status: 'idle',
    currentTask: 'Awaiting banking API updates',
    lastUpdate: '15 minutes ago',
    performance: 91,
    priority: 'medium'
  },
  {
    id: 'study-agent',
    name: 'Study Coordinator',
    role: 'Learning Management',
    status: 'active',
    currentTask: 'Generating Domain 6 practice questions',
    lastUpdate: '1 minute ago',
    performance: 89,
    priority: 'high'
  },
  {
    id: 'scheduler-agent',
    name: 'Mission Planner',
    role: 'Task Scheduling',
    status: 'active',
    currentTask: 'Optimizing weekly running schedule',
    lastUpdate: '3 minutes ago',
    performance: 92,
    priority: 'medium'
  }
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
    name: 'Local AI Model',
    value: 'Qwen 2.5 7B',
    status: 'good',
    icon: <Bot className="w-4 h-4" />,
    description: 'Running optimally'
  },
  {
    name: 'Memory System',
    value: '5-Layer Active',
    status: 'good', 
    icon: <Database className="w-4 h-4" />,
    description: 'All layers operational'
  },
  {
    name: 'Security Status',
    value: 'LOW Risk',
    status: 'good',
    icon: <Shield className="w-4 h-4" />,
    description: '4 acceptable warnings'
  },
  {
    name: 'API Connectivity',
    value: '98.7% Uptime',
    status: 'good',
    icon: <Globe className="w-4 h-4" />,
    description: 'All services online'
  }
]

function StatusIndicator({ status }: { status: Agent['status'] }) {
  const styles = {
    active: 'bg-green-500 animate-pulse',
    idle: 'bg-yellow-500',
    offline: 'bg-gray-500',
    error: 'bg-red-500 animate-pulse'
  }
  
  return <div className={`w-3 h-3 rounded-full ${styles[status]}`} />
}

function PriorityBadge({ priority }: { priority: Agent['priority'] }) {
  const styles = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-green-500/10 text-green-400 border-green-500/20'
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-mono rounded border ${styles[priority]}`}>
      {priority.toUpperCase()}
    </span>
  )
}

function PerformanceBar({ performance }: { performance: number }) {
  const getColor = () => {
    if (performance >= 90) return 'bg-green-500'
    if (performance >= 75) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  return (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
        style={{ width: `${performance}%` }}
      />
    </div>
  )
}

function MetricStatus({ status }: { status: SystemMetric['status'] }) {
  const styles = {
    good: 'text-green-400',
    warning: 'text-yellow-400', 
    critical: 'text-red-400'
  }
  
  const icons = {
    good: '✓',
    warning: '⚠',
    critical: '✗'
  }
  
  return <span className={`font-mono ${styles[status]}`}>{icons[status]}</span>
}

export function OperationsStatus() {
  const activeAgents = agents.filter(a => a.status === 'active').length
  const avgPerformance = Math.round(agents.reduce((acc, a) => acc + a.performance, 0) / agents.length)
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-400">🤖 OPERATIONS STATUS</h2>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-mono">
            {activeAgents}/{agents.length} ACTIVE
          </span>
        </div>
      </div>

      {/* Agent Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">🎯 Agent Operations</h3>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <StatusIndicator status={agent.status} />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
                    <p className="text-xs text-slate-400">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-white">{agent.performance}%</span>
                  <PriorityBadge priority={agent.priority} />
                </div>
              </div>
              
              <div className="mb-2">
                <p className="text-sm text-slate-300">{agent.currentTask}</p>
                <p className="text-xs text-slate-500">Last update: {agent.lastUpdate}</p>
              </div>
              
              <PerformanceBar performance={agent.performance} />
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚙️ System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systemMetrics.map((metric) => (
            <div key={metric.name} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="text-blue-400">{metric.icon}</div>
                  <span className="text-sm font-semibold text-white">{metric.name}</span>
                </div>
                <MetricStatus status={metric.status} />
              </div>
              <div className="text-sm text-slate-300 mb-1">{metric.value}</div>
              <div className="text-xs text-slate-500">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button className="px-3 py-2 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Restart All
          </button>
          <button className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Sync Data
          </button>
          <button className="px-3 py-2 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-colors">
            Health Check
          </button>
          <button className="px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            Emergency Stop
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="pt-4 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">{activeAgents}</div>
            <div className="text-xs text-slate-400">Active Agents</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">{avgPerformance}%</div>
            <div className="text-xs text-slate-400">Avg Performance</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">98.7%</div>
            <div className="text-xs text-slate-400">System Uptime</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <CronOpsCard />
      </div>
    </div>
  )
}