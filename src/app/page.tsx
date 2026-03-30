import { GoalProgressDashboard } from '@/components/goal-progress-dashboard'
import { DailyIntelBrief } from '@/components/daily-intel-brief'
import { AccountabilityAlerts } from '@/components/accountability-alerts'
import { OperationsStatus } from '@/components/operations-status'

export default function MissionControl() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-blue-400 mb-2">
                🎯 MISSION CONTROL
              </h1>
              <p className="text-slate-400">
                Personal Command Center - Ryan Darby | 2026 Goals Campaign
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-green-400">
                {new Date().toLocaleTimeString('en-US', { 
                  timeZone: 'America/New_York',
                  hour12: false 
                })} EST
              </div>
              <div className="text-sm text-slate-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Goal Progress - Top Left */}
          <GoalProgressDashboard />
          
          {/* Daily Intel Brief - Top Right */}
          <DailyIntelBrief />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Accountability Alerts - Bottom Left */}
          <AccountabilityAlerts />
          
          {/* Operations Status - Bottom Right */}
          <OperationsStatus />
        </div>
      </div>
    </div>
  )
}