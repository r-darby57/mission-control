'use client'

import { Target, BookOpen, DollarSign, Activity, Award } from 'lucide-react'

interface Goal {
  id: string
  title: string
  icon: React.ReactNode
  current: number
  target: number
  unit: string
  percentage: number
  status: 'on-track' | 'behind' | 'ahead'
  details: string
}

const goals: Goal[] = [
  {
    id: 'cissp',
    title: 'CISSP Certification',
    icon: <Award className="w-5 h-5" />,
    current: 55,
    target: 100,
    unit: '%',
    percentage: 55,
    status: 'on-track',
    details: 'Domain 6 focus - Security Assessment'
  },
  {
    id: 'running',
    title: '1,000 Miles',
    icon: <Activity className="w-5 h-5" />,
    current: 421,
    target: 1000,
    unit: 'miles',
    percentage: 42,
    status: 'behind',
    details: 'Need 19.2 miles/week pace'
  },
  {
    id: 'hysa',
    title: 'Emergency Fund',
    icon: <DollarSign className="w-5 h-5" />,
    current: 40200,
    target: 45000,
    unit: '',
    percentage: 89,
    status: 'ahead',
    details: '$4.8k remaining to target'
  },
  {
    id: 'books',
    title: 'Reading Goal',
    icon: <BookOpen className="w-5 h-5" />,
    current: 4,
    target: 10,
    unit: 'books',
    percentage: 40,
    status: 'on-track',
    details: 'Currently reading: CISSP Official Guide'
  },
  {
    id: 'fitness',
    title: 'Visible 6-Pack',
    icon: <Target className="w-5 h-5" />,
    current: 18,
    target: 12,
    unit: '% body fat',
    percentage: 33,
    status: 'behind',
    details: 'Body recomposition in progress'
  }
]

function ProgressBar({ percentage, status }: { percentage: number; status: Goal['status'] }) {
  const getBarColor = () => {
    switch (status) {
      case 'ahead': return 'bg-green-500'
      case 'on-track': return 'bg-blue-500'
      case 'behind': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-full bg-slate-800 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

function StatusBadge({ status }: { status: Goal['status'] }) {
  const styles = {
    'ahead': 'bg-green-500/10 text-green-400 border-green-500/20',
    'on-track': 'bg-blue-500/10 text-blue-400 border-blue-500/20', 
    'behind': 'bg-red-500/10 text-red-400 border-red-500/20'
  }

  const labels = {
    'ahead': 'AHEAD',
    'on-track': 'ON TRACK',
    'behind': 'BEHIND'
  }

  return (
    <span className={`px-2 py-1 text-xs font-mono rounded border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function GoalProgressDashboard() {
  const formatValue = (current: number, unit: string) => {
    if (unit === '' && current >= 1000) {
      return `$${(current / 1000).toFixed(1)}k`
    }
    return `${current.toLocaleString()}${unit}`
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-blue-400">🎯 2026 GOALS STATUS</h2>
        <div className="text-sm text-slate-400">
          Updated: {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  {goal.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{goal.title}</h3>
                  <p className="text-xs text-slate-400">{goal.details}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg text-white">
                  {formatValue(goal.current, goal.unit)}
                  <span className="text-slate-400 text-sm">
                    /{formatValue(goal.target, goal.unit)}
                  </span>
                </div>
                <StatusBadge status={goal.status} />
              </div>
            </div>
            
            <ProgressBar percentage={goal.percentage} status={goal.status} />
            
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>{goal.percentage}% complete</span>
              <span>{goal.status === 'behind' ? 'Action required' : 'Tracking well'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-sm text-slate-400 mb-1">Overall Campaign Progress</div>
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(goals.reduce((acc, goal) => acc + goal.percentage, 0) / goals.length)}%
          </div>
        </div>
      </div>
    </div>
  )
}