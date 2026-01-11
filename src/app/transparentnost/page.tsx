import type { Metadata } from "next"
import Link from "next/link"
import {
  CheckCircle2,
  FileText,
  BookOpen,
  Shield,
  Scale,
  Database,
  ExternalLink,
} from "lucide-react"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { TrustBadge } from "@/components/trust"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fiskai.hr"

export const metadata: Metadata = {
  title: "Transparentnost | FiskAI",
  description:
    "Sve na jednom mjestu: stanje spremnosti, izvori, metodologija, politike privatnosti i pravni dokumenti FiskAI platforme.",
  alternates: {
    canonical: `${BASE_URL}/transparentnost`,
  },
  openGraph: {
    title: "Transparentnost | FiskAI",
    description:
      "Sve na jednom mjestu: stanje spremnosti, izvori, metodologija, politike privatnosti i pravni dokumenti.",
    url: `${BASE_URL}/transparentnost`,
    siteName: "FiskAI",
    locale: "hr_HR",
    type: "website",
  },
}

interface TransparencyLink {
  href: string
  title: string
  description: string
  icon: React.ReactNode
}

const transparencyGroups: {
  title: string
  description: string
  links: TransparencyLink[]
}[] = [
  {
    title: "Stanje i pouzdanost",
    description: "Što možete očekivati od FiskAI platforme danas",
    links: [
      {
        href: "/spremnost",
        title: "Stanje spremnosti",
        description: "Što je spremno, što gradimo, što još nije dostupno.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      },
      {
        href: "/izvori",
        title: "Službeni izvori",
        description: "Narodne novine, Porezna uprava, HZMO i drugi izvori koje koristimo.",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        href: "/metodologija",
        title: "Metodologija",
        description: "Kako računamo doprinose, porez i druge vrijednosti u kalkulatorima.",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Standard sadržaja",
    description: "Kako pišemo i održavamo informacije",
    links: [
      {
        href: "/urednicka-politika",
        title: "Urednička politika",
        description: "Kako pišemo, ažuriramo i ispravljamo sadržaj na platformi.",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Privatnost i pravno",
    description: "Vaša prava i naše obveze",
    links: [
      {
        href: "/privacy",
        title: "Politika privatnosti",
        description: "Kako prikupljamo, koristimo i štitimo vaše osobne podatke.",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        href: "/terms",
        title: "Uvjeti korištenja",
        description: "Prava i obveze pri korištenju FiskAI platforme.",
        icon: <Scale className="h-5 w-5" />,
      },
      {
        href: "/dpa",
        title: "DPA (Obrada podataka)",
        description: "Ugovor o obradi podataka za poslovne korisnike.",
        icon: <Database className="h-5 w-5" />,
      },
      {
        href: "/ai-data-policy",
        title: "AI politika podataka",
        description: "Kako koristimo AI i što radimo s vašim podacima.",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        href: "/cookies",
        title: "Politika kolačića",
        description: "Koje kolačiće koristimo i zašto.",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
]

export default function TransparencyPage() {
  return (
    <SectionBackground>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-display text-4xl font-semibold">Transparentnost</h1>
          <p className="mt-4 text-lg text-white/60 max-w-2xl">
            Sve na jednom mjestu: kako radimo, što koristimo, i koja su vaša prava. Bez skrivanja.
          </p>
          <div className="mt-4">
            <TrustBadge variant="inline" preset="transparent" />
          </div>
        </header>

        {/* Groups */}
        <div className="space-y-12">
          {transparencyGroups.map((group) => (
            <section key={group.title}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{group.title}</h2>
                <p className="text-sm text-white/60 mt-1">{group.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-5 hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-light group-hover:bg-accent/20">
                      {link.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white/90 group-hover:text-accent-light flex items-center gap-2">
                        {link.title}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="mt-1 text-sm text-white/60">{link.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* About link */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60">
            Želite znati više o tome tko stoji iza FiskAI?{" "}
            <Link href="/about" className="text-accent-light hover:underline">
              Pogledajte stranicu O nama →
            </Link>
          </p>
        </div>
      </div>
    </SectionBackground>
  )
}
