'use client'

import { useState, useEffect } from 'react'
import { KanbanBoard } from './kanban-board'
import { AgentOfficeView } from './agent-office-view'
import { MemoryArchive } from './memory-archive'
import { ScheduleView } from './schedule-view'
import { GoalProgressDashboard } from './goal-progress-dashboard'
import { DailyIntelBrief } from './daily-intel-brief'
import { AccountabilityAlerts } from './accountability-alerts'
import { OperationsStatus } from './operations-status'
import { ModernMobileDashboard } from './modern-mobile-dashboard'
import { NightWatchDashboard } from './night-watch-dashboard'

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
  },
  {
    id: 'night-watch',
    label: 'Night Watch',
    icon: '🌙',
    component: NightWatchDashboard
  }
]

export function TabbedInterface() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  if (isMobile && activeTab === 'overview') {
    return <ModernMobileDashboard />
  }
  
  const activeTabData = tabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component || tabs[0].component
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-blue-400 mb-2">
                🎯 MISSION CONTROL
              </h1>
              <p className="text-sm md:text-base text-slate-400">
                Strategic Command Center - Ryan's AI-Powered Operations Hub
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-lg md:text-2xl font-mono text-green-400">
                {new Date().toLocaleTimeString('en-US', { 
                  timeZone: 'America/Los_Angeles',
                  hour12: false 
                })} PDT
              </div>
              <div className="text-xs md:text-sm text-slate-400">
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

        <div className="mb-6">
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1 md:gap-2 transition-all duration-200 min-w-fit
                  ${activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }
                `}
              >
                <span className="text-base md:text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="transition-all duration-300">
          <ActiveComponent />
        </div>

        <div className="mt-6 p-3 md:p-4 bg-slate-900 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs md:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="hidden sm:inline">Mission Control v1.0 - Operational</span>
                <span className="sm:hidden">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>5 Agents Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                <span>Night Watch Active</span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button className="px-2 md:px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs md:text-sm whitespace-nowrap">
                Sync
              </button>
              <button className="px-2 md:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs md:text-sm whitespace-nowrap">
                Brief
              </button>
              <button className="px-2 md:px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-xs md:text-sm whitespace-nowrap">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
