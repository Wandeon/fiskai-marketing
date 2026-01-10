"use client"

import { useState, useId } from "react"
import Link from "next/link"
import { Bell, Mail, TrendingUp, CheckCircle2, Loader2, AlertCircle, Copy } from "lucide-react"
import {
  submitLead,
  normalizeLeadPayload,
  validateLeadPayload,
  copyLeadToClipboard,
  type LeadPayload,
} from "@/lib/leads"

// ============================================================================
// Types
// ============================================================================

export type GuidanceOption = {
  id: string
  label: string
  icon?: React.ReactNode
}

export interface GuidanceCaptureCardProps {
  /** Tool slug for source tracking (e.g., "kalendar", "pdv-kalkulator") */
  toolSlug: string

  /** Title shown on the card */
  title?: string

  /** Subtitle/description */
  subtitle?: string

  /** Checkbox options specific to this tool */
  options: GuidanceOption[]

  /** Optional snapshot of current tool state to include in submission */
  toolSnapshot?: Record<string, string | number | boolean>
}

type FormStatus = "idle" | "submitting" | "success" | "error"

// ============================================================================
// Component
// ============================================================================

export function GuidanceCaptureCard({
  toolSlug,
  title = "Želiš podsjetnik?",
  subtitle = "Pošalji si rezultat ili primaj obavijesti o važnim rokovima.",
  options,
  toolSnapshot,
}: GuidanceCaptureCardProps) {
  const formId = useId()

  const [email, setEmail] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  const [status, setStatus] = useState<FormStatus>("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submittedPayload, setSubmittedPayload] = useState<LeadPayload | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev)
      if (next.has(optionId)) {
        next.delete(optionId)
      } else {
        next.add(optionId)
      }
      return next
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const leadValidation = validateLeadPayload({
      email,
      consent,
    })

    if (leadValidation.errors.email) {
      newErrors.email = leadValidation.errors.email
    }

    if (leadValidation.errors.consent) {
      newErrors.consent = leadValidation.errors.consent
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildMessageString = (): string => {
    const parts: string[] = []

    // Add selected options
    options.forEach((opt) => {
      parts.push(`${opt.id}=${selectedOptions.has(opt.id)}`)
    })

    // Add tool identifier
    parts.push(`tool=${toolSlug}`)

    // Add tool snapshot if provided
    if (toolSnapshot) {
      Object.entries(toolSnapshot).forEach(([key, value]) => {
        parts.push(`snapshot_${key}=${value}`)
      })
    }

    return parts.join("; ")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus("submitting")

    try {
      const payload = normalizeLeadPayload({
        email,
        source: `tool:${toolSlug}` as "tool",
        consent,
        persona: "unknown",
        message: buildMessageString(),
      })

      const result = await submitLead(payload, honeypot)

      if (result.success) {
        setSubmittedPayload(result.payload)
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const handleCopyDetails = async () => {
    if (submittedPayload) {
      const success = await copyLeadToClipboard(submittedPayload)
      if (success) {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    }
  }

  const resetForm = () => {
    setStatus("idle")
    setEmail("")
    setSelectedOptions(new Set())
    setConsent(false)
    setHoneypot("")
    setSubmittedPayload(null)
    setErrors({})
  }

  // Success state
  if (status === "success" && submittedPayload) {
    return (
      <div className="rounded-xl border border-success-border bg-success-bg0/10 p-6">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-10 w-10 text-success mb-3" />
          <h3 className="text-lg font-semibold mb-2">Spremljeno!</h3>
          <p className="text-sm text-white/60 mb-4">
            Javit ćemo ti se na <strong className="text-white/80">{submittedPayload.email}</strong>.
            Bez spama, obećajemo.
          </p>

          <button
            onClick={handleCopyDetails}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
          >
            <Copy className="h-4 w-4" />
            {copySuccess ? "Kopirano!" : "Kopiraj podatke"}
          </button>

          <button
            onClick={resetForm}
            className="mt-4 text-sm text-accent-light hover:underline"
          >
            Prijavi još jedan email
          </button>
        </div>
      </div>
    )
  }

  // Error state
  if (status === "error") {
    return (
      <div className="rounded-xl border border-danger-border bg-danger-bg0/10 p-6">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-10 w-10 text-danger mb-3" />
          <h3 className="text-lg font-semibold mb-2">Nešto je pošlo po zlu</h3>
          <p className="text-sm text-white/60 mb-4">
            Pokušaj ponovno ili nas kontaktiraj na{" "}
            <a href="mailto:info@fiskai.hr" className="text-accent-light hover:underline">
              info@fiskai.hr
            </a>
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="rounded-md bg-gradient-to-r from-accent to-interactive px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Pokušaj ponovno
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-interactive/20">
          <Bell className="h-5 w-5 text-interactive" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        {/* Honeypot */}
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor={`${formId}-website`}>Website (leave empty)</label>
          <input
            type="text"
            id={`${formId}-website`}
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Email input */}
        <div>
          <label htmlFor={`${formId}-email`} className="block text-sm font-medium mb-1.5">
            Email adresa <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id={`${formId}-email`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) {
                setErrors((prev) => {
                  const next = { ...prev }
                  delete next.email
                  return next
                })
              }
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            className={`w-full rounded-md border ${
              errors.email ? "border-danger" : "border-white/10"
            } bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            placeholder="tvoj@email.hr"
          />
          {errors.email && (
            <p id={`${formId}-email-error`} className="mt-1 text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>

        {/* Options checkboxes */}
        {options.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">Što te zanima?</p>
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.has(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-interactive focus:ring-interactive/50"
                />
                <span className="flex items-center gap-2 text-sm text-white/70 group-hover:text-white/90">
                  {option.icon}
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Consent checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id={`${formId}-consent`}
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked)
              if (errors.consent) {
                setErrors((prev) => {
                  const next = { ...prev }
                  delete next.consent
                  return next
                })
              }
            }}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-interactive focus:ring-interactive/50"
          />
          <div>
            <label htmlFor={`${formId}-consent`} className="text-sm text-white/70">
              Prihvaćam{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="text-accent-light hover:underline"
              >
                politiku privatnosti
              </Link>
              . <span className="text-danger">*</span>
            </label>
            {errors.consent && (
              <p id={`${formId}-consent-error`} className="mt-1 text-xs text-danger">
                {errors.consent}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-md bg-gradient-to-r from-accent to-interactive px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Spremam...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Pošalji mi
            </>
          )}
        </button>
      </form>

      {/* Trust copy */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/50 text-center">
          Ne šaljemo spam. FiskAI podsjetnici su samo vezani uz rokove i pravila.{" "}
          <Link href="/privacy" className="text-accent-light/70 hover:underline">
            Privatnost
          </Link>{" "}
          ·{" "}
          <Link href="/urednicka-politika" className="text-accent-light/70 hover:underline">
            Urednička politika
          </Link>
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Preset Options for Different Tools
// ============================================================================

export const CALENDAR_OPTIONS: GuidanceOption[] = [
  {
    id: "deadline_reminders",
    label: "Podsjeti me na važne rokove",
    icon: <Bell className="h-4 w-4 text-interactive" />,
  },
]

export const PDV_CALCULATOR_OPTIONS: GuidanceOption[] = [
  {
    id: "results_email",
    label: "Pošalji mi rezultat i kratko objašnjenje",
    icon: <Mail className="h-4 w-4 text-interactive" />,
  },
  {
    id: "pdv_threshold_warning",
    label: "Upozori me kad se približim PDV pragu",
    icon: <TrendingUp className="h-4 w-4 text-warning" />,
  },
]

export const CONTRIBUTION_CALCULATOR_OPTIONS: GuidanceOption[] = [
  {
    id: "results_email",
    label: "Pošalji mi rezultat i kratko objašnjenje",
    icon: <Mail className="h-4 w-4 text-interactive" />,
  },
  {
    id: "deadline_reminders",
    label: "Podsjeti me na rokove za uplate",
    icon: <Bell className="h-4 w-4 text-interactive" />,
  },
]

export const TAX_CALCULATOR_OPTIONS: GuidanceOption[] = [
  {
    id: "results_email",
    label: "Pošalji mi rezultat i kratko objašnjenje",
    icon: <Mail className="h-4 w-4 text-interactive" />,
  },
  {
    id: "quarterly_reminders",
    label: "Podsjeti me na kvartalne prijave",
    icon: <Bell className="h-4 w-4 text-interactive" />,
  },
]
