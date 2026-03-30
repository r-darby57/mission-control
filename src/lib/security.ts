// Security utilities for Mission Control

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/script/gi, '')
    .trim();
}

/**
 * Validate and sanitize mission control data
 */
export function validateInput(input: unknown, type: 'string' | 'number' | 'boolean'): boolean {
  switch (type) {
    case 'string':
      return typeof input === 'string' && input.length > 0 && input.length < 1000;
    case 'number':
      return typeof input === 'number' && !isNaN(input) && isFinite(input);
    case 'boolean':
      return typeof input === 'boolean';
    default:
      return false;
  }
}

/**
 * Rate limiting helpers (simple in-memory for static sites)
 */
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  // Clean up old entries
  if (record && (now - record.timestamp) > windowMs) {
    rateLimitStore.delete(identifier);
    return true;
  }
  
  if (!record) {
    rateLimitStore.set(identifier, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  record.count++;
  return true;
}

/**
 * Security logging (in production, send to monitoring service)
 */
export function securityLog(event: string, details: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🔒 Security Event: ${event}`, details);
  }
  
  // In production, you'd send this to a monitoring service like:
  // - Sentry
  // - LogRocket  
  // - DataDog
  // - CloudWatch
}

/**
 * Generate secure random strings
 */
export function generateSecureId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}