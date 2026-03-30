'use client'

import { Shield, TrendingUp, AlertTriangle, Clock } from 'lucide-react'

interface IntelItem {
  category: 'cybersecurity' | 'fitness' | 'financial' | 'career'
  priority: 'high' | 'medium' | 'low'
  title: string
  summary: string
  actionRequired?: string
  source: string
  timestamp: string
}

const mockIntel: IntelItem[] = [
  {
    category: 'cybersecurity',
    priority: 'high',
    title: 'New NIST AI Security Framework Released',
    summary: 'NIST published updated guidelines for AI system security - directly relevant to your CISO trajectory.',
    actionRequired: 'Review Section 4.2 on AI risk management',
    source: 'NIST.gov',
    timestamp: '2 hours ago'
  },
  {
    category: 'fitness',
    priority: 'medium', 
    title: 'Running Deficit Analysis',
    summary: 'Current pace puts you 23 miles behind 1,000-mile goal. Weather forecast shows optimal conditions this week.',
    actionRequired: 'Add 3 extra miles to weekly schedule',
    source: 'Apple Health + Weather',
    timestamp: '30 minutes ago'
  },
  {
    category: 'career',
    priority: 'high',
    title: 'Federal CISO Positions Trending',
    summary: 'DoD posting 40% more CISO roles with AI/ML requirements. Your Air Force + AI focus positions you well.',
    source: 'USAJobs Intelligence',
    timestamp: '1 hour ago'
  },
  {
    category: 'financial',
    priority: 'low',
    title: 'HYSA Rate Increase Available',
    summary: 'Marcus by Goldman increased rates to 4.75%. Current HYSA at 4.25% - potential $200/year increase.',
    actionRequired: 'Consider rate comparison',
    source: 'Financial Monitor',
    timestamp: '4 hours ago'
  }
]

function PriorityIndicator({ priority }: { priority: IntelItem['priority'] }) {
  const styles = {
    high: 'bg-red-500 animate-pulse',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  
  return <div className={`w-3 h-3 rounded-full ${styles[priority]}`} />
}

function CategoryIcon({ category }: { category: IntelItem['category'] }) {
  const icons = {
    cybersecurity: <Shield className="w-4 h-4" />,
    fitness: <TrendingUp className="w-4 h-4" />,
    financial: <TrendingUp className="w-4 h-4" />,
    career: <AlertTriangle className="w-4 h-4" />
  }
  
  return <div className="text-blue-400">{icons[category]}</div>
}

export function DailyIntelBrief() {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false,
    timeZone: 'America/New_York'
  })
  
  const isPreWorkout = parseInt(currentTime.split(':')[0]) === 5
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-blue-400">📊 DAILY INTEL BRIEF</h2>
        <div className="flex items-center gap-2 text-sm">
          {isPreWorkout && (
            <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-mono">
              PRE-WORKOUT BRIEF
            </span>
          )}
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">{currentTime} EST</span>
        </div>
      </div>

      {/* Priority Summary */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-2">
          🎯 Today&apos;s Mission Priorities
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">•</span>
            <span className="text-white">CISSP Study: 30min Domain 6 practice (Security Assessment)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">•</span>
            <span className="text-white">Running: 6.5 miles to catch up on weekly target</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">•</span>
            <span className="text-white">Reading: 15 pages during commute</span>
          </div>
        </div>
      </div>

      {/* Intelligence Items */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-white">🔍 Intelligence Updates</h3>
        
        {mockIntel.map((item, index) => (
          <div key={index} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
            <div className="flex items-start gap-3 mb-2">
              <PriorityIndicator priority={item.priority} />
              <CategoryIcon category={item.category} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                  <span className="text-xs text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-sm text-slate-300 mb-2">{item.summary}</p>
                
                {item.actionRequired && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded px-3 py-2 mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-blue-400" />
                      <span className="text-xs font-semibold text-blue-400">ACTION REQUIRED:</span>
                    </div>
                    <span className="text-xs text-blue-300">{item.actionRequired}</span>
                  </div>
                )}
                
                <div className="text-xs text-slate-500">Source: {item.source}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="border-t border-slate-700 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">3</div>
            <div className="text-xs text-slate-400">High Priority</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">2</div>
            <div className="text-xs text-slate-400">Action Items</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">94%</div>
            <div className="text-xs text-slate-400">Goal Velocity</div>
          </div>
        </div>
      </div>
    </div>
  )
}