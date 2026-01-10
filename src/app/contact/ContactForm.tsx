"use client"

import { useState, useId } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

interface FormData {
  name: string
  email: string
  businessType: string
  invoiceCount: string
  message: string
}

type FormStatus = "idle" | "submitting" | "success" | "error"

export function ContactForm() {
  const formId = useId()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessType: "",
    invoiceCount: "",
    message: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Ime je obavezno"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email je obavezan"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Unesite ispravnu email adresu"
    }

    if (!formData.businessType) {
      newErrors.businessType = "Odaberite tip poslovanja"
    }

    if (!formData.invoiceCount) {
      newErrors.invoiceCount = "Odaberite broj računa"
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

    // Build mailto link with form data
    const subject = encodeURIComponent(`Demo zahtjev - ${formData.businessType}`)
    const body = encodeURIComponent(
      `Ime: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Tip poslovanja: ${formData.businessType}\n` +
        `Broj računa mjesečno: ${formData.invoiceCount}\n` +
        `\nPoruka:\n${formData.message || "(bez poruke)"}`
    )

    // Simulate brief loading for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Open mailto link
    window.location.href = `mailto:info@fiskai.hr?subject=${subject}&body=${body}`

    setStatus("success")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-success-border bg-success-bg0/20 backdrop-blur-sm p-6">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-success mb-4" />
          <h2 className="text-xl font-semibold mb-2">Zahtjev poslan!</h2>
          <p className="text-sm text-white/60 mb-4">
            Otvorit će vam se email klijent s unaprijed ispunjenom porukom. Samo pošaljite email i
            kontaktirat ćemo vas unutar 24h.
          </p>
          <button
            onClick={() => {
              setStatus("idle")
              setFormData({
                name: "",
                email: "",
                businessType: "",
                invoiceCount: "",
                message: "",
              })
            }}
            className="text-sm text-accent-light hover:underline"
          >
            Pošalji novi zahtjev
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Zahtjev za demo</h2>
      <p className="text-sm text-white/60 mb-4">
        Zatražite personalizirani demo koji pokazuje kako FiskAI može ubrzati vaše računovodstvo.
      </p>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          <label htmlFor={`${formId}-businessType`} className="block text-sm font-medium mb-1">
            Tip poslovanja <span className="text-danger">*</span>
          </label>
          <select
            id={`${formId}-businessType`}
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            aria-invalid={!!errors.businessType}
            aria-describedby={errors.businessType ? `${formId}-businessType-error` : undefined}
            className={`w-full rounded-md border ${
              errors.businessType ? "border-danger" : "border-white/10"
            } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50`}
          >
            <option value="">Odaberite...</option>
            <option value="Paušalni obrt">Paušalni obrt</option>
            <option value="VAT obrt">VAT obrt</option>
            <option value="d.o.o.">d.o.o.</option>
            <option value="Knjigovođa/računovoda">Knjigovođa/računovoda</option>
          </select>
          {errors.businessType && (
            <p id={`${formId}-businessType-error`} className="mt-1 text-xs text-danger">
              {errors.businessType}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-invoiceCount`} className="block text-sm font-medium mb-1">
            Broj računa mjesečno <span className="text-danger">*</span>
          </label>
          <select
            id={`${formId}-invoiceCount`}
            name="invoiceCount"
            value={formData.invoiceCount}
            onChange={handleChange}
            aria-invalid={!!errors.invoiceCount}
            aria-describedby={errors.invoiceCount ? `${formId}-invoiceCount-error` : undefined}
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
          Kontaktirat ćemo vas unutar 24h radnim danima da dogovorimo vrijeme demo sastanka.
        </p>
      </form>
    </div>
  )
}
