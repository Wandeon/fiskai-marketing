import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { ContactForm } from "./ContactForm"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktirajte FiskAI tim za demo, beta program ili podršku.",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
}

export default function ContactPage() {
  return (
    <SectionBackground variant="dark">
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className="mb-10">
          <h1 className="text-display text-4xl font-semibold">Kontakt i podrška</h1>
          <p className="mt-4 text-lg text-white/60 max-w-2xl">
            Javite nam se za demo, beta pristup ili tehničku podršku. Fokusirani smo na paušalni
            obrt, VAT i suradnju s knjigovođama.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Kontakt podaci</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-white/60" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">Lokacija</p>
                    <p className="text-sm text-white/60">Zagreb, Hrvatska</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Mail className="h-5 w-5 text-white/60" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:info@fiskai.hr"
                      className="text-sm text-accent-light hover:underline block"
                    >
                      info@fiskai.hr
                    </a>
                    <p className="text-xs text-white/60 mt-1">Općeniti upiti, demo zahtjevi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MessageSquare className="h-5 w-5 text-white/60" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">Podrška</p>
                    <a
                      href="mailto:podrska@fiskai.hr"
                      className="text-sm text-accent-light hover:underline block"
                    >
                      podrska@fiskai.hr
                    </a>
                    <p className="text-xs text-white/60 mt-1">
                      Tehnički problemi, pomoć u aplikaciji
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Clock className="h-5 w-5 text-white/60" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">Vrijeme odgovora</p>
                    <p className="text-sm text-white/60">Unutar 24h radnim danima</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Tvrtka</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Naziv:</span> FiskAI d.o.o.
                </p>
                <p>
                  <span className="font-medium">Sjedište:</span> Zagreb, Hrvatska
                </p>
                <p className="text-white/60 mt-2">
                  Registrirana u Sudskom registru Republike Hrvatske
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ContactForm />

            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h2 className="text-xl font-semibold mb-2">Već imate račun?</h2>
              <p className="text-sm text-white/60 mb-4">
                Prijavite se u aplikaciju ili koristite in-app podršku za tehnička pitanja.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-center text-sm font-medium hover:bg-white/10"
                >
                  Prijava
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-md bg-gradient-to-r from-accent to-interactive px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
                >
                  Besplatna registracija
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-accent/30 bg-gradient-to-r from-accent/10 to-interactive/10 p-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Phone className="h-5 w-5 text-danger-text" aria-hidden="true" />
            Hitna podrška
          </h3>
          <p className="text-sm text-white/60 mb-3">
            Ako imate kritičan problem koji sprečava korištenje aplikacije (npr. ne možete izdati
            račun):
          </p>
          <div className="flex items-center gap-4">
            <a
              href="tel:+38512345679"
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-danger-text hover:bg-white/95 border border-danger-border"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              +385 1 234 5679
            </a>
            <span className="text-xs text-white/60">Radnim danima 9-17h, subota 10-14h</span>
          </div>
        </div>
      </div>
    </SectionBackground>
  )
}
