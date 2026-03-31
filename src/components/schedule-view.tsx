'use client'

import { useEffect, useState } from 'react'
import { Clock, User, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

interface ScheduleEvent {
  id: string
  title: string
  type: 'work' | 'study' | 'workout' | 'meeting' | 'briefing' | 'automation'
  startTime: string
  endTime: string
  agent?: string
  location?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  description?: string
}

const scheduleEvents: ScheduleEvent[] = [
  {
    id: 'event-1',
    title: '5:00 AM Intelligence Briefing',
    type: 'briefing',
    startTime: '05:00',
    endTime: '05:15',
    agent: 'Strategic Command',
    priority: 'critical',
    status: 'scheduled',
    description: 'Automated morning briefing compilation from all agents'
  },
  {
    id: 'event-2', 
    title: 'Morning Workout',
    type: 'workout',
    startTime: '05:45',
    endTime: '07:00',
    location: 'Home Gym',
    priority: 'high',
    status: 'scheduled',
    description: 'Strength training + cardio - Performance Tracker monitoring'
  },
  {
    id: 'event-3',
    title: 'CISSP Study Session',
    type: 'study',
    startTime: '06:00',
    endTime: '06:30',
    agent: 'Study Coordinator',
    priority: 'high',
    status: 'scheduled',
    description: 'Domain 6: Security Assessment and Testing'
  },
  {
    id: 'event-4',
    title: 'Work Block - Air Force Duties',
    type: 'work',
    startTime: '09:30',
    endTime: '16:30',
    location: 'Office',
    priority: 'high',
    status: 'scheduled',
    description: '17D Cyberspace Operations Officer responsibilities'
  },
  {
    id: 'event-5',
    title: 'Agent Coordination Check',
    type: 'automation',
    startTime: '14:00',
    endTime: '14:15',
    agent: 'Strategic Command',
    priority: 'medium',
    status: 'scheduled',
    description: 'Mid-day agent status review and task adjustments'
  },
  {
    id: 'event-6',
    title: 'Evening Run',
    type: 'workout',
    startTime: '17:30',
    endTime: '18:30',
    location: 'West Summerlin',
    priority: 'medium',
    status: 'scheduled',
    description: '6+ miles toward 1,000-mile goal'
  },
  {
    id: 'event-7',
    title: 'CISSP Review Session',
    type: 'study',
    startTime: '20:00',
    endTime: '20:30',
    agent: 'Study Coordinator', 
    priority: 'medium',
    status: 'scheduled',
    description: 'Practice questions and concept review'
  },
  {
    id: 'event-8',
    title: 'Evening Planning Brief',
    type: 'briefing',
    startTime: '21:00',
    endTime: '21:15',
    agent: 'Strategic Command',
    priority: 'medium',
    status: 'scheduled',
    description: 'Next-day preparation and task prioritization'
  }
]

const eventTypeColors = {
  work: 'bg-blue-500/20 border-blue-500 text-blue-400',
  study: 'bg-green-500/20 border-green-500 text-green-400',
  workout: 'bg-red-500/20 border-red-500 text-red-400',
  meeting: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  briefing: 'bg-purple-500/20 border-purple-500 text-purple-400',
  automation: 'bg-slate-500/20 border-slate-500 text-slate-400'
}

const eventTypeIcons = {
  work: '💼',
  study: '📚',
  workout: '💪',
  meeting: '👥',
  briefing: '📊',
  automation: '🤖'
}

const priorityColors = {
  low: 'text-slate-400',
  medium: 'text-blue-400', 
  high: 'text-yellow-400',
  critical: 'text-red-400'
}

const statusColors = {
  scheduled: 'bg-slate-600',
  'in-progress': 'bg-blue-500 animate-pulse',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
}

function EventCard({ event }: { event: ScheduleEvent }) {
  const duration = calculateDuration(event.startTime, event.endTime)
  
  return (
    <div className={`rounded-xl p-3 border-l-4 ${eventTypeColors[event.type]} hover:bg-slate-700/30 transition-all duration-200`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-lg shrink-0">{eventTypeIcons[event.type]}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm leading-tight">{event.title}</h3>
            <div className="mt-1 flex flex-col gap-1 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.startTime} - {event.endTime} ({duration})</span>
              {event.agent && <span className="flex items-center gap-1"><User className="w-3 h-3" />{event.agent}</span>}
              {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-[10px] font-semibold ${priorityColors[event.priority]}`}>{event.priority.toUpperCase()}</span>
          <div className={`w-3 h-3 rounded-full ${statusColors[event.status]}`} />
        </div>
      </div>
      
      {event.description && <p className="text-slate-300 text-xs leading-relaxed">{event.description}</p>}
    </div>
  )
}

function calculateDuration(startTime: string, endTime: string): string {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  const diffMinutes = endMinutes - startMinutes
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function ScheduleView() {
  const [selectedDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<'day' | 'week'>('day')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const todayEvents = scheduleEvents
  const stats = {
    total: todayEvents.length,
    completed: todayEvents.filter(e => e.status === 'completed').length,
    inProgress: todayEvents.filter(e => e.status === 'in-progress').length,
    critical: todayEvents.filter(e => e.priority === 'critical').length
  }
  
  return (
    <div className="bg-slate-900 rounded-lg p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-blue-400 mb-1 md:mb-2">📅 STRATEGIC SCHEDULE</h2>
            <p className="text-sm md:text-base text-slate-400">Daily operations timeline with agent coordination</p>
          </div>
          <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm shrink-0">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <div>
              <div className="text-white font-semibold text-sm">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
              <div className="text-xs text-slate-400">{selectedDate.toLocaleDateString('en-US', { year: 'numeric' })}</div>
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>

          <div className="flex bg-slate-800 rounded-lg p-1 shrink-0">
            <button className={`px-3 py-1 text-xs rounded ${currentView === 'day' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`} onClick={() => setCurrentView('day')}>Day</button>
            <button className={`px-3 py-1 text-xs rounded ${currentView === 'week' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`} onClick={() => setCurrentView('week')}>Week</button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-blue-400">{stats.total}</div><div className="text-xs text-slate-400">Total Events</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-green-400">{stats.completed}</div><div className="text-xs text-slate-400">Completed</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div><div className="text-xs text-slate-400">In Progress</div></div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-red-400">{stats.critical}</div><div className="text-xs text-slate-400">Critical</div></div>
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {todayEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {todayEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
        <h3 className="text-sm font-semibold text-white mb-3">Event Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {Object.entries(eventTypeColors).map(([type, colorClass]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded border-l-4 ${colorClass}`} />
              <span className="text-xs text-slate-400 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
