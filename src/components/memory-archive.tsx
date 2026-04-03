'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Calendar, Tag, Clock, MessageSquare, Brain, FileText, Star, Database, Layers3 } from 'lucide-react'

interface MemoryEntry {
  id: string
  type: 'conversation' | 'decision' | 'insight' | 'task' | 'briefing'
  title: string
  content: string
  timestamp: string
  tags: string[]
  agent: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  searchable: string
  sourceFile?: string
  scope?: 'long-term' | 'daily' | 'open-loops' | 'decisions' | 'projects'
}

interface MemoryArchivePayload {
  items: MemoryEntry[]
  profile?: {
    static?: string[]
    dynamic?: string[]
    openLoops?: string[]
    projects?: string[]
    summary?: string
  }
  index?: {
    scopes?: Array<{ scope: string; count: number }>
    recentTitles?: Array<{ title: string; scope: string; timestamp: string }>
    topTags?: Array<{ tag: string; count: number }>
  }
  meta?: {
    source?: string
    total?: number
    generatedAt?: string
  }
}

const typeIcons = {
  conversation: MessageSquare,
  decision: Star,
  insight: Brain,
  task: FileText,
  briefing: Calendar,
}

const typeColors = {
  conversation: 'text-blue-400',
  decision: 'text-yellow-400',
  insight: 'text-purple-400',
  task: 'text-green-400',
  briefing: 'text-red-400',
}

const importanceColors = {
  low: 'border-slate-600',
  medium: 'border-blue-500',
  high: 'border-yellow-500',
  critical: 'border-red-500',
}

const importanceBadges = {
  low: 'bg-slate-500/20 text-slate-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-yellow-500/20 text-yellow-400',
  critical: 'bg-red-500/20 text-red-400',
}

const scopeBadgeStyles: Record<string, string> = {
  'long-term': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  'daily': 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  'open-loops': 'bg-red-500/10 text-red-300 border-red-500/20',
  'decisions': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  'projects': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
}

