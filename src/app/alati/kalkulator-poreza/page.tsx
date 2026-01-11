import { TaxCalculator } from "@/components/shared/knowledge-hub/calculators/TaxCalculator"
import Link from "next/link"
import type { Metadata } from "next"
import { FAQ } from "@/components/shared/content/FAQ"
import { generateWebApplicationSchema } from "@/lib/schema/webApplication"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { TAX_RATES, formatCurrency, formatPercentage } from "@/lib/fiscal-data"
import { GuidanceCaptureCard, TAX_CALCULATOR_OPTIONS } from "@/components/guidance"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"
const pausalYear = TAX_RATES.pausal.year
const incomeYear = TAX_RATES.income.year
const lowerIncomeBracket = TAX_RATES.income.brackets[0]
const upperIncomeBracket = TAX_RATES.income.brackets[1]
const incomeLimitLabel = formatCurrency(lowerIncomeBracket.max, { decimals: 0 })
const lowerIncomeRateLabel = formatPercentage(lowerIncomeBracket.rate)
const upperIncomeRateLabel = formatPercentage(upperIncomeBracket.rate)
const personalAllowanceLabel = formatCurrency(TAX_RATES.income.personalAllowance, { decimals: 0 })
const averageSurtaxLabel = formatPercentage(TAX_RATES.income.averageSurtax)

export const metadata: Metadata = {
  title: `Kalkulator paušalnog poreza ${pausalYear}`,
  description: `Izračunajte kvartalni i godišnji paušalni porez na temelju očekivanog prihoda. Svi porezni razredi za ${pausalYear}.`,
  alternates: {
    canonical: `${BASE_URL}/alati/kalkulator-poreza`,
  },
}

const faq = [
  {
    q: "Koliko iznosi porez na dohodak?",
    a: `${lowerIncomeRateLabel} do ${incomeLimitLabel} godišnje, ${upperIncomeRateLabel} iznad tog iznosa (${incomeYear}.).`,
  },
  {
    q: "Što je osobni odbitak?",
    a: `Neoporezivi dio dohotka - ${personalAllowanceLabel} mjesečno (osnovna olakšica).`,
  },
  {
    q: "Kako se računa prirez?",
    a: `Postotak od poreza na dohodak, ovisi o mjestu prebivališta (prosjek ${averageSurtaxLabel}).`,
  },
]

export default function TaxCalculatorPage() {
  const webAppSchema = generateWebApplicationSchema({
    name: "Kalkulator Poreza",
    description: `Izračunajte kvartalni i godišnji paušalni porez na temelju očekivanog prihoda. Svi porezni razredi za ${pausalYear}.`,
    url: "https://fiskai.hr/alati/kalkulator-poreza",
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
          <span className="text-white/60">/</span>{" "}
          <span className="text-white/90">Paušalni porez</span>
        </nav>

        <h1 className="text-display text-4xl font-semibold">
          Kalkulator paušalnog poreza {pausalYear}.
        </h1>
        <p className="mt-4 text-white/60">
          Unesite očekivani godišnji prihod i izračunajte ukupne godišnje troškove uključujući
          porez, doprinose i HOK članarinu.
        </p>

        <div className="mt-8">
          <TaxCalculator embedded={false} />
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-surface/5 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold">Povezani sadržaj</h2>
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
              <Link
                href="/usporedba/pocinjem-solo"
                className="font-semibold text-primary hover:underline"
              >
                Usporedba: počinjem solo (paušal vs obrt vs j.d.o.o.)
              </Link>
            </li>
          </ul>
        </div>

        {/* Guidance Capture */}
        <section className="mt-8">
          <GuidanceCaptureCard
            toolSlug="kalkulator-poreza"
            title="Pošalji si izračun"
            subtitle="Primi rezultat na email ili aktiviraj podsjetnike za kvartalne prijave poreza."
            options={TAX_CALCULATOR_OPTIONS}
            toolSnapshot={{ year: pausalYear }}
          />
        </section>

        <FAQ items={faq} />
      </div>
    </SectionBackground>
  )
}
