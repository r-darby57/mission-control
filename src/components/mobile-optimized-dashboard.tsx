'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, Target, Activity, DollarSign, BookOpen, Award } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  priority?: 'critical' | 'warning' | 'info'
}

function CollapsibleSection({ title, icon, isOpen, onToggle, children, priority }: CollapsibleSectionProps) {
  const priorityColors = {
    critical: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  }

  const borderColors = {
    critical: 'border-red-200',
    warning: 'border-yellow-200', 
    info: 'border-blue-200'
  }

  return (
    <div className={`rounded-lg border mb-4 ${priority ? priorityColors[priority] : 'bg-white border-gray-200'}`}>
      {/* Touch-friendly header */}
      <button 
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <div className="text-xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
            {priority && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                priority === 'critical' ? 'bg-red-100 text-red-800' :
                priority === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {priority.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="p-2">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>
      
      {/* Collapsible content */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}

function GoalCard({ title, progress, target, status, icon, description }: {
  title: string
  progress: number | string
  target: number | string
  status: 'ahead' | 'on-track' | 'behind'
  icon: React.ReactNode
  description: string
}) {
  const statusColors = {
    'ahead': 'bg-green-100 text-green-800 border-green-200',
    'on-track': 'bg-blue-100 text-blue-800 border-blue-200', 
    'behind': 'bg-red-100 text-red-800 border-red-200'
  }

  const progressColors = {
    'ahead': 'bg-green-500',
    'on-track': 'bg-blue-500',
    'behind': 'bg-red-500'
  }

  const progressPercent = typeof progress === 'number' && typeof target === 'number' 
    ? Math.round((progress / target) * 100)
    : 50

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-blue-500 text-xl">{icon}</div>
          <div>
            <h4 className="font-semibold text-base text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}>
          {status === 'ahead' ? 'AHEAD' : status === 'on-track' ? 'ON TRACK' : 'BEHIND'}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono font-semibold text-gray-900">{progress}/{target}</span>
          <span className="font-mono text-gray-600">{progressPercent}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${progressColors[status]}`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function QuickActionButton({ children, onClick, variant = 'primary' }: {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  }

  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors min-h-[48px] w-full ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export function MobileOptimizedDashboard() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'critical-alerts': true, // Critical items open by default
    'goals': false,
    'intel': false,
    'operations': false
  })

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* Add bottom padding for floating actions */}
      {/* Simplified Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Mission Control</h1>
            <p className="text-sm text-gray-600">Strategic Command Center</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono text-green-600">
              {new Date().toLocaleTimeString('en-US', { hour12: false })} PST
            </div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        
        {/* Critical Alerts - Always Visible Priority */}
        <CollapsibleSection
          title="Critical Alerts (2)"
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          isOpen={openSections['critical-alerts']}
          onToggle={() => toggleSection('critical-alerts')}
          priority="critical"
        >
          <div className="space-y-4 mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">CISSP Study Deficit</h4>
                  <p className="text-red-800 text-sm mb-3">Missed 3 study sessions this week. Current pace insufficient for December exam.</p>
                  
                  <QuickActionButton onClick={() => {}} variant="danger">
                    Schedule Recovery Sessions
                  </QuickActionButton>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-1">Running Target Behind</h4>
                  <p className="text-yellow-800 text-sm mb-3">5.2 miles behind weekly target. Need to add 2.6 miles to next 2 runs.</p>
                  
                  <QuickActionButton onClick={() => {}} variant="primary">
                    Adjust Running Schedule
                  </QuickActionButton>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2026 Goals Progress */}
        <CollapsibleSection
          title="2026 Goals Progress"
          icon={<Target className="w-6 h-6 text-blue-500" />}
          isOpen={openSections['goals']}
          onToggle={() => toggleSection('goals')}
        >
          <div className="mt-4 space-y-1">
            <GoalCard
              title="CISSP Certification"
              progress={55}
              target={100}
              status="on-track"
              icon={<Award className="w-5 h-5" />}
              description="Domain 6 focus - Security Assessment"
            />
            
            <GoalCard
              title="1,000 Miles Running"
              progress="421 miles"
              target="1,000 miles"
              status="behind"
              icon={<Activity className="w-5 h-5" />}
              description="Need 19.2 miles/week pace"
            />
            
            <GoalCard
              title="Emergency Fund"
              progress="$40.2k"
              target="$45.0k"
              status="ahead"
              icon={<DollarSign className="w-5 h-5" />}
              description="$4.8k remaining to target"
            />
            
            <GoalCard
              title="Reading Goal"
              progress="4 books"
              target="10 books"
              status="on-track"
              icon={<BookOpen className="w-5 h-5" />}
              description="Currently reading: CISSP Official Guide"
            />
          </div>
        </CollapsibleSection>

        {/* Intelligence Brief */}
        <CollapsibleSection
          title="Daily Intelligence Brief"
          icon={<Activity className="w-6 h-6 text-green-500" />}
          isOpen={openSections['intel']}
          onToggle={() => toggleSection('intel')}
        >
          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Today's Mission Priorities</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>CISSP Study: 30min Domain 6 practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Running: 6.5 miles to catch up on weekly target</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Reading: 15 pages during commute</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">🔍 Intelligence Updates</h4>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 text-sm">New NIST AI Security Framework Released</h5>
                    <p className="text-gray-600 text-sm mt-1">NIST published updated guidelines for AI system security - directly relevant to your CISO trajectory.</p>
                    <div className="mt-3">
                      <QuickActionButton onClick={() => {}} variant="primary">
                        Review Section 4.2
                      </QuickActionButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Operations Status */}
        <CollapsibleSection
          title="Operations Status"
          icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          isOpen={openSections['operations']}
          onToggle={() => toggleSection('operations')}
        >
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">4/5</div>
                <div className="text-xs text-green-700">Agents Active</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">91%</div>
                <div className="text-xs text-blue-700">Avg Performance</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">Intel Officer</h5>
                      <p className="text-xs text-gray-600">Scanning CISSP forums for Domain 6 updates</p>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-gray-900">94%</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton onClick={() => {}} variant="primary">
            Generate Brief
          </QuickActionButton>
          <QuickActionButton onClick={() => {}} variant="secondary">
            Sync All Data
          </QuickActionButton>
        </div>
      </div>
    </div>
  )
}