import { ContributionCalculator } from "@/components/shared/knowledge-hub/calculators/ContributionCalculator"
import Link from "next/link"
import type { Metadata } from "next"
import { FAQ } from "@/components/shared/content/FAQ"
import { generateWebApplicationSchema } from "@/lib/schema/webApplication"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { CONTRIBUTIONS, formatCurrency, formatPercentage } from "@/lib/fiscal-data"
import { GuidanceCaptureCard, CONTRIBUTION_CALCULATOR_OPTIONS } from "@/components/guidance"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"
const contributionsYear = CONTRIBUTIONS.year
const contributionBaseLabel = formatCurrency(CONTRIBUTIONS.base.minimum, { decimals: 2 })
const mioRateLabel = formatPercentage(
  CONTRIBUTIONS.rates.MIO_I.rate + CONTRIBUTIONS.rates.MIO_II.rate
)
const hzzoRateLabel = formatPercentage(CONTRIBUTIONS.rates.HZZO.rate, { decimals: 1 })
const totalMonthlyLabel = formatCurrency(CONTRIBUTIONS.monthly.total, { decimals: 2 })

export const metadata: Metadata = {
  title: `Kalkulator doprinosa ${contributionsYear}`,
  description: `Izračunajte mjesečne doprinose za MIO I, MIO II i HZZO za paušalne obrtnike u ${contributionsYear}. godini.`,
  alternates: {
    canonical: `${BASE_URL}/alati/kalkulator-doprinosa`,
  },
}

const faq = [
  {
    q: "Koliki su doprinosi za paušalce?",
    a: `MIO ${mioRateLabel} i ZO ${hzzoRateLabel} na minimalnu osnovicu (${contributionBaseLabel} = ${totalMonthlyLabel} mjesečno).`,
  },
  {
    q: "Što je minimalna osnovica za doprinose?",
    a: `${contributionBaseLabel} mjesečno (minimalna osnovica za ${contributionsYear}.).`,
  },
  {
    q: "Do kada se plaćaju doprinosi?",
    a: "Do 15. u mjesecu za prethodni mjesec.",
  },
]

export default function ContributionCalculatorPage() {
  const webAppSchema = generateWebApplicationSchema({
    name: "Kalkulator Doprinosa",
    description: `Izračunajte mjesečne doprinose za MIO I, MIO II i HZZO za paušalne obrtnike u ${contributionsYear}. godini.`,
    url: "https://fiskai.hr/alati/kalkulator-doprinosa",
  })

  return (
    <SectionBackground>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <nav className="mb-6 text-sm text-white/60">
          <Link href="/baza-znanja" className="hover:text-white/90">
            Baza znanja
          </Link>{" "}
          <span className="text-white/60">/</span>{" "}
          <Link href="/alati" className="hover:text-white/90">
            Alati
          </Link>{" "}
          <span className="text-white/60">/</span> <span className="text-white/90">Doprinosi</span>
        </nav>

        <h1 className="text-display text-4xl font-semibold">
          Kalkulator doprinosa {contributionsYear}.
        </h1>
        <p className="mt-4 text-white/60">
          Mjesečni doprinosi za paušalne obrtnike. Iznosi vrijede za {contributionsYear}. godinu i
          temelje se na minimalnoj osnovici od {contributionBaseLabel}.
        </p>

        <div className="mt-8">
          <ContributionCalculator embedded={false} />
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-surface/5 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold">Povezani vodiči</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/vodic/pausalni-obrt"
                className="font-semibold text-primary hover:underline"
              >
                Paušalni obrt - kompletan vodič
              </Link>
            </li>
            <li>
              <Link href="/alati/uplatnice" className="font-semibold text-primary hover:underline">
                Generator uplatnica za doprinose
              </Link>
            </li>
          </ul>
        </div>

        {/* Guidance Capture */}
        <section className="mt-8">
          <GuidanceCaptureCard
            toolSlug="kalkulator-doprinosa"
            title="Pošalji si izračun"
            subtitle="Primi rezultat na email ili aktiviraj podsjetnike za rokove plaćanja doprinosa."
            options={CONTRIBUTION_CALCULATOR_OPTIONS}
            toolSnapshot={{ year: contributionsYear }}
          />
        </section>

        <FAQ items={faq} />
      </div>
    </SectionBackground>
  )
}
