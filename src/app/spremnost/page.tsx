import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Wrench, XCircle, Calendar, ExternalLink, Shield } from "lucide-react"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import {
  getReadyItems,
  getBuildingItems,
  getNotYetItems,
  lastUpdated,
  changelog,
  audienceLabels,
  type ReadinessItem,
  type Audience,
} from "@/content/readiness"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"

export const metadata: Metadata = {
  title: "Stanje spremnosti",
  description:
    "Javni pregled što je spremno, što gradimo i što još nije dostupno u FiskAI. Bez skrivanja, bez pretjerivanja.",
  alternates: {
    canonical: `${BASE_URL}/spremnost`,
  },
}

// ============================================================================
// Helper Components
// ============================================================================

function AudienceBadges({ audiences }: { audiences: Audience[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {audiences.map((audience) => (
        <span
          key={audience}
          className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70"
        >
          {audienceLabels[audience]}
        </span>
      ))}
    </div>
  )
}

function ReadinessCard({ item }: { item: ReadinessItem }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-5">
      <h3 className="font-semibold text-white/90">{item.name}</h3>
      <AudienceBadges audiences={item.audience} />
      <p className="mt-3 text-sm text-white/70">{item.description}</p>
      {item.note && (
        <p className="mt-2 text-xs text-white/50 italic">{item.note}</p>
      )}
      {item.verificationLink && (
        <Link
          href={item.verificationLink}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent-light hover:underline"
        >
          Saznaj više
          <ExternalLink className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}

// ============================================================================
// Page Component
// ============================================================================

export default function ReadinessPage() {
  const readyItems = getReadyItems()
  const buildingItems = getBuildingItems()
  const notYetItems = getNotYetItems()

  return (
    <SectionBackground variant="dark">
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-display text-4xl font-semibold">Stanje spremnosti FiskAI</h1>
          <p className="mt-4 text-lg text-white/60 max-w-2xl">
            Ovdje javno prikazujemo što je spremno, što gradimo, i što još nije dostupno.
            Bez skrivanja, bez pretjerivanja.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/50">
            <Calendar className="h-4 w-4" />
            <span>Zadnje ažuriranje: {lastUpdated}</span>
          </div>
        </header>

        {/* Ready Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Spremno danas</h2>
              <p className="text-sm text-white/60">Funkcionalnosti koje možete koristiti odmah</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {readyItems.map((item) => (
              <ReadinessCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Building Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
              <Wrench className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">U izradi</h2>
              <p className="text-sm text-white/60">Aktivno radimo na ovome</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {buildingItems.map((item) => (
              <ReadinessCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Not Yet Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <XCircle className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Još nije dostupno</h2>
              <p className="text-sm text-white/60">Planirano, ali još ne nudimo</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {notYetItems.map((item) => (
              <ReadinessCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Our Standard Block */}
        <section className="mb-12 rounded-xl border border-accent/20 bg-accent/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20">
              <Shield className="h-5 w-5 text-accent-light" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Naš standard</h2>
              <p className="mt-2 text-white/70">
                Ako nešto nije spremno, nećemo ga prodavati kao gotovo. Ne koristimo strah od
                regulativa za prodaju. Ne obećavamo funkcionalnosti koje ne možemo isporučiti.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link
                  href="/urednicka-politika"
                  className="inline-flex items-center gap-1.5 text-accent-light hover:underline"
                >
                  Urednička politika
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 text-accent-light hover:underline"
                >
                  Politika privatnosti
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Link
                  href="/izvori"
                  className="inline-flex items-center gap-1.5 text-accent-light hover:underline"
                >
                  Izvori i metodologija
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Changelog */}
        <section className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Povijest promjena</h2>
          <ul className="space-y-3">
            {changelog.map((entry, index) => (
              <li key={index} className="flex gap-4 text-sm">
                <span className="text-white/50 whitespace-nowrap font-mono">{entry.date}</span>
                <span className="text-white/70">{entry.description}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/60 mb-4">
            Imate pitanja o nečemu što nije na popisu?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-accent to-interactive px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Kontaktirajte nas
          </Link>
        </div>
      </div>
    </SectionBackground>
  )
}
