'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Calendar, Tag, Clock, MessageSquare, Brain, FileText, Star } from 'lucide-react'

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
}

const memoryEntries: MemoryEntry[] = [
  {
    id: 'mem-001',
    type: 'decision',
    title: 'Mission Control Architecture Decision',
    content: 'Decided to build Alex Finn-style Mission Control with focus on real-time agent coordination, Kanban task management, and office view rather than just goal tracking dashboard. Key insight: "The dashboard is optional. The uptime is not."',
    timestamp: '2026-03-30T06:30:00Z',
    tags: ['mission-control', 'architecture', 'alex-finn', 'decision'],
    agent: 'Strategic Command',
    importance: 'critical',
    searchable: 'mission control alex finn architecture dashboard uptime agent coordination kanban office view'
  },
  {
    id: 'mem-002',
    type: 'insight',
    title: 'Multi-Agent Deployment Strategy',
    content: 'Identified need for 5 specialized agents: Strategic Command (RJ), Intel Officer (cybersecurity), Performance Tracker (health/fitness), Study Coordinator (CISSP), and Finance Controller (HYSA goal). Each agent needs dedicated memory compartments and communication protocols.',
    timestamp: '2026-03-29T23:25:00Z',
    tags: ['agents', 'deployment', 'strategy', 'specialization'],
    agent: 'Strategic Command',
    importance: 'high',
    searchable: 'multi agent deployment strategy specialized intel officer performance tracker study coordinator finance controller memory compartments'
  },
  {
    id: 'mem-003',
    type: 'conversation',
    title: 'Moving Company Research - West Summerlin',
    content: 'Ryan requested movers for Wednesday April 1st move in West Summerlin. Researched and provided top 3 recommendations: Family Movers Express (4.58/5, A+ BBB), Move 4 Less LLC (4.66/5), Triple 7 Movers (4.58/5, A+). Key detail: 2-story house, no special items.',
    timestamp: '2026-03-30T06:28:00Z',
    tags: ['moving', 'las-vegas', 'summerlin', 'research', 'recommendations'],
    agent: 'Strategic Command',
    importance: 'medium',
    searchable: 'moving company west summerlin family movers express move 4 less triple 7 movers las vegas april 1st'
  },
  {
    id: 'mem-004',
    type: 'briefing',
    title: 'System Deployment Status - Complete',
    content: 'Successfully completed Phase 2+3 multi-agent deployment. Infrastructure: Enterprise memory system ✅, Local AI (Qwen 2.5 7B) ✅, Mission Control dashboard ✅, Security hardening ✅, 48-hour uptime guarantee ✅. Ready for Monday 5am operational launch.',
    timestamp: '2026-03-29T23:23:00Z',
    tags: ['deployment', 'infrastructure', 'complete', 'qwen', 'security'],
    agent: 'Strategic Command',
    importance: 'critical',
    searchable: 'system deployment complete enterprise memory local ai qwen security hardening uptime mission control'
  },
  {
    id: 'mem-005',
    type: 'insight',
    title: 'Ryan Profile Update - Location Correction',
    content: 'Major profile correction: Ryan is located in Las Vegas, Nevada (NOT Washington DC as initially documented). Lives in West Summerlin area, moving to new house. This affects timezone assumptions and local service recommendations.',
    timestamp: '2026-03-30T06:35:00Z',
    tags: ['profile', 'location', 'correction', 'las-vegas', 'summerlin'],
    agent: 'Strategic Command',
    importance: 'high',
    searchable: 'ryan profile location correction las vegas nevada west summerlin washington dc timezone'
  },
  {
    id: 'mem-006',
    type: 'task',
    title: 'CISSP Domain 6 Focus Priority',
    content: 'Current study focus on CISSP Domain 6: Security Assessment and Testing. This domain shows high relevance for CISO roles and recent trend analysis indicates increased importance in current threat landscape. Recommended practice question generation and real-world application exercises.',
    timestamp: '2026-03-29T22:45:00Z',
    tags: ['cissp', 'domain-6', 'security-assessment', 'ciso', 'study'],
    agent: 'Study Coordinator',
    importance: 'high',
    searchable: 'cissp domain 6 security assessment testing ciso practice questions threat landscape study focus'
  },
  {
    id: 'mem-007',
    type: 'conversation',
    title: '2026 Goals Framework Established',
    content: 'Ryan shared comprehensive 2026 goals: CISSP certification (Dec 2026), 1,000 miles running, $45k HYSA target, 10 books read, visible 6-pack achievement. Built accountability system with tough love messaging and anti-burnout approach based on past calorie tracking failure.',
    timestamp: '2026-03-29T22:30:00Z',
    tags: ['2026-goals', 'cissp', 'running', 'hysa', 'books', 'fitness', 'accountability'],
    agent: 'Strategic Command',
    importance: 'critical',
    searchable: '2026 goals cissp certification running 1000 miles hysa 45k books fitness accountability tough love burnout'
  }
]

