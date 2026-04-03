'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, LayoutGrid, Radar, Moon, Cpu } from 'lucide-react'
import { DailyIntelBrief } from './daily-intel-brief'
import { OperationsStatus } from './operations-status'
import { AgentOfficeView } from './agent-office-view'
import { NightWatchDashboard } from './night-watch-dashboard'

type MobileView = 'overview' | 'intel' | 'ops' | 'night-watch'

interface MobileTab {
  id: MobileView
  label: string
  shortLabel: string
  icon: React.ReactNode
  eyebrow: string
  description: string
  accent: string
  component: React.ReactNode
}

interface MobileSectionProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  accent: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function MobileSection({ title, subtitle, icon, accent, defaultOpen = true, children }: MobileSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-[0_0_0_1px_rgba(30,41,59,0.25)]">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-transform active:scale-[0.99]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 ${accent}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="text-xs text-slate-400">{subtitle}</div>
          </div>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300">
          {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </button>

      {open ? (
        <div className="border-t border-slate-800 px-3 pb-3 pt-3 [&>div]:rounded-xl [&>div]:border-slate-800 [&>div]:bg-slate-950/80">
          {children}
        </div>
      ) : null}
    </section>
  )
}

function CommandChip({ label, value, tone }: { label: string; value: string; tone: 'green' | 'blue' | 'indigo' }) {
  const toneMap = {
    green: 'text-green-400',
    blue: 'text-blue-300',
    indigo: 'text-indigo-300',
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={`mt-1 text-sm font-semibold ${toneMap[tone]}`}>{value}</div>
    </div>
  )
}

export function ModernMobileDashboard() {
  const [activeView, setActiveView] = useState<MobileView>('overview')

  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour12: false,
  })
  const date = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const tabs = useMemo<MobileTab[]>(
    () => [
      {
        id: 'overview',
        label: 'System Overview',
        shortLabel: 'Overview',
        icon: <LayoutGrid className="h-4 w-4" />,
        eyebrow: 'Command summary',
        description: 'Mission Control as RJ’s operating console',
        accent: 'text-blue-400',
        component: (
          <div className="space-y-4">
            <MobileSection
              title="Operations Status"
              subtitle="System health, automation posture, and module confidence"
              icon={<Cpu className="h-5 w-5" />}
              accent="text-emerald-400"
            >
              <OperationsStatus />
            </MobileSection>
            <MobileSection
              title="System Office"
              subtitle="What the machine room is doing right now"
              icon={<LayoutGrid className="h-5 w-5" />}
              accent="text-cyan-400"
              defaultOpen={false}
            >
              <AgentOfficeView />
            </MobileSection>
          </div>
        ),
      },
      {
        id: 'intel',
        label: 'Intel Brief',
        shortLabel: 'Intel',
        icon: <Radar className="h-4 w-4" />,
        eyebrow: 'External signal layer',
        description: 'AI, technology, science, business, and security context',
        accent: 'text-cyan-400',
        component: (
          <div className="space-y-4">
            <MobileSection
              title="Intel Brief"
              subtitle="Curated signal feed for Ryan"
              icon={<Radar className="h-5 w-5" />}
              accent="text-cyan-400"
            >
              <DailyIntelBrief />
            </MobileSection>
          </div>
        ),
      },
      {
        id: 'ops',
        label: 'System Office',
        shortLabel: 'Office',
        icon: <Cpu className="h-4 w-4" />,
        eyebrow: 'Operator internals',
        description: 'Core nodes, reliability, and recent activity',
        accent: 'text-emerald-400',
        component: (
          <div className="space-y-4">
            <MobileSection
              title="RJ System Office"
              subtitle="Core operating nodes and activity feed"
              icon={<Cpu className="h-5 w-5" />}
              accent="text-emerald-400"
            >
              <AgentOfficeView />
            </MobileSection>
          </div>
        ),
      },
      {
        id: 'night-watch',
        label: 'Night Watch',
        shortLabel: 'Watch',
        icon: <Moon className="h-4 w-4" />,
        eyebrow: 'Monitoring + trust',
        description: 'Live overnight status, swarm signals, and builder trust layer',
        accent: 'text-indigo-400',
        component: (
          <div className="space-y-4">
            <MobileSection
              title="Night Watch"
              subtitle="Live monitoring and Mission Swarm trust surface"
              icon={<Moon className="h-5 w-5" />}
              accent="text-indigo-400"
            >
              <NightWatchDashboard />
            </MobileSection>
          </div>
        ),
      },
    ],
    []
  )

  const activeTab = tabs.find((tab) => tab.id === activeView) ?? tabs[0]

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white">
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Mission Control</div>
              <h1 className="mt-1 text-xl font-bold text-blue-400">RJ Operator Console</h1>
              <p className="mt-1 text-xs text-slate-400">System optimization, trust, and intelligence — no self-help dashboard cosplay.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-right shadow-lg shadow-slate-950/40">
              <div className="text-sm font-mono font-semibold text-green-400">{time}</div>
              <div className="text-[10px] text-slate-500">{date} PDT</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <CommandChip label="Status" value="Operational" tone="green" />
            <CommandChip label="Mode" value="Optimization" tone="blue" />
            <CommandChip label="Night Watch" value="Live" tone="indigo" />
          </div>

          <div className="mt-3 -mx-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-1">
              {tabs.map((tab) => {
                const isActive = tab.id === activeView
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`min-w-fit rounded-2xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-blue-500/40 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                        : 'border-slate-800 bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
                      {tab.icon}
                    </div>
                    <div className="text-sm font-semibold">{tab.shortLabel}</div>
                    <div className="mt-0.5 text-[10px] text-slate-500">{tab.eyebrow}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="mb-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-4 py-3.5 shadow-[0_20px_40px_-20px_rgba(37,99,235,0.25)]">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{activeTab.eyebrow}</div>
          <div className="mt-2 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 ${activeTab.accent}`}>
              {activeTab.icon}
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{activeTab.label}</h2>
              <p className="text-xs text-slate-400">{activeTab.description}</p>
            </div>
          </div>
        </div>

        {activeTab.component}
      </div>
    </div>
  )
}
