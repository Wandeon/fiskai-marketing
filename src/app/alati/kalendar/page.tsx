import { Metadata } from "next"
import Link from "next/link"
import { DeadlineCalendar } from "@/components/shared/knowledge-hub/tools/DeadlineCalendar"
import { FAQ } from "@/components/shared/content/FAQ"
import { generateWebApplicationSchema } from "@/lib/schema/webApplication"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { DEADLINES, ADDITIONAL_DEADLINES } from "@/lib/fiscal-data"
import { GuidanceCaptureCard, CALENDAR_OPTIONS } from "@/components/guidance"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"

export const metadata: Metadata = {
  title: `Kalendar Rokova ${DEADLINES.year}`,
  description: `Svi važni porezni rokovi za ${DEADLINES.year}. godinu na jednom mjestu.`,
  alternates: {
    canonical: `${BASE_URL}/alati/kalendar`,
  },
}

const calendarYear = DEADLINES.year
const formatDayMonth = (dateString: string, year: number) => {
  const [day, month] = dateString.split(".").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "long",
  })
}

const posdQ4Deadline = formatDayMonth(ADDITIONAL_DEADLINES.posdQuarterly.dates[0], calendarYear + 1)
const contributionsDay = DEADLINES.contributions.monthly.dates[0]
const dohodakDeadline = formatDayMonth(DEADLINES.annualFiling.dohodak.dates[0], calendarYear)
const posdAnnualDeadline = formatDayMonth(ADDITIONAL_DEADLINES.posd.dates[0], calendarYear)
const pdvDeadline = formatDayMonth(ADDITIONAL_DEADLINES.pdv.quarterly.dates[0], calendarYear)

const faq = [
  {
    q: "Kada je rok za PO-SD za Q4?",
    a: `${posdQ4Deadline} sljedeće godine.`,
  },
  {
    q: "Kada se plaćaju doprinosi za paušalce?",
    a: `Do ${contributionsDay}. u mjesecu za prethodni mjesec.`,
  },
  {
    q: "Koji su godišnji porezni rokovi?",
    a: `DOH do ${dohodakDeadline}, godišnji PO-SD do ${posdAnnualDeadline}, PDV-K do ${pdvDeadline}.`,
  },
]

export default function CalendarPage() {
  const webAppSchema = generateWebApplicationSchema({
    name: "Porezni Kalendar",
    description: `Svi važni porezni rokovi za ${calendarYear}. godinu na jednom mjestu.`,
    url: "https://fiskai.hr/alati/kalendar",
  })

  return (
    <SectionBackground>
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
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
          <span className="text-white/60">/</span> <span className="text-white/90">Kalendar</span>
        </nav>

        <header>
          <h1 className="text-display text-4xl font-semibold">Kalendar rokova {calendarYear}</h1>
          <p className="mt-4 text-white/60">Ne propustite važne rokove za prijave i uplate.</p>
        </header>

        <div className="mt-8">
          <DeadlineCalendar year={calendarYear} />
        </div>

        {/* Guidance Capture */}
        <section className="mt-12">
          <GuidanceCaptureCard
            toolSlug="kalendar"
            title="Ne propusti rok"
            subtitle="Ostavi email i primi podsjetnik prije važnih rokova."
            options={CALENDAR_OPTIONS}
            toolSnapshot={{ year: calendarYear }}
          />
        </section>

        <FAQ items={faq} />
      </div>
    </SectionBackground>
  )
}
