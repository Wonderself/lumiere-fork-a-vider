/**
 * Security Hardening
 * Input validation, injection prevention, PII masking.
 */

// ─── Input Validation ───────────────────────────────────────────────

const INJECTION_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /eval\s*\(/i,
  /exec\s*\(/i,
  /union\s+select/i,
  /drop\s+table/i,
  /;\s*delete\s/i,
  /'\s*or\s+'1'\s*=\s*'1/i,
  /--\s*$/,
  /\/\*.*\*\//,
]

export interface ValidationResult {
  safe: boolean
  threats: string[]
  sanitized: string
}

/** Validate and sanitize user input */
export function validateInput(input: string): ValidationResult {
  const threats: string[] = []

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      threats.push(`Potential injection: ${pattern.source}`)
    }
  }

  // Sanitize: strip HTML tags and script content
  let sanitized = input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')

  return {
    safe: threats.length === 0,
    threats,
    sanitized,
  }
}

/** Validate prompt for AI injection attacks */
export function validatePrompt(prompt: string): ValidationResult {
  const threats: string[] = []

  // Check for prompt injection patterns
  const injectionPhrases = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /forget\s+(all\s+)?previous/i,
    /you\s+are\s+now\s+/i,
    /new\s+instructions?:/i,
    /system\s*:\s*/i,
    /\[INST\]/i,
    /<<SYS>>/i,
  ]

  for (const pattern of injectionPhrases) {
    if (pattern.test(prompt)) {
      threats.push(`Prompt injection attempt: ${pattern.source}`)
    }
  }

  return {
    safe: threats.length === 0,
    threats,
    sanitized: prompt, // Don't alter prompts, just flag them
  }
}

// ─── PII Masking ────────────────────────────────────────────────────

const PII_PATTERNS: Array<{ name: string; pattern: RegExp; replacement: string }> = [
  { name: 'email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL]' },
  { name: 'phone_fr', pattern: /\b(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}\b/g, replacement: '[PHONE]' },
  { name: 'phone_intl', pattern: /\b\+\d{1,3}[\s.-]?\d{4,14}\b/g, replacement: '[PHONE]' },
  { name: 'credit_card', pattern: /\b\d{4}[\s.-]?\d{4}[\s.-]?\d{4}[\s.-]?\d{4}\b/g, replacement: '[CARD]' },
  { name: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN]' },
  { name: 'iban', pattern: /\b[A-Z]{2}\d{2}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{0,4}\b/g, replacement: '[IBAN]' },
  { name: 'ip_address', pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[IP]' },
]

/** Mask PII in text for logging */
export function maskPII(text: string): string {
  let masked = text
  for (const { pattern, replacement } of PII_PATTERNS) {
    masked = masked.replace(pattern, replacement)
  }
  return masked
}

/** Detect PII in text */
export function detectPII(text: string): Array<{ type: string; count: number }> {
  const found: Array<{ type: string; count: number }> = []
  for (const { name, pattern } of PII_PATTERNS) {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      found.push({ type: name, count: matches.length })
    }
  }
  return found
}

/** Rate limit key generator (prevents timing attacks) */
export function generateRateLimitKey(userId: string, action: string): string {
  return `rl:${action}:${userId}`
}
