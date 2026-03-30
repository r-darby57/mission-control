'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, Target, Activity, DollarSign, BookOpen, Award, Zap } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  priority?: 'critical' | 'warning' | 'info'
  badge?: number
}

function CollapsibleSection({ title, icon, isOpen, onToggle, children, priority, badge }: CollapsibleSectionProps) {
  const priorityStyles = {
    critical: 'bg-red-50 border-2 border-red-200 shadow-lg shadow-red-100',
    warning: 'bg-amber-50 border-2 border-amber-200 shadow-lg shadow-amber-100',
    info: 'bg-blue-50 border-2 border-blue-200 shadow-lg shadow-blue-100'
  }

  const badgeColors = {
    critical: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white'
  }

  return (
    <div className={`rounded-2xl mb-6 shadow-md ${priority ? priorityStyles[priority] : 'bg-white border-2 border-gray-100 shadow-lg'}`}>
      {/* Touch-friendly header - 56px minimum */}
      <button 
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[56px] transition-all duration-200 hover:bg-white/50 active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          <div className="text-2xl">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-gray-900">{title}</h3>
              {badge && (
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${priority ? badgeColors[priority] : 'bg-gray-500 text-white'} min-w-[32px] text-center`}>
                  {badge}
                </span>
              )}
            </div>
            {priority && (
              <span className={`text-xs font-bold uppercase tracking-wide mt-1 inline-block ${
                priority === 'critical' ? 'text-red-700' :
                priority === 'warning' ? 'text-amber-700' :
                'text-blue-700'
              }`}>
                {priority === 'critical' ? '🚨 NEEDS ATTENTION' : 
                 priority === 'warning' ? '⚠️ MONITOR' : 
                 'ℹ️ INFORMATION'}
              </span>
            )}
          </div>
        </div>
        <div className="p-3 rounded-full hover:bg-gray-100/50 transition-colors">
          {isOpen ? <ChevronDown className="w-6 h-6 text-gray-600" /> : <ChevronRight className="w-6 h-6 text-gray-600" />}
        </div>
      </button>
      
      {/* Collapsible content with animation */}
      {isOpen && (
        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="border-t-2 border-gray-200 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

function ModernGoalCard({ title, progress, target, status, icon, description }: {
  title: string
  progress: number | string
  target: number | string
  status: 'ahead' | 'on-track' | 'behind'
  icon: React.ReactNode
  description: string
}) {
  const statusConfig = {
    'ahead': { 
      bg: 'bg-emerald-50 border-emerald-200', 
      text: 'text-emerald-800', 
      badge: 'bg-emerald-500 text-white',
      progress: 'bg-emerald-500',
      label: '🎯 AHEAD'
    },
    'on-track': { 
      bg: 'bg-blue-50 border-blue-200', 
      text: 'text-blue-800',
      badge: 'bg-blue-500 text-white',
      progress: 'bg-blue-500',
      label: '✅ ON TRACK'
    },
    'behind': { 
      bg: 'bg-red-50 border-red-200', 
      text: 'text-red-800',
      badge: 'bg-red-500 text-white',
      progress: 'bg-red-500',
      label: '🔥 BEHIND'
    }
  }

  const config = statusConfig[status]
  const progressPercent = typeof progress === 'number' && typeof target === 'number' 
    ? Math.round((progress / target) * 100)
    : 50

  return (
    <div className={`rounded-2xl border-2 p-5 mb-4 shadow-md ${config.bg} ${config.text}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl">{icon}</div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">{title}</h4>
            <p className="text-sm text-gray-700 mt-1">{description}</p>
          </div>
        </div>
        <span className={`px-3 py-2 text-xs font-bold rounded-full ${config.badge}`}>
          {config.label}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-xl text-gray-900">{progress}</span>
          <span className="font-mono text-gray-600">of {target}</span>
        </div>
        
        <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${config.progress} shadow-sm`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-mono font-bold text-lg text-gray-900">{progressPercent}% Complete</span>
          <span className="text-sm text-gray-600">
            {status === 'ahead' ? 'Excellent pace!' :
             status === 'on-track' ? 'Stay consistent' :
             'Action needed'}
          </span>
        </div>
      </div>
    </div>
  )
}

function ModernActionButton({ children, onClick, variant = 'primary', icon }: {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  icon?: React.ReactNode
}) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-lg shadow-gray-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200'
  }

  return (
    <button 
      onClick={onClick}
      className={`px-6 py-4 rounded-2xl font-bold text-base transition-all duration-200 min-h-[56px] w-full flex items-center justify-center gap-3 active:scale-95 ${variants[variant]}`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  )
}

export function ModernMobileDashboard() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'critical-alerts': true, // Critical always open
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
    <div className="min-h-screen bg-red-100 pb-32"> {/* TEST: Changed to red to verify Tailwind is loading */}
      
      {/* Modern Header */}
      <div className="bg-white shadow-lg border-b-2 border-blue-100 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-blue-600">Mission Control</h1>
            <p className="text-base font-medium text-gray-700">Strategic Command Center</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono font-bold text-emerald-600">
              {new Date().toLocaleTimeString('en-US', { hour12: false })} PST
            </div>
            <div className="text-sm font-medium text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing */}
      <div className="px-6 py-6">
        
        {/* CRITICAL ALERTS - Prominent positioning */}
        <CollapsibleSection
          title="Critical Alerts"
          icon={<AlertTriangle className="w-7 h-7 text-red-500" />}
          isOpen={openSections['critical-alerts']}
          onToggle={() => toggleSection('critical-alerts')}
          priority="critical"
          badge={2}
        >
          <div className="space-y-5">
            <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-red-500 rounded-full p-2">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-red-900 mb-2">CISSP Study Deficit</h4>
                  <p className="text-red-800 mb-4 leading-relaxed">Missed 3 study sessions this week. Current pace insufficient for December exam.</p>
                  
                  <ModernActionButton 
                    onClick={() => {}} 
                    variant="danger"
                    icon={<BookOpen className="w-5 h-5" />}
                  >
                    Schedule Recovery Sessions
                  </ModernActionButton>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500 rounded-full p-2">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-amber-900 mb-2">Running Target Behind</h4>
                  <p className="text-amber-800 mb-4 leading-relaxed">5.2 miles behind weekly target. Need to add 2.6 miles to next 2 runs.</p>
                  
                  <ModernActionButton 
                    onClick={() => {}} 
                    variant="primary"
                    icon={<Activity className="w-5 h-5" />}
                  >
                    Adjust Running Schedule
                  </ModernActionButton>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* 2026 GOALS PROGRESS */}
        <CollapsibleSection
          title="2026 Goals Progress"
          icon={<Target className="w-7 h-7 text-blue-500" />}
          isOpen={openSections['goals']}
          onToggle={() => toggleSection('goals')}
          badge={5}
        >
          <div className="space-y-2">
            <ModernGoalCard
              title="CISSP Certification"
              progress={55}
              target={100}
              status="on-track"
              icon={<Award className="w-6 h-6" />}
              description="Domain 6 focus - Security Assessment"
            />
            
            <ModernGoalCard
              title="1,000 Miles Running"
              progress="421"
              target="1,000"
              status="behind"
              icon={<Activity className="w-6 h-6" />}
              description="Need 19.2 miles/week pace"
            />
            
            <ModernGoalCard
              title="Emergency Fund"
              progress="$40.2k"
              target="$45.0k"
              status="ahead"
              icon={<DollarSign className="w-6 h-6" />}
              description="$4.8k remaining to target"
            />
            
            <ModernGoalCard
              title="Reading Goal"
              progress="4"
              target="10"
              status="on-track"
              icon={<BookOpen className="w-6 h-6" />}
              description="Currently reading: CISSP Official Guide"
            />
          </div>
        </CollapsibleSection>

        {/* INTELLIGENCE BRIEF */}
        <CollapsibleSection
          title="Daily Intelligence Brief"
          icon={<Zap className="w-7 h-7 text-emerald-500" />}
          isOpen={openSections['intel']}
          onToggle={() => toggleSection('intel')}
          priority="info"
          badge={4}
        >
          <div className="space-y-5">
            <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-5 shadow-lg">
              <h4 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
                🎯 Today's Mission Priorities
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-gray-800 font-medium">CISSP Study: 30min Domain 6 practice</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-gray-800 font-medium">Running: 6.5 miles to catch up on weekly target</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-gray-800 font-medium">Reading: 15 pages during commute</span>
                </li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* OPERATIONS STATUS */}
        <CollapsibleSection
          title="Operations Status"
          icon={<CheckCircle2 className="w-7 h-7 text-emerald-500" />}
          isOpen={openSections['operations']}
          onToggle={() => toggleSection('operations')}
          priority="info"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-3xl font-black text-emerald-700">4/5</div>
                <div className="text-sm font-bold text-emerald-800">Agents Active</div>
              </div>
              <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-3xl font-black text-blue-700">91%</div>
                <div className="text-sm font-bold text-blue-800">Performance</div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

      </div>

      {/* Modern Floating Action Buttons with safe area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-6 pb-12"> {/* Extra pb for safe area */}
        <div className="space-y-3">
          <ModernActionButton 
            onClick={() => {}} 
            variant="primary"
            icon={<Zap className="w-6 h-6" />}
          >
            Generate Intelligence Brief
          </ModernActionButton>
          <div className="grid grid-cols-2 gap-3">
            <ModernActionButton onClick={() => {}} variant="secondary">
              Sync Data
            </ModernActionButton>
            <ModernActionButton onClick={() => {}} variant="success">
              Mark Complete
            </ModernActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}