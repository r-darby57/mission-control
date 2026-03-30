'use client'

import { useState } from 'react'
import { KanbanBoard } from './kanban-board'
import { AgentOfficeView } from './agent-office-view'
import { MemoryArchive } from './memory-archive'
import { ScheduleView } from './schedule-view'
import { GoalProgressDashboard } from './goal-progress-dashboard'
import { DailyIntelBrief } from './daily-intel-brief'
import { AccountabilityAlerts } from './accountability-alerts'
import { OperationsStatus } from './operations-status'

interface Tab {
  id: string
  label: string
  icon: string
  component: React.ComponentType
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Mission Overview',
    icon: '🎯',
    component: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GoalProgressDashboard />
          <DailyIntelBrief />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AccountabilityAlerts />
          <OperationsStatus />
        </div>
      </div>
    )
  },
  {
    id: 'kanban',
    label: 'Task Management',
    icon: '📋',
    component: KanbanBoard
  },
  {
    id: 'schedule',
    label: 'Strategic Schedule',
    icon: '📅',
    component: ScheduleView
  },
  {
    id: 'office',
    label: 'Agent Office',
    icon: '🏢',
    component: AgentOfficeView
  },
  {
    id: 'memory',
    label: 'Memory Archive',
    icon: '🧠',
    component: MemoryArchive
  }
]

export function TabbedInterface() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const activeTabData = tabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component || tabs[0].component
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-blue-400 mb-2">
                🎯 MISSION CONTROL
              </h1>
              <p className="text-slate-400">
                Strategic Command Center - Ryan's AI-Powered Operations Hub
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-green-400">
                {new Date().toLocaleTimeString('en-US', { 
                  timeZone: 'America/Los_Angeles',
                  hour12: false 
                })} PDT
              </div>
              <div className="text-sm text-slate-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="transition-all duration-300">
          <ActiveComponent />
        </div>

        {/* System Status Bar */}
        <div className="mt-8 p-4 bg-slate-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Mission Control v1.0 - Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>5 Agents Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span>Uptime: 48h Guaranteed</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
                Sync All
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                Generate Brief
              </button>
              <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-400">94%</div>
            <div className="text-xs text-slate-400">System Health</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-400">12</div>
            <div className="text-xs text-slate-400">Active Tasks</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">7</div>
            <div className="text-xs text-slate-400">Memory Entries</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-400">8</div>
            <div className="text-xs text-slate-400">Scheduled Events</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-400">2</div>
            <div className="text-xs text-slate-400">Critical Alerts</div>
          </div>
        </div>
      </div>
    </div>
  )
}