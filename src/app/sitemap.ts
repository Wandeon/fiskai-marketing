import type { MetadataRoute } from "next"

// Required for static export
export const dynamic = "force-static"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Core marketing pages
  const corePages = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/features", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/security", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/status", priority: 0.6, changeFrequency: "daily" as const },
    { url: "/prelazak", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/fiskalizacija", priority: 0.8, changeFrequency: "monthly" as const },
  ]

  // Business segment pages
  const businessPages = [
    { url: "/for/pausalni-obrt", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/for/dooo", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/for/accountants", priority: 0.8, changeFrequency: "monthly" as const },
  ]

  // Tools
  const toolPages = [
    { url: "/alati", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/alati/pdv-kalkulator", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/alati/posd-kalkulator", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/alati/uplatnice", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/alati/kalendar", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/alati/oib-validator", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/alati/kalkulator-doprinosa", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/alati/kalkulator-poreza", priority: 0.7, changeFrequency: "monthly" as const },
  ]

  // Guides
  const guidePages = [
    { url: "/vodic", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/vodic/pausalni-obrt", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vodic/obrt-dohodak", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vodic/doo", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vodic/freelancer", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vodic/posebni-oblici", priority: 0.7, changeFrequency: "monthly" as const },
  ]

  // Comparisons
  const comparisonPages = [
    { url: "/usporedba", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/usporedba/pocinjem-solo", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/usporedba/dodatni-prihod", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/usporedba/firma", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/usporedba/preko-praga", priority: 0.7, changeFrequency: "monthly" as const },
  ]

  // Knowledge hub
  const knowledgePages = [
    { url: "/baza-znanja", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/kako-da", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "/rjecnik", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/vijesti", priority: 0.8, changeFrequency: "daily" as const },
  ]

  // Legal & transparency
  const legalPages = [
    { url: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
    { url: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
    { url: "/dpa", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/ai-data-policy", priority: 0.4, changeFrequency: "yearly" as const },
    { url: "/metodologija", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/urednicka-politika", priority: 0.4, changeFrequency: "yearly" as const },
    { url: "/izvori", priority: 0.5, changeFrequency: "monthly" as const },
  ]

  const allPages = [
    ...corePages,
    ...businessPages,
    ...toolPages,
    ...guidePages,
    ...comparisonPages,
    ...knowledgePages,
    ...legalPages,
  ]

  return allPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
