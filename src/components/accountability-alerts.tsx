'use client'

import { AlertTriangle, X, CheckCircle, Clock } from 'lucide-react'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  category: 'study' | 'fitness' | 'financial' | 'habits'
  title: string
  message: string
  toughLoveMessage: string
  missedDays?: number
  impact: string
  recovery: string
  deadline?: string
}

const activeAlerts: Alert[] = [
  {
    id: 'cissp-study',
    type: 'critical',
    category: 'study',
    title: 'CISSP Study Deficit',
    message: 'Missed 3 study sessions this week. Current pace insufficient for December exam.',
    toughLoveMessage: 'Air Force Academy graduate can\'t handle 30 minutes of daily study?',
    missedDays: 3,
    impact: 'Exam readiness decreasing by 12% per missed session',
    recovery: 'Double sessions this weekend to catch up',
    deadline: '2 days'
  },
  {
    id: 'running-behind',
    type: 'warning',
    category: 'fitness',
    title: 'Weekly Running Target',
    message: '5.2 miles behind weekly target. Current pace: 13.8/19.2 required.',
    toughLoveMessage: 'Ironman training requires consistency. This isn\'t cutting it.',
    missedDays: 1,
    impact: '1,000-mile goal at risk',
    recovery: 'Add 2.6 miles to next 2 runs'
  },
  {
    id: 'financial-tracking',
    type: 'info',
    category: 'financial',
    title: 'HYSA Contribution',
    message: 'Only $800 contributed this month. Target: $1,250.',
    toughLoveMessage: 'Financial freedom demands discipline. $130k salary, zero debt - no excuses.',
    impact: 'Goal delayed by 1.5 months',
    recovery: 'Transfer additional $450 before month end'
  }
]

function AlertTypeIcon({ type }: { type: Alert['type'] }) {
  const styles = {
    critical: 'text-red-400 animate-pulse',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  
  return <AlertTriangle className={`w-5 h-5 ${styles[type]}`} />
}

function AlertBadge({ type }: { type: Alert['type'] }) {
  const styles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }
  
  const labels = {
    critical: 'CRITICAL',
    warning: 'WARNING', 
    info: 'INFO'
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-mono rounded border ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

function CategoryIcon({ category }: { category: Alert['category'] }) {
  const styles = {
    study: '📚',
    fitness: '💪',
    financial: '💰',
    habits: '⚡'
  }
  
  return <span className="text-lg">{styles[category]}</span>
}

export function AccountabilityAlerts() {
  const criticalCount = activeAlerts.filter(a => a.type === 'critical').length
  const warningCount = activeAlerts.filter(a => a.type === 'warning').length
  
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-red-400">⚠️ ACCOUNTABILITY ALERTS</h2>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {criticalCount} CRITICAL
            </span>
          )}
          {warningCount > 0 && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
              {warningCount} WARNINGS
            </span>
          )}
        </div>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-400 mb-2">All Systems Green</h3>
          <p className="text-slate-400">No accountability deficiencies detected. Outstanding work!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg p-4 border ${
              alert.type === 'critical' 
                ? 'bg-red-500/5 border-red-500/20' 
                : alert.type === 'warning'
                ? 'bg-yellow-500/5 border-yellow-500/20'
                : 'bg-blue-500/5 border-blue-500/20'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                <AlertTypeIcon type={alert.type} />
                <CategoryIcon category={alert.category} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{alert.title}</h3>
                    <AlertBadge type={alert.type} />
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">{alert.message}</p>
                  
                  {/* Tough Love Section */}
                  <div className="bg-slate-800/50 border border-slate-600/30 rounded p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-400 text-xs font-bold">TOUGH LOVE:</span>
                    </div>
                    <p className="text-sm font-medium text-red-300 italic">
                      &quot;{alert.toughLoveMessage}&quot;
                    </p>
                  </div>
                  
                  {/* Impact & Recovery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs font-semibold text-red-400 mb-1">IMPACT:</div>
                      <div className="text-slate-300">{alert.impact}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-green-400 mb-1">RECOVERY:</div>
                      <div className="text-slate-300">{alert.recovery}</div>
                    </div>
                  </div>
                  
                  {alert.deadline && (
                    <div className="mt-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400 font-semibold">
                        Action required within: {alert.deadline}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Action Bar */}
      {activeAlerts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Quick Actions:
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                Mark Progress
              </button>
              <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Reschedule
              </button>
              <button className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                Emergency Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-400">{criticalCount}</div>
            <div className="text-xs text-slate-400">Critical Issues</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">{warningCount}</div>
            <div className="text-xs text-slate-400">Warnings</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">
              {Math.round(((5 - activeAlerts.length) / 5) * 100)}%
            </div>
            <div className="text-xs text-slate-400">Compliance</div>
          </div>
        </div>
      </div>
    </div>
  )
}