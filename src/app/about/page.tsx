import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Mail, Phone, MapPin, FileText, ExternalLink } from "lucide-react"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { TrustBadge } from "@/components/trust"
import { companyInfo, getPhoneLink, getFullAddress } from "@/config/company"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fiskai.hr"

export const metadata: Metadata = {
  title: "O nama | FiskAI",
  description:
    "Tko stoji iza FiskAI, kako radimo i zašto biramo transparentnost. Bez skrivanja, bez pretjerivanja.",
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "O nama | FiskAI",
    description:
      "Tko stoji iza FiskAI, kako radimo i zašto biramo transparentnost. Bez skrivanja, bez pretjerivanja.",
    url: `${BASE_URL}/about`,
    siteName: "FiskAI",
    locale: "hr_HR",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <SectionBackground>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-display text-4xl font-semibold">O nama</h1>
          <p className="mt-4 text-lg text-white/60 max-w-2xl">
            Tko stoji iza FiskAI, kako radimo i zašto biramo transparentnost.
          </p>
        </header>

        {/* Section 1: Why FiskAI exists */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Zašto FiskAI postoji</h2>
          <div className="space-y-4 text-white/70">
            <p>
              Hrvatski poduzetnici, posebno oni koji tek počinju, često se suočavaju s nepotrebnim
              strahom od poreznih propisa i administracije. Informacije su raspršene, softveri
              komplicirani, a greške skupe.
            </p>
            <p>
              FiskAI postoji da smanji taj strah. Ne prodajemo paniku oko regulativa. Umjesto toga,
              nastojimo napraviti sljedeći korak očitim — bilo da je to izračun doprinosa, priprema
              za PDV prijavu ili razumijevanje novog propisa.
            </p>
          </div>
        </section>

        {/* Section 2: How we work (The Standard) */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Kako radimo</h2>
          <p className="text-white/60 mb-6">
            Ovo su principi po kojima gradimo FiskAI. Ne tvrdimo da smo savršeni, ali nastojimo biti
            dosljedni.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white/90 mb-2">
                Ako nešto nije spremno, piše da nije spremno
              </h3>
              <p className="text-sm text-white/60">
                Ne prodajemo &quot;uskoro&quot; kao &quot;gotovo&quot;. Javno objavljujemo što
                možete koristiti danas, što gradimo, i što još nije dostupno.
              </p>
              <Link
                href="/spremnost"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-light hover:underline"
              >
                Pogledaj stanje spremnosti
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white/90 mb-2">
                Sadržaj se oslanja na službene izvore
              </h3>
              <p className="text-sm text-white/60">
                Kalkulatori i vodiči koriste podatke iz Narodnih novina, Porezne uprave i HZMO-a.
                Navodimo izvore, ne izmišljamo informacije.
              </p>
              <Link
                href="/izvori"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-light hover:underline"
              >
                Službeni izvori
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white/90 mb-2">Metodologije kalkulatora su javne</h3>
              <p className="text-sm text-white/60">
                Objašnjavamo kako računamo doprinose, porez i druge vrijednosti. Možete provjeriti
                logiku i ukazati na greške.
              </p>
              <Link
                href="/metodologija"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-light hover:underline"
              >
                Metodologija
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white/90 mb-2">Imamo uredničku politiku</h3>
              <p className="text-sm text-white/60">
                Definirali smo kako pišemo, ažuriramo i ispravljamo sadržaj. Ako nađete grešku,
                ispravit ćemo je i dokumentirati promjenu.
              </p>
              <Link
                href="/urednicka-politika"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-light hover:underline"
              >
                Urednička politika
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <TrustBadge variant="inline" preset="readiness" />
          </div>
        </section>

        {/* Section 3: Who stands behind FiskAI */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Tko stoji iza FiskAI</h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <Building2 className="h-6 w-6 text-accent-light" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white/90">{companyInfo.name}</h3>
                  <p className="text-sm text-white/60">
                    Registrirano u Hrvatskoj, sjedište u Zagrebu
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="h-4 w-4 text-white/50" />
                    <span>{getFullAddress()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <FileText className="h-4 w-4 text-white/50" />
                    <span>OIB: {companyInfo.oib}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-white/50" />
                    <a
                      href={`mailto:${companyInfo.emailContact}`}
                      className="text-accent-light hover:underline"
                    >
                      {companyInfo.emailContact}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-white/50" />
                    <a
                      href={getPhoneLink(companyInfo.phone)}
                      className="text-accent-light hover:underline"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>

                <p className="text-xs text-white/50 pt-2 border-t border-white/10">
                  Upisani u sudski registar Trgovačkog suda u Zagrebu
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Legal and transparency links */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Pravna i kontakt transparentnost</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/privacy"
              className="group rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <h3 className="font-semibold text-white/90 group-hover:text-accent-light">
                Politika privatnosti
              </h3>
              <p className="mt-1 text-sm text-white/60">Kako prikupljamo i štitimo vaše podatke</p>
            </Link>
            <Link
              href="/terms"
              className="group rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <h3 className="font-semibold text-white/90 group-hover:text-accent-light">
                Uvjeti korištenja
              </h3>
              <p className="mt-1 text-sm text-white/60">Prava i obveze pri korištenju platforme</p>
            </Link>
            <Link
              href="/dpa"
              className="group rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <h3 className="font-semibold text-white/90 group-hover:text-accent-light">
                DPA (Obrada podataka)
              </h3>
              <p className="mt-1 text-sm text-white/60">Ugovor o obradi podataka za tvrtke</p>
            </Link>
            <Link
              href="/security"
              className="group rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <h3 className="font-semibold text-white/90 group-hover:text-accent-light">
                Sigurnost
              </h3>
              <p className="mt-1 text-sm text-white/60">Trust Center i sigurnosne politike</p>
            </Link>
          </div>
        </section>

        {/* Section 5: Non-salesy CTA */}
        <section className="rounded-xl border border-accent/20 bg-accent/5 p-6">
          <p className="text-white/70">
            Ako nisi siguran/na što ti vrijedi, kreni od{" "}
            <Link href="/baza-znanja" className="text-accent-light hover:underline">
              vodiča
            </Link>{" "}
            ili{" "}
            <Link href="/alati" className="text-accent-light hover:underline">
              besplatnih alata
            </Link>
            . Nema pritiska za registraciju.
          </p>
        </section>
      </div>
    </SectionBackground>
  )
}
