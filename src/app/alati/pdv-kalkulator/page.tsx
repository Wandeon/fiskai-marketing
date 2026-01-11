import { Metadata } from "next"
import Link from "next/link"
import { PDVThresholdCalculator } from "@/components/shared/knowledge-hub/calculators/PDVThresholdCalculator"
import { FAQ } from "@/components/shared/content/FAQ"
import { generateWebApplicationSchema } from "@/lib/schema/webApplication"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { THRESHOLDS, TAX_RATES, formatCurrency, formatPercentage } from "@/lib/fiscal-data"
import { GuidanceCaptureCard, PDV_CALCULATOR_OPTIONS } from "@/components/guidance"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"
const pdvThresholdLabel = formatCurrency(THRESHOLDS.pdv.value, { decimals: 0 })
const pdvThresholdYear = THRESHOLDS.pdv.effectiveFrom
  ? new Date(THRESHOLDS.pdv.effectiveFrom).getFullYear()
  : new Date().getFullYear()
const vatStandardRate = formatPercentage(TAX_RATES.vat.standard.rate)
const vatReducedRate = formatPercentage(TAX_RATES.vat.reduced[0]?.rate ?? 0.13)

export const metadata: Metadata = {
  title: "PDV Kalkulator - Kada prelazim prag?",
  description: `Izračunajte koliko ste blizu PDV praga od ${pdvThresholdLabel} i što se mijenja kada ga prijeđete.`,
  alternates: {
    canonical: `${BASE_URL}/alati/pdv-kalkulator`,
  },
}

const faq = [
  {
    q: "Kako izračunati PDV iz bruto iznosa?",
    a: `Podijelite bruto iznos s 1.25 (za ${vatStandardRate} PDV) da dobijete neto, zatim oduzmite neto od bruto za iznos PDV-a.`,
  },
  {
    q: "Kada se koristi 13% PDV?",
    a: `Stopa od ${vatReducedRate} primjenjuje se na ugostiteljske usluge, novine, vodu i neke prehrambene proizvode.`,
  },
  {
    q: "Što ako pogriješim u obračunu PDV-a?",
    a: "Ispravak se radi putem R-1 ili R-2 računa, ovisno o vrsti pogreške i razdoblju.",
  },
]

export default function PDVCalculatorPage() {
  const webAppSchema = generateWebApplicationSchema({
    name: "PDV Kalkulator",
    description: `Izračunajte koliko ste blizu PDV praga od ${pdvThresholdLabel} i što se mijenja kada ga prijeđete.`,
    url: "https://fiskai.hr/alati/pdv-kalkulator",
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
          <span className="text-white/60">/</span> <span className="text-white/90">PDV prag</span>
        </nav>

        <header>
          <h1 className="text-display text-4xl font-semibold">
            PDV kalkulator ({pdvThresholdLabel})
          </h1>
          <p className="mt-4 text-white/60">
            Provjerite koliko ste blizu praga i kad postajete PDV obveznik. Kalkulator koristi
            trenutni prihod (YTD), mjesečni prosjek i preostale mjesece do kraja godine.
          </p>
        </header>

        <div className="mt-8">
          <PDVThresholdCalculator />
        </div>

        <section className="mt-12 prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-primary prose-strong:text-white">
          <h2>Što je PDV prag?</h2>
          <p>
            Od {pdvThresholdYear}. godine, PDV prag u Hrvatskoj iznosi{" "}
            <strong>{pdvThresholdLabel}</strong> godišnje. Kada vaš prihod prijeđe ovaj iznos,
            automatski postajete PDV obveznik od prvog dana sljedećeg mjeseca.
          </p>

          <h2>Što se mijenja kada postanete PDV obveznik?</h2>
          <ul>
            <li>Morate obračunavati 25% PDV na sve račune</li>
            <li>Možete odbijati ulazni PDV (troškovi)</li>
            <li>Obvezne mjesečne ili kvartalne PDV prijave</li>
            <li>Novi IBAN-ovi za uplate poreza</li>
          </ul>

          <h2>Povezane stranice</h2>
          <ul>
            <li>
              <Link href="/usporedba/preko-praga">Što kada prijeđem prag?</Link>
            </li>
            <li>
              <Link href="/vodic/pausalni-obrt#pdv">PDV za paušalne obrtnike</Link>
            </li>
          </ul>
        </section>

        {/* Guidance Capture */}
        <section className="mt-12">
          <GuidanceCaptureCard
            toolSlug="pdv-kalkulator"
            title="Pošalji si rezultat"
            subtitle="Ostavi email i primi izračun s objašnjenjem. Ili aktiviraj upozorenje kad se približiš pragu."
            options={PDV_CALCULATOR_OPTIONS}
          />
        </section>

        <FAQ items={faq} />
      </div>
    </SectionBackground>
  )
}
