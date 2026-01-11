"use client"

import { useState, useId } from "react"
import { CheckCircle2, Loader2, AlertCircle, Copy, Mail } from "lucide-react"
import {
  submitLead,
  normalizeLeadPayload,
  validateLeadPayload,
  copyLeadToClipboard,
  buildMailtoFallback,
  type LeadPayload,
  type PersonaType,
  type LeadSubmissionResult,
} from "@/lib/leads"

interface FormData {
  name: string
  email: string
  businessType: string
  invoiceCount: string
  message: string
  consent: boolean
  honeypot: string // Spam protection
}

type FormStatus = "idle" | "submitting" | "success" | "error"

// Map business type select values to persona types
function mapBusinessTypeToPersona(businessType: string): PersonaType {
  switch (businessType) {
    case "Paušalni obrt":
      return "pausalni"
    case "d.o.o.":
    case "VAT obrt":
      return "doo"
    case "Knjigovođa/računovoda":
      return "accountant"
    case "Freelancer":
      return "freelancer"
    default:
      return "unknown"
  }
}

export function ContactForm() {
  const formId = useId()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessType: "",
    invoiceCount: "",
    message: "",
    consent: false,
    honeypot: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submittedPayload, setSubmittedPayload] = useState<LeadPayload | null>(null)
  const [submissionMethod, setSubmissionMethod] = useState<"api" | "local" | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Ime je obavezno"
    }

    // Use leads.ts validation for email
    const leadValidation = validateLeadPayload({
      email: formData.email,
      consent: formData.consent,
    })

    if (leadValidation.errors.email) {
      newErrors.email = leadValidation.errors.email
    }

    if (!formData.businessType) {
      newErrors.businessType = "Odaberite tip poslovanja"
    }

    if (!formData.invoiceCount) {
      newErrors.invoiceCount = "Odaberite broj računa"
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
        source: "contact",
        consent: formData.consent,
        name: formData.name,
        persona: mapBusinessTypeToPersona(formData.businessType),
        invoiceVolume: formData.invoiceCount,
        message: formData.message || undefined,
      })

      const result = await submitLead(payload, formData.honeypot)

      if (result.success) {
        setSubmittedPayload(result.payload)
        setSubmissionMethod(result.method)
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
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
    setFormData({
      name: "",
      email: "",
      businessType: "",
      invoiceCount: "",
      message: "",
      consent: false,
      honeypot: "",
    })
    setSubmittedPayload(null)
    setSubmissionMethod(null)
    setErrors({})
  }

  // Success state - different messaging based on submission method
  if (status === "success" && submittedPayload) {
    const isApiSuccess = submissionMethod === "api"

    return (
      <div className={`rounded-lg border backdrop-blur-sm p-6 ${
        isApiSuccess
          ? "border-success-border bg-success-bg0/20"
          : "border-warning/30 bg-warning-bg0/10"
      }`}>
        <div className="flex flex-col items-center text-center">
          {isApiSuccess ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-success mb-4" />
              <h2 className="text-xl font-semibold mb-2">Zahtjev je poslan!</h2>
              <p className="text-sm text-white/60 mb-4">
                Kontaktirat ćemo vas na <strong>{submittedPayload.email}</strong> unutar 24h
                radnim danima.
              </p>
            </>
          ) : (
            <>
              <Mail className="h-12 w-12 text-warning mb-4" />
              <h2 className="text-xl font-semibold mb-2">Još jedan korak</h2>
              <p className="text-sm text-white/60 mb-4">
                Vaši podaci su pripremljeni. Molimo pošaljite email kako bismo primili vaš zahtjev.
              </p>
              <a
                href={buildMailtoFallback(submittedPayload)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-accent to-interactive px-6 py-3 text-sm font-semibold text-white hover:opacity-90 mb-4"
              >
                <Mail className="h-4 w-4" />
                Pošalji email
              </a>
              <p className="text-xs text-white/40 mb-2">
                Kliknite gumb iznad da otvorite email s vašim podacima.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleCopyDetails}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              <Copy className="h-4 w-4" />
              {copySuccess ? "Kopirano!" : "Kopiraj podatke"}
            </button>
          </div>

          {isApiSuccess && (
            <div className="mt-4 pt-4 border-t border-white/10 w-full">
              <p className="text-xs text-white/40 mb-2">
                Ako želite, možete nas kontaktirati i direktno:
              </p>
              <a
                href={buildMailtoFallback(submittedPayload)}
                className="inline-flex items-center gap-2 text-xs text-accent-light hover:underline"
              >
                <Mail className="h-3 w-3" />
                Pošalji email ručno
              </a>
            </div>
          )}

          <button
            onClick={resetForm}
            className="mt-4 text-sm text-accent-light hover:underline"
          >
            Pošalji novi zahtjev
          </button>
        </div>
      </div>
    )
  }

  // Error state
  if (status === "error") {
    return (
      <div className="rounded-lg border border-danger-border bg-danger-bg0/20 backdrop-blur-sm p-6">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-danger mb-4" />
          <h2 className="text-xl font-semibold mb-2">Došlo je do greške</h2>
          <p className="text-sm text-white/60 mb-4">
            Nismo uspjeli spremiti vaš zahtjev. Molimo pokušajte ponovno ili nas
            kontaktirajte direktno na{" "}
            <a
              href="mailto:info@fiskai.hr"
              className="text-accent-light hover:underline"
            >
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
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Zahtjev za demo</h2>
      <p className="text-sm text-white/60 mb-4">
        Zatražite personalizirani demo koji pokazuje kako FiskAI može ubrzati vaše
        računovodstvo.
      </p>
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
          <label htmlFor={`${formId}-name`} className="block text-sm font-medium mb-1">
            Ime i prezime <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`${formId}-name`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className={`w-full rounded-md border ${
              errors.name ? "border-danger" : "border-white/10"
            } bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            placeholder="Vaše ime i prezime"
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className="mt-1 text-xs text-danger">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="block text-sm font-medium mb-1">
            Email <span className="text-danger">*</span>
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
            } bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            placeholder="vas@email.hr"
          />
          {errors.email && (
            <p id={`${formId}-email-error`} className="mt-1 text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${formId}-businessType`}
            className="block text-sm font-medium mb-1"
          >
            Tip poslovanja <span className="text-danger">*</span>
          </label>
          <select
            id={`${formId}-businessType`}
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            aria-invalid={!!errors.businessType}
            aria-describedby={
              errors.businessType ? `${formId}-businessType-error` : undefined
            }
            className={`w-full rounded-md border ${
              errors.businessType ? "border-danger" : "border-white/10"
            } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50`}
          >
            <option value="">Odaberite...</option>
            <option value="Paušalni obrt">Paušalni obrt</option>
            <option value="VAT obrt">VAT obrt</option>
            <option value="d.o.o.">d.o.o.</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Knjigovođa/računovoda">Knjigovođa/računovoda</option>
          </select>
          {errors.businessType && (
            <p id={`${formId}-businessType-error`} className="mt-1 text-xs text-danger">
              {errors.businessType}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${formId}-invoiceCount`}
            className="block text-sm font-medium mb-1"
          >
            Broj računa mjesečno <span className="text-danger">*</span>
          </label>
          <select
            id={`${formId}-invoiceCount`}
            name="invoiceCount"
            value={formData.invoiceCount}
            onChange={handleChange}
            aria-invalid={!!errors.invoiceCount}
            aria-describedby={
              errors.invoiceCount ? `${formId}-invoiceCount-error` : undefined
            }
            className={`w-full rounded-md border ${
              errors.invoiceCount ? "border-danger" : "border-white/10"
            } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50`}
          >
            <option value="">Odaberite...</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="200+">200+</option>
          </select>
          {errors.invoiceCount && (
            <p id={`${formId}-invoiceCount-error`} className="mt-1 text-xs text-danger">
              {errors.invoiceCount}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-message`} className="block text-sm font-medium mb-1">
            Poruka (opcionalno)
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="Specifična pitanja ili zahtjevi..."
          />
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
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-light hover:underline"
              >
                politiku privatnosti
              </a>{" "}
              i slažem se da me FiskAI može kontaktirati. <span className="text-danger">*</span>
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
              Šaljem...
            </>
          ) : (
            "Pošalji zahtjev za demo"
          )}
        </button>

        <p className="text-xs text-white/60">
          Kontaktirat ćemo vas unutar 24h radnim danima da dogovorimo vrijeme demo
          sastanka.
        </p>
      </form>
    </div>
  )
}
