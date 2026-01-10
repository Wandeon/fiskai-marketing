/**
 * Lead Capture Module
 *
 * Handles lead collection for the FiskAI marketing site.
 * Works with static export - no server-side routes required.
 *
 * Submission strategy:
 * - If NEXT_PUBLIC_LEADS_ENDPOINT is set, POST to that endpoint
 * - If not set, store locally and show fallback UI
 */

// ============================================================================
// Types
// ============================================================================

export type LeadSource = "contact" | "register" | "newsletter" | "tool"

export type PersonaType =
  | "pausalni"
  | "doo"
  | "accountant"
  | "freelancer"
  | "unknown"

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export interface LeadPayload {
  // Required
  email: string
  source: LeadSource
  consent: boolean

  // Optional context
  name?: string
  persona?: PersonaType
  invoiceVolume?: string
  message?: string

  // UTM tracking
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string

  // Session context
  referrer?: string
  landingPath?: string
  timestamp: string
}

export interface LeadSubmissionResult {
  success: boolean
  method: "api" | "local"
  payload: LeadPayload
  error?: string
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY_LAST_LEAD = "fiskai_lead_last"
const STORAGE_KEY_REGISTER_SKIP = "fiskai_register_skip"

// ============================================================================
// Validation
// ============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateLeadPayload(
  payload: Partial<LeadPayload>
): ValidationResult {
  const errors: Record<string, string> = {}

  // Email validation
  if (!payload.email) {
    errors.email = "Email je obavezan"
  } else if (!EMAIL_REGEX.test(payload.email)) {
    errors.email = "Unesite ispravnu email adresu"
  }

  // Consent validation
  if (payload.consent !== true) {
    errors.consent = "Morate prihvatiti uvjete privatnosti"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// ============================================================================
// UTM Extraction
// ============================================================================

export function extractUTMParams(): UTMParams {
  if (typeof window === "undefined") return {}

  const params = new URLSearchParams(window.location.search)
  const utm: UTMParams = {}

  const utmKeys: (keyof UTMParams)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]

  for (const key of utmKeys) {
    const value = params.get(key)
    if (value) {
      utm[key] = value
    }
  }

  return utm
}

export function buildURLWithUTM(baseURL: string, utmParams?: UTMParams): string {
  const url = new URL(baseURL)
  const params = utmParams || extractUTMParams()

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value)
    }
  }

  return url.toString()
}

// ============================================================================
// Payload Normalization
// ============================================================================

export function normalizeLeadPayload(
  input: Partial<LeadPayload> & { email: string; source: LeadSource; consent: boolean }
): LeadPayload {
  const utm = extractUTMParams()

  return {
    // Required fields
    email: input.email.trim().toLowerCase(),
    source: input.source,
    consent: input.consent,

    // Optional fields
    name: input.name?.trim(),
    persona: input.persona,
    invoiceVolume: input.invoiceVolume,
    message: input.message?.trim(),

    // UTM - prefer explicit over extracted
    utm_source: input.utm_source || utm.utm_source,
    utm_medium: input.utm_medium || utm.utm_medium,
    utm_campaign: input.utm_campaign || utm.utm_campaign,
    utm_term: input.utm_term || utm.utm_term,
    utm_content: input.utm_content || utm.utm_content,

    // Session context
    referrer:
      input.referrer ||
      (typeof document !== "undefined" ? document.referrer : undefined),
    landingPath:
      input.landingPath ||
      (typeof window !== "undefined" ? window.location.pathname : undefined),
    timestamp: new Date().toISOString(),
  }
}

// ============================================================================
// Storage Functions
// ============================================================================

export function storeLeadLocally(payload: LeadPayload): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY_LAST_LEAD, JSON.stringify(payload))
  } catch {
    // localStorage might be full or disabled
    console.warn("Failed to store lead locally")
  }
}

export function getLastStoredLead(): LeadPayload | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY_LAST_LEAD)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function recordRegisterSkip(): void {
  if (typeof window === "undefined") return

  try {
    const utm = extractUTMParams()
    const event = {
      timestamp: new Date().toISOString(),
      ...utm,
    }
    localStorage.setItem(STORAGE_KEY_REGISTER_SKIP, JSON.stringify(event))
  } catch {
    // Silent fail
  }
}

// ============================================================================
// Spam Protection
// ============================================================================

/**
 * Check if honeypot field was filled (indicates bot)
 * Returns true if submission should be silently rejected
 */
export function isSpamSubmission(honeypotValue?: string): boolean {
  return !!honeypotValue && honeypotValue.trim().length > 0
}

// ============================================================================
// Submission
// ============================================================================

export async function submitLead(
  payload: LeadPayload,
  honeypotValue?: string
): Promise<LeadSubmissionResult> {
  // Spam check - pretend success but don't actually submit
  if (isSpamSubmission(honeypotValue)) {
    return {
      success: true,
      method: "local",
      payload,
    }
  }

  // Always store locally as fallback
  storeLeadLocally(payload)

  const endpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT

  if (endpoint) {
    // Try API submission
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return {
        success: true,
        method: "api",
        payload,
      }
    } catch (error) {
      // API failed, but we have local storage
      return {
        success: true, // Still show success since we stored locally
        method: "local",
        payload,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // No endpoint configured - local storage only
  return {
    success: true,
    method: "local",
    payload,
  }
}

// ============================================================================
// Utility: Copy to Clipboard
// ============================================================================

export async function copyLeadToClipboard(payload: LeadPayload): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    return true
  } catch {
    return false
  }
}

// ============================================================================
// Utility: Build mailto fallback (last resort)
// ============================================================================

export function buildMailtoFallback(payload: LeadPayload): string {
  const subject = encodeURIComponent(
    `[${payload.source}] Lead from ${payload.email}`
  )
  const body = encodeURIComponent(
    `Novi lead:\n\n` +
      `Email: ${payload.email}\n` +
      `Izvor: ${payload.source}\n` +
      (payload.name ? `Ime: ${payload.name}\n` : "") +
      (payload.persona ? `Persona: ${payload.persona}\n` : "") +
      (payload.invoiceVolume ? `Broj računa: ${payload.invoiceVolume}\n` : "") +
      (payload.message ? `\nPoruka:\n${payload.message}\n` : "") +
      `\n---\nTimestamp: ${payload.timestamp}`
  )

  return `mailto:info@fiskai.hr?subject=${subject}&body=${body}`
}
