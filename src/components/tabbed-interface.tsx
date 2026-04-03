'use client'

import { useEffect, useState } from 'react'
import { LayoutGrid, Brain, Moon, Cpu, Radio } from 'lucide-react'
import { AgentOfficeView } from './agent-office-view'
import { MemoryArchive } from './memory-archive'
import { DailyIntelBrief } from './daily-intel-brief'
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
    label: 'System Overview',
    icon: '🧠',
    component: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <OperationsStatus />
          <DailyIntelBrief />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <AgentOfficeView />
        </div>
      </div>
    ),
  },
  {
    id: 'intel',
    label: 'Intel Brief',
    icon: '📡',
    component: DailyIntelBrief,
  },
  {
    id: 'office',
    label: 'System Office',
    icon: '🏢',
    component: AgentOfficeView,
  },
  {
    id: 'memory',
    label: 'Memory Archive',
    icon: '🗂️',
    component: MemoryArchive,
  },
  {
    id: 'night-watch',
    label: 'Night Watch',
    icon: '🌙',
    component: NightWatchDashboard,
  },
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

  const activeTabData = tabs.find((tab) => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component || tabs[0].component

  const mobileNavItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'intel', label: 'Intel', icon: <Radio className="w-4 h-4" /> },
    { id: 'office', label: 'Office', icon: <Cpu className="w-4 h-4" /> },
    { id: 'memory', label: 'Memory', icon: <Brain className="w-4 h-4" /> },
    { id: 'night-watch', label: 'Night Watch', icon: <Moon className="w-4 h-4" /> },
  ]

  if (isMobile) {
    return <ModernMobileDashboard />
  }

  return (
    <div className="min-h-screen bg-slate-950 p-3 text-white md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Mission Control</div>
              <h1 className="mt-2 text-2xl font-bold text-blue-400 md:text-4xl">🧠 RJ OPERATOR CONSOLE</h1>
              <p className="mt-2 text-sm text-slate-400 md:text-base">
                System optimization, Night Watch trust, automation health, and intelligence for Ryan.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-lg font-mono text-green-400 md:text-2xl">
                {new Date().toLocaleTimeString('en-US', {
                  timeZone: 'America/Los_Angeles',
                  hour12: false,
                })} PDT
              </div>
              <div className="text-xs text-slate-400 md:text-sm">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Mode</div>
            <div className="mt-1 text-sm font-semibold text-cyan-300">System Optimization</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Scope</div>
            <div className="mt-1 text-sm font-semibold text-emerald-300">RJ machine room</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Intel</div>
            <div className="mt-1 text-sm font-semibold text-amber-300">AI · tech · science · business</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Night Watch</div>
            <div className="mt-1 text-sm font-semibold text-indigo-300">Live + durable</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-900 p-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-w-fit whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 md:px-4 md:py-3 md:text-sm ${
                  activeTab === tab.id ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="mr-2 text-base md:text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="transition-all duration-300">
          <ActiveComponent />
        </div>

        <div className="mt-6 rounded-lg bg-slate-900 p-3 md:p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:gap-6 md:text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                <span>Operator console live</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span>Intel briefing active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-400" />
                <span>Night Watch active</span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {mobileNavItems.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white transition-colors hover:bg-slate-700 md:text-sm"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
