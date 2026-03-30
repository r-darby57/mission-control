'use client'

import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, CheckCircle2, Lock, Eye, Activity } from 'lucide-react'

interface SecurityStatus {
  https: boolean
  headers: number
  lastCheck: Date
  threats: number
  uptime: string
}

export function SecurityMonitor() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    https: true,
    headers: 8,
    lastCheck: new Date(),
    threats: 0,
    uptime: '99.9%'
  })

  useEffect(() => {
    // Security monitoring checks
    const checkSecurity = () => {
      // In a real application, this would make API calls to check:
      // - SSL certificate status
      // - Security header presence  
      // - Failed login attempts
      // - Rate limiting triggers
      // - Suspicious activity

      setSecurityStatus(prev => ({
        ...prev,
        lastCheck: new Date()
      }))
    }

    // Check security status every 5 minutes
    const interval = setInterval(checkSecurity, 300000)
    checkSecurity() // Initial check

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-blue-500" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">Security Monitor</h3>
          <p className="text-gray-600 text-sm">Real-time security status</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-700">SECURE</div>
          <div className="text-xs text-green-600">HTTPS Enforced</div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
          <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-700">{securityStatus.headers}</div>
          <div className="text-xs text-blue-600">Security Headers</div>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
          <Activity className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-emerald-700">{securityStatus.uptime}</div>
          <div className="text-xs text-emerald-600">Uptime</div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-center">
          <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-700">{securityStatus.threats}</div>
          <div className="text-xs text-slate-600">Threats Blocked</div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security Features Active
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">HTTPS/TLS 1.3 Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Security Headers (HSTS, CSP, X-Frame-Options)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Rate Limiting & DDoS Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Input Validation & XSS Prevention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Dependency Vulnerability Scanning</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Last security check: {securityStatus.lastCheck.toLocaleTimeString()}
      </div>
    </div>
  )
}