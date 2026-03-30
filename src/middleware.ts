import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, securityLog } from './lib/security'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Get client IP for rate limiting
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  
  // Rate limiting check
  if (!checkRateLimit(clientIP, 1000, 60000)) { // 1000 requests per minute
    securityLog('Rate limit exceeded', { ip: clientIP, path: request.nextUrl.pathname })
    return NextResponse.json(
      { error: 'Too many requests' }, 
      { status: 429 }
    )
  }
  
  // Security logging for suspicious activity
  const suspiciousPatterns = [
    /\.(php|asp|jsp|cgi)$/i,
    /wp-admin|wp-login|phpmyadmin/i,
    /\.\.|\/etc\/passwd|cmd\.exe/i,
    /<script|javascript:|vbscript:/i
  ]
  
  if (suspiciousPatterns.some(pattern => pattern.test(request.nextUrl.pathname))) {
    securityLog('Suspicious request detected', { 
      ip: clientIP, 
      path: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent')
    })
  }
  
  // Block common attack patterns
  if (request.nextUrl.pathname.includes('..') || 
      request.nextUrl.pathname.includes('wp-admin') ||
      request.nextUrl.pathname.includes('.php')) {
    return NextResponse.json(
      { error: 'Forbidden' }, 
      { status: 403 }
    )
  }
  
  // Add additional security headers (complement next.config.js)
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  response.headers.set('X-Request-ID', crypto.randomUUID())
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}