function MemoryCard({ entry }: { entry: MemoryEntry }) {
  const IconComponent = typeIcons[entry.type]

  return (
    <div className={`rounded-xl border-l-4 bg-slate-800 p-4 transition-all duration-200 hover:bg-slate-700/50 ${importanceColors[entry.importance]}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <IconComponent className={`mt-0.5 h-5 w-5 shrink-0 ${typeColors[entry.type]}`} />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight text-white">{entry.title}</h3>
            <p className="mt-1 text-xs text-slate-400">by {entry.agent}{entry.sourceFile ? ` · ${entry.sourceFile}` : ''}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`rounded px-2 py-1 text-[10px] ${importanceBadges[entry.importance]}`}>{entry.importance.toUpperCase()}</span>
          {entry.scope ? <span className={`rounded border px-2 py-1 text-[10px] ${scopeBadgeStyles[entry.scope] || 'border-slate-700 text-slate-300'}`}>{entry.scope}</span> : null}
          <div className="flex items-center gap-1 text-[10px] text-slate-500"><Clock className="h-3 w-3" />{new Date(entry.timestamp).toLocaleDateString()}</div>
        </div>
      </div>

      <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{entry.content}</p>

      <div className="flex items-center gap-2">
        <Tag className="h-3 w-3 shrink-0 text-slate-400" />
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span key={tag} className="cursor-pointer rounded bg-slate-700 px-2 py-1 text-[10px] text-slate-400 transition-colors hover:bg-slate-600">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MemoryArchive() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedImportance, setSelectedImportance] = useState<string>('all')
  const [selectedAgent, setSelectedAgent] = useState<string>('all')
  const [selectedScope, setSelectedScope] = useState<string>('all')
  const [isMobile, setIsMobile] = useState(false)
  const [data, setData] = useState<MemoryArchivePayload>({ items: [] })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    async function load() {
      try {
        const res = await fetch('/api/memory/archive')
        if (!res.ok) throw new Error('Failed to load memory archive')
        const json = await res.json()
        setData(json)
      } catch {
        setData({ items: [] })
      }
    }

    load()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const memoryEntries = data.items || []
  const agents = [...new Set(memoryEntries.map((entry) => entry.agent))]
  const types = ['conversation', 'decision', 'insight', 'task', 'briefing']
  const importanceLevels = ['low', 'medium', 'high', 'critical']
  const scopes = ['long-term', 'daily', 'open-loops', 'decisions', 'projects']

  const filteredEntries = useMemo(() => {
    return memoryEntries.filter((entry) => {
      const matchesSearch = searchQuery === '' ||
        entry.searchable.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = selectedType === 'all' || entry.type === selectedType
      const matchesImportance = selectedImportance === 'all' || entry.importance === selectedImportance
      const matchesAgent = selectedAgent === 'all' || entry.agent === selectedAgent
      const matchesScope = selectedScope === 'all' || entry.scope === selectedScope

      return matchesSearch && matchesType && matchesImportance && matchesAgent && matchesScope
    })
  }, [memoryEntries, searchQuery, selectedType, selectedImportance, selectedAgent, selectedScope])

  const stats = {
    total: memoryEntries.length,
    critical: memoryEntries.filter((e) => e.importance === 'critical').length,
    decisions: memoryEntries.filter((e) => e.type === 'decision').length,
    insights: memoryEntries.filter((e) => e.type === 'insight').length,
  }

  return (
    <div className="rounded-lg bg-slate-900 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="mb-1 text-lg font-bold text-blue-400 md:text-2xl">🧠 MEMORY ARCHIVE</h2>
            <p className="text-sm text-slate-400 md:text-base">Scoped memory, profile synthesis, and local retrieval inspired by the good parts of Supermemory.</p>
          </div>
          <div className="shrink-0 text-right text-sm">
            <div className="font-bold text-white">{filteredEntries.length}/{stats.total}</div>
            <div className="text-xs text-slate-400">{stats.critical} Critical</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Database className="h-4 w-4 text-cyan-300" />Profile snapshot</div>
            <div className="text-sm text-slate-300">{data.profile?.summary || 'No synthesized profile available yet.'}</div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Static profile</div>
                <div className="mt-2 space-y-1 text-sm text-slate-300">
                  {(data.profile?.static || []).slice(0, 6).map((item, idx) => <div key={idx}>• {item}</div>)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Recent context</div>
                <div className="mt-2 space-y-1 text-sm text-slate-300">
                  {(data.profile?.dynamic || []).slice(0, 6).map((item, idx) => <div key={idx}>• {item}</div>)}
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Open loops</div>
                <div className="mt-2 space-y-1 text-sm text-slate-300">
                  {(data.profile?.openLoops || []).slice(0, 4).map((item, idx) => <div key={idx}>• {item}</div>)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Project threads</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(data.profile?.projects || []).slice(0, 6).map((item, idx) => <span key={idx} className="rounded bg-slate-700 px-2 py-1 text-[11px] text-slate-300">{item}</span>)}
                </div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">Source: {data.meta?.source || 'unknown'} · Generated {data.meta?.generatedAt ? new Date(data.meta.generatedAt).toLocaleString() : 'unknown'}</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Layers3 className="h-4 w-4 text-emerald-300" />Memory index</div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {(data.index?.scopes || []).map((scope) => (
                <div key={scope.scope} className="rounded-lg bg-slate-900/70 px-3 py-2 text-center">
                  <div className="text-sm font-semibold text-white">{scope.count}</div>
                  <div className="text-[11px] text-slate-500">{scope.scope}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Recent titles</div>
                <div className="mt-2 space-y-2">
                  {(data.index?.recentTitles || []).slice(0, 6).map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="rounded bg-slate-900/70 px-3 py-2">
                      <div className="text-sm text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.scope} · {new Date(item.timestamp).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Top tags</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(data.index?.topTags || []).slice(0, 10).map((item) => (
                    <span key={item.tag} className="rounded border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-300">#{item.tag} · {item.count}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'}`}>
            <div className={`${isMobile ? '' : 'lg:col-span-2'} relative`}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search memories, decisions, insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2.5 pl-10 pr-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select value={selectedScope} onChange={(e) => setSelectedScope(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-white outline-none focus:border-blue-500">
              <option value="all">All Scopes</option>
              {scopes.map((scope) => <option key={scope} value={scope}>{scope}</option>)}
            </select>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-white outline-none focus:border-blue-500">
              <option value="all">All Types</option>
              {types.map((type) => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
            </select>
            <select value={selectedImportance} onChange={(e) => setSelectedImportance(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-white outline-none focus:border-blue-500">
              <option value="all">All Importance</option>
              {importanceLevels.map((level) => <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>)}
            </select>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2.5 text-white outline-none focus:border-blue-500">
              <option value="all">All Agents</option>
              {agents.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-slate-800/50 p-3 text-center"><div className="text-2xl font-bold text-blue-400">{stats.total}</div><div className="text-xs text-slate-400">Total</div></div>
        <div className="rounded-lg bg-slate-800/50 p-3 text-center"><div className="text-2xl font-bold text-red-400">{stats.critical}</div><div className="text-xs text-slate-400">Critical</div></div>
        <div className="rounded-lg bg-slate-800/50 p-3 text-center"><div className="text-2xl font-bold text-yellow-400">{stats.decisions}</div><div className="text-xs text-slate-400">Decisions</div></div>
        <div className="rounded-lg bg-slate-800/50 p-3 text-center"><div className="text-2xl font-bold text-purple-400">{stats.insights}</div><div className="text-xs text-slate-400">Insights</div></div>
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="py-12 text-center"><Brain className="mx-auto mb-4 h-16 w-16 text-slate-600" /><h3 className="mb-2 text-lg font-semibold text-slate-400">No memories found</h3><p className="text-slate-500">Try adjusting your search or filters</p></div>
        ) : (
          filteredEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry) => <MemoryCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  )
}