const typeIcons = {
  conversation: MessageSquare,
  decision: Star,
  insight: Brain,
  task: FileText,
  briefing: Calendar
}

const typeColors = {
  conversation: 'text-blue-400',
  decision: 'text-yellow-400',
  insight: 'text-purple-400',
  task: 'text-green-400',
  briefing: 'text-red-400'
}

const importanceColors = {
  low: 'border-slate-600',
  medium: 'border-blue-500',
  high: 'border-yellow-500',
  critical: 'border-red-500'
}

const importanceBadges = {
  low: 'bg-slate-500/20 text-slate-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-yellow-500/20 text-yellow-400',
  critical: 'bg-red-500/20 text-red-400'
}

function MemoryCard({ entry }: { entry: MemoryEntry }) {
  const IconComponent = typeIcons[entry.type]
  
  return (
    <div className={`bg-slate-800 rounded-xl p-4 border-l-4 ${importanceColors[entry.importance]} hover:bg-slate-700/50 transition-all duration-200`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <IconComponent className={`w-5 h-5 mt-0.5 shrink-0 ${typeColors[entry.type]}`} />
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm leading-tight">{entry.title}</h3>
            <p className="text-xs text-slate-400 mt-1">by {entry.agent}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`px-2 py-1 text-[10px] rounded ${importanceBadges[entry.importance]}`}>{entry.importance.toUpperCase()}</span>
          <div className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(entry.timestamp).toLocaleDateString()}</div>
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-3 leading-relaxed">{entry.content}</p>
      
      <div className="flex items-center gap-2">
        <Tag className="w-3 h-3 text-slate-400 shrink-0" />
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-400 text-[10px] rounded hover:bg-slate-600 cursor-pointer transition-colors">#{tag}</span>
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
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const agents = [...new Set(memoryEntries.map(entry => entry.agent))]
  const types = ['conversation', 'decision', 'insight', 'task', 'briefing']
  const importanceLevels = ['low', 'medium', 'high', 'critical']
  
  const filteredEntries = useMemo(() => {
    return memoryEntries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.searchable.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = selectedType === 'all' || entry.type === selectedType
      const matchesImportance = selectedImportance === 'all' || entry.importance === selectedImportance
      const matchesAgent = selectedAgent === 'all' || entry.agent === selectedAgent
      
      return matchesSearch && matchesType && matchesImportance && matchesAgent
    })
  }, [searchQuery, selectedType, selectedImportance, selectedAgent])
  
  const stats = {
    total: memoryEntries.length,
    critical: memoryEntries.filter(e => e.importance === 'critical').length,
    decisions: memoryEntries.filter(e => e.type === 'decision').length,
    insights: memoryEntries.filter(e => e.type === 'insight').length
  }
  
  return (
    <div className="bg-slate-900 rounded-lg p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-blue-400 mb-1 md:mb-2">🧠 MEMORY ARCHIVE</h2>
            <p className="text-sm md:text-base text-slate-400">Searchable conversations, decisions, and strategic insights</p>
          </div>
          <div className="text-right text-sm shrink-0">
            <div className="text-white font-bold">{filteredEntries.length}/{stats.total}</div>
            <div className="text-slate-400 text-xs">{stats.critical} Critical</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'} gap-3`}>
            <div className={`${isMobile ? '' : 'lg:col-span-2'} relative`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search memories, decisions, insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none">
              <option value="all">All Types</option>
              {types.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
            </select>
            <select value={selectedImportance} onChange={(e) => setSelectedImportance(e.target.value)} className="px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none">
              <option value="all">All Importance</option>
              {importanceLevels.map(level => <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>)}
            </select>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none">
              <option value="all">All Agents</option>
              {agents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-blue-400">{stats.total}</div><div className="text-xs text-slate-400">Total</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-red-400">{stats.critical}</div><div className="text-xs text-slate-400">Critical</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-yellow-400">{stats.decisions}</div><div className="text-xs text-slate-400">Decisions</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-purple-400">{stats.insights}</div><div className="text-xs text-slate-400">Insights</div></div>
      </div>
      
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12"><Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" /><h3 className="text-lg font-semibold text-slate-400 mb-2">No memories found</h3><p className="text-slate-500">Try adjusting your search or filters</p></div>
        ) : (
          filteredEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(entry => <MemoryCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  )
}
