import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Suspense } from "react"
import { Toaster } from "sonner"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/MarketingHeader"
import { MarketingAnalyticsInit } from "@/components/marketing/marketing-analytics-init"
import { ComplianceProgressBar } from "@/components/marketing/ComplianceProgressBar"
import { SpeculationRules } from "@/components/shared/seo/speculation-rules"
import { JsonLd } from "@/components/shared/seo/JsonLd"
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateSoftwareApplicationSchema,
} from "@/lib/schema/generators"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fiskai.hr"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FiskAI - AI-powered E-fakturiranje i Fiskalizacija",
    template: "%s | FiskAI",
  },
  description:
    "AI-powered platforma za e-fakturiranje i fiskalizaciju za hrvatska poduzeća. Automatizirano knjigovodstvo, porezna usklađenost i pametni savjetnik.",
  keywords: [
    "e-fakturiranje",
    "fiskalizacija",
    "e-račun",
    "AI knjigovodstvo",
    "fakturiranje hrvatska",
    "porezna usklađenost",
    "obrt",
    "d.o.o.",
    "paušalni obrt",
    "računovodstvo",
  ],
  authors: [{ name: "FiskAI", url: BASE_URL }],
  creator: "FiskAI",
  publisher: "FiskAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "hr_HR",
    url: BASE_URL,
    siteName: "FiskAI",
    title: "FiskAI - AI-powered E-fakturiranje i Fiskalizacija",
    description:
      "AI-powered platforma za e-fakturiranje i fiskalizaciju za hrvatska poduzeća. Automatizirano knjigovodstvo, porezna usklađenost i pametni savjetnik.",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "FiskAI - AI-powered E-fakturiranje",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fiskai_hr",
    creator: "@fiskai_hr",
    title: "FiskAI - AI-powered E-fakturiranje i Fiskalizacija",
    description: "AI-powered platforma za e-fakturiranje i fiskalizaciju za hrvatska poduzeća.",
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "hr-HR": BASE_URL,
      "x-default": BASE_URL,
    },
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
    },
  },
  category: "business",
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-inverse/60 transition-colors hover:text-inverse"
    >
      {children}
    </Link>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hr" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://eu.posthog.com" crossOrigin="anonymous" />
        <JsonLd
          schemas={[
            generateOrganizationSchema(),
            generateWebSiteSchema(),
            generateSoftwareApplicationSchema(),
          ]}
        />
      </head>
      <body>
        <a href="#glavni-sadrzaj" className="skip-link">
          Preskoči na sadržaj
        </a>
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand
          toastOptions={{
            className: "font-sans rounded-card shadow-elevated",
            duration: 4000,
            style: {
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
          }}
        />
        <Suspense fallback={null}>
          <div className="marketing-surface min-h-[calc(100vh-var(--header-height))]">
            <MarketingHeader />
            <MarketingAnalyticsInit />
            <SpeculationRules />

            <main id="glavni-sadrzaj" className="pb-16">{children}</main>
            <ComplianceProgressBar />

            <footer className="border-t border-inverse/10 bg-base">
              <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 lg:grid-cols-5 md:px-6">
                <div className="space-y-3 lg:col-span-2">
                  <div>
                    <p className="text-sm font-semibold text-inverse">FiskAI</p>
                    <p className="text-sm text-inverse/60 mt-1">
                      AI-first računovodstveni asistent za Hrvatsku. Beta program.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-inverse/50">PODUZEĆE I KONTAKT</p>
                    <div className="space-y-1 text-sm text-inverse/70">
                      <p className="font-medium text-inverse">FiskAI d.o.o.</p>
                      <p>Zagreb, Hrvatska</p>
                      <p>
                        Email:{" "}
                        <a href="mailto:info@fiskai.hr" className="text-link hover:underline">
                          info@fiskai.hr
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-inverse">Linkovi</p>
                  <div className="flex flex-col gap-2">
                    <NavLink href="/features">Mogućnosti</NavLink>
                    <NavLink href="/pricing">Cijene</NavLink>
                    <NavLink href="/security">Sigurnost</NavLink>
                    <NavLink href="/contact">Kontakt</NavLink>
                    <NavLink href="/status">Status sustava</NavLink>
                    <NavLink href="/for/pausalni-obrt">Za paušalni obrt</NavLink>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-inverse">Legal</p>
                  <div className="flex flex-col gap-2">
                    <NavLink href="/privacy">Privatnost</NavLink>
                    <NavLink href="/terms">Uvjeti korištenja</NavLink>
                    <NavLink href="/dpa">DPA (Obrada podataka)</NavLink>
                    <NavLink href="/cookies">Kolačići</NavLink>
                    <NavLink href="/ai-data-policy">AI politika</NavLink>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-inverse">Transparentnost</p>
                  <div className="flex flex-col gap-2">
                    <NavLink href="/metodologija">Metodologija</NavLink>
                    <NavLink href="/urednicka-politika">Urednička politika</NavLink>
                    <NavLink href="/izvori">Službeni izvori</NavLink>
                  </div>
                  <div className="pt-4">
                    <p className="text-xs font-medium text-inverse/50">PODRŠKA</p>
                    <p className="text-xs text-inverse/60 mt-1">
                      Odgovor unutar 24h radnim danima putem emaila.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto max-w-6xl border-t border-inverse/10 px-4 py-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <p className="text-xs text-inverse/60">
                    © {new Date().getFullYear()} FiskAI d.o.o. Sva prava pridržana.
                  </p>
                  <div className="flex items-center gap-6">
                    <a href="/status" className="text-xs text-inverse/60 hover:text-inverse">
                      Status sustava
                    </a>
                    <a href="/sitemap.xml" className="text-xs text-inverse/60 hover:text-inverse">
                      Sitemap
                    </a>
                    <a href="/robots.txt" className="text-xs text-inverse/60 hover:text-inverse">
                      Robots.txt
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Suspense>
      </body>
    </html>
  )
}
