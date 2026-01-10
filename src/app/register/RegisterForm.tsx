"use client"

import { useState, useId, useEffect } from "react"
import Link from "next/link"
import { Loader2, ArrowRight, SkipForward } from "lucide-react"
import {
  submitLead,
  normalizeLeadPayload,
  validateLeadPayload,
  buildURLWithUTM,
  recordRegisterSkip,
  type PersonaType,
} from "@/lib/leads"

interface FormData {
  email: string
  persona: PersonaType | ""
  consent: boolean
  honeypot: string
}

type FormStatus = "idle" | "submitting" | "redirecting"

const APP_REGISTER_URL = "https://app.fiskai.hr/register"

export function RegisterForm() {
  const formId = useId()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    persona: "",
    consent: false,
    honeypot: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle redirect after successful submission
  const performRedirect = () => {
    setStatus("redirecting")
    const targetUrl = buildURLWithUTM(APP_REGISTER_URL)
    // Small delay to show redirecting state
    setTimeout(() => {
      window.location.href = targetUrl
    }, 500)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Use leads.ts validation for email
    const leadValidation = validateLeadPayload({
      email: formData.email,
      consent: formData.consent,
    })

    if (leadValidation.errors.email) {
      newErrors.email = leadValidation.errors.email
    }

    if (!formData.persona) {
      newErrors.persona = "Odaberite tip poslovanja"
    }

    if (leadValidation.errors.consent) {
      newErrors.consent = leadValidation.errors.consent
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus("submitting")

    try {
      const payload = normalizeLeadPayload({
        email: formData.email,
        source: "register",
        consent: formData.consent,
        persona: formData.persona as PersonaType,
      })

      // Submit lead (we don't need to wait for success to redirect)
      await submitLead(payload, formData.honeypot)

      // Redirect to app
      performRedirect()
    } catch {
      // Even on error, still redirect - we have local storage fallback
      performRedirect()
    }
  }

  const handleSkip = () => {
    recordRegisterSkip()
    performRedirect()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: newValue }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Redirecting state
  if (status === "redirecting") {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="text-lg">Preusmjeravanje na registraciju...</p>
        <p className="text-sm text-white/60">
          Ako niste automatski preusmjereni,{" "}
          <a
            href={buildURLWithUTM(APP_REGISTER_URL)}
            className="text-accent-light hover:underline"
          >
            kliknite ovdje
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Započni besplatno</h1>
        <p className="text-white/60">
          14 dana besplatno. Bez kreditne kartice. Otkažite kad želite.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot field - hidden from users, visible to bots */}
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor={`${formId}-company_website`}>
            Company Website (leave empty)
          </label>
          <input
            type="text"
            id={`${formId}-company_website`}
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-email`}
            className="block text-sm font-medium mb-1"
          >
            Email adresa <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id={`${formId}-email`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            className={`w-full rounded-md border ${
              errors.email ? "border-danger" : "border-white/10"
            } bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            placeholder="vas@email.hr"
            autoFocus
          />
          {errors.email && (
            <p id={`${formId}-email-error`} className="mt-1 text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${formId}-persona`}
            className="block text-sm font-medium mb-1"
          >
            Tko ste? <span className="text-danger">*</span>
          </label>
          <select
            id={`${formId}-persona`}
            name="persona"
            value={formData.persona}
            onChange={handleChange}
            aria-invalid={!!errors.persona}
            aria-describedby={errors.persona ? `${formId}-persona-error` : undefined}
            className={`w-full rounded-md border ${
              errors.persona ? "border-danger" : "border-white/10"
            } bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50`}
          >
            <option value="">Odaberite...</option>
            <option value="pausalni">Paušalni obrt</option>
            <option value="doo">D.O.O. / J.D.O.O.</option>
            <option value="accountant">Knjigovođa / Računovođa</option>
            <option value="freelancer">Freelancer</option>
            <option value="unknown">Nisam siguran/a</option>
          </select>
          {errors.persona && (
            <p id={`${formId}-persona-error`} className="mt-1 text-xs text-danger">
              {errors.persona}
            </p>
          )}
        </div>

        {/* Consent checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id={`${formId}-consent`}
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent/50"
          />
          <div>
            <label htmlFor={`${formId}-consent`} className="text-sm text-white/80">
              Prihvaćam{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-accent-light hover:underline"
              >
                uvjete korištenja
              </Link>{" "}
              i{" "}
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
          className="w-full rounded-md bg-gradient-to-r from-accent to-interactive px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Pripremam...
            </>
          ) : (
            <>
              Nastavi na registraciju
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Skip option */}
      <div className="text-center pt-2 border-t border-white/10">
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60"
        >
          <SkipForward className="h-4 w-4" />
          Preskoči i idi direktno na aplikaciju
        </button>
      </div>

      {/* Already have account */}
      <div className="text-center text-sm text-white/60">
        Već imate račun?{" "}
        <Link href="/login" className="text-accent-light hover:underline">
          Prijavite se
        </Link>
      </div>
    </div>
  )
}
