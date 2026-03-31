'use client'

import { useState, useEffect } from 'react'
import { LayoutGrid, ClipboardList, CalendarDays, Building2, Brain, Moon } from 'lucide-react'
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
  
  const activeTabData = tabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component || tabs[0].component

  const mobileNavItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'kanban', label: 'Tasks', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'office', label: 'Office', icon: <Building2 className="w-4 h-4" /> },
    { id: 'memory', label: 'Memory', icon: <Brain className="w-4 h-4" /> },
    { id: 'night-watch', label: 'Night Watch', icon: <Moon className="w-4 h-4" /> },
  ]

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white pb-24">
        <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Mission Control</div>
                <h1 className="mt-1 text-xl font-bold text-blue-400">Strategic Command</h1>
                <p className="mt-1 text-xs text-slate-400">Mobile command interface aligned to desktop</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-right shadow-lg shadow-slate-950/40">
                <div className="text-sm font-mono font-semibold text-green-400">
                  {new Date().toLocaleTimeString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    hour12: false,
                  })}
                </div>
                <div className="text-[10px] text-slate-500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })} PDT
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Status</div>
                <div className="mt-1 text-sm font-semibold text-green-400">Operational</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Agents</div>
                <div className="mt-1 text-sm font-semibold text-blue-300">5 Active</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Night Watch</div>
                <div className="mt-1 text-sm font-semibold text-indigo-300">Live</div>
              </div>
            </div>

            <div className="mt-3 -mx-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 px-1">
                {mobileNavItems.map((item) => {
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`min-w-fit rounded-2xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-blue-500/40 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                          : 'border-slate-800 bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
                        {item.icon}
                      </div>
                      <div className="text-sm font-semibold">{item.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {activeTab === 'overview' ? (
            <ModernMobileDashboard />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-4 py-3.5 shadow-[0_20px_40px_-20px_rgba(37,99,235,0.25)]">
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Command Surface</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-blue-300">
                    {mobileNavItems.find((item) => item.id === activeTab)?.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">{mobileNavItems.find((item) => item.id === activeTab)?.label}</h2>
                    <p className="text-xs text-slate-400">Focused mobile view for this command module</p>
                  </div>
                </div>
              </div>
              <ActiveComponent />
            </div>
          )}
        </div>
      </div>
    )
  }
  
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
