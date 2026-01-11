/**
 * FiskAI Readiness Ledger
 *
 * This file is the single source of truth for what's ready, in progress,
 * and not yet available in FiskAI.
 *
 * RULES:
 * - Never claim "ready" if it's not in the "ready" list
 * - Update this file when features ship or roadmap changes
 * - Keep descriptions honest and clear
 *
 * @see /spremnost for the public-facing page
 * @see docs/trust-ledger.md for update guidelines
 */

// ============================================================================
// Types
// ============================================================================

export type ReadinessStatus = "ready" | "building" | "not_yet"

export type Audience = "pausalni" | "doo" | "accountant" | "all"

export interface ReadinessItem {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Current status */
  status: ReadinessStatus
  /** Who this is for */
  audience: Audience[]
  /** What this means in practice (1-2 lines) */
  description: string
  /** How we verify accuracy (optional link) */
  verificationLink?: string
  /** Additional context for "building" or "not_yet" items */
  note?: string
}

export interface ChangelogEntry {
  date: string
  description: string
}

// ============================================================================
// Audience Labels (Croatian)
// ============================================================================

export const audienceLabels: Record<Audience, string> = {
  pausalni: "Paušalni obrt",
  doo: "D.O.O. / J.D.O.O.",
  accountant: "Knjigovođe",
  all: "Svi korisnici",
}

// ============================================================================
// Readiness Data
// ============================================================================

export const readinessItems: ReadinessItem[] = [
  // ========== READY ==========
  {
    id: "invoicing",
    name: "Izdavanje računa + predlošci",
    status: "ready",
    audience: ["all"],
    description:
      "Kreirajte profesionalne račune s prilagodljivim predlošcima. Automatsko numeriranje, PDF export, slanje emailom.",
    verificationLink: "/features",
  },
  {
    id: "expense-tracking",
    name: "Evidencija troškova + OCR",
    status: "ready",
    audience: ["all"],
    description:
      "Skenirajte račune i automatski izvucite podatke. OCR prepoznaje iznose, datume i dobavljače. Korisnik potvrđuje točnost.",
    note: "OCR rezultati zahtijevaju provjeru korisnika prije knjiženja.",
  },
  {
    id: "exports",
    name: "Izvozi za knjigovođe (CSV/Excel/PDF)",
    status: "ready",
    audience: ["all"],
    description:
      "Jednim klikom izvezite sve podatke u formatima koje vaš knjigovođa koristi. Strukturirano, bez ručnog prepisivanja.",
    verificationLink: "/for/accountants",
  },
  {
    id: "pdv-calculations",
    name: "PDV osnovne kalkulacije",
    status: "ready",
    audience: ["doo"],
    description:
      "Automatski izračun PDV-a na računima. Pregled ulaznog i izlaznog PDV-a. Priprema za PDV prijavu.",
    verificationLink: "/alati/pdv-kalkulator",
  },
  {
    id: "multi-user",
    name: "Višekorisnički pristup + audit trail",
    status: "ready",
    audience: ["doo", "accountant"],
    description:
      "Dodajte članove tima s različitim ovlastima. Svaka promjena se bilježi s vremenom i korisnikom.",
    verificationLink: "/security",
  },
  {
    id: "contribution-calc",
    name: "Kalkulator doprinosa",
    status: "ready",
    audience: ["pausalni"],
    description:
      "Automatski izračun mjesečnih doprinosa (MIO I, MIO II, HZZO) prema aktualnoj osnovici.",
    verificationLink: "/alati/kalkulator-doprinosa",
  },
  {
    id: "tax-calc",
    name: "Kalkulator paušalnog poreza",
    status: "ready",
    audience: ["pausalni"],
    description:
      "Izračun kvartalnog i godišnjeg poreza na temelju prihoda. Svi porezni razredi ažurirani.",
    verificationLink: "/alati/kalkulator-poreza",
  },
  {
    id: "deadline-calendar",
    name: "Kalendar poreznih rokova",
    status: "ready",
    audience: ["all"],
    description:
      "Svi važni rokovi za prijave i uplate na jednom mjestu. Ažurirano za tekuću godinu.",
    verificationLink: "/alati/kalendar",
  },

  // ========== BUILDING ==========
  {
    id: "fiskalizacija-prep",
    name: "Fiskalizacija 2.0 priprema",
    status: "building",
    audience: ["all"],
    description:
      "Vodiči, provjere i edukacija za nadolazeće promjene. Pratimo službene najave i ažuriramo sadržaj.",
    note: "Puna integracija ovisi o finalnim specifikacijama Porezne uprave.",
    verificationLink: "/fiskalizacija",
  },
  {
    id: "e-invoices-prep",
    name: "E-računi (EN 16931 priprema)",
    status: "building",
    audience: ["doo"],
    description:
      "Priprema za europski standard e-fakturiranja. Pratimo hrvatske propise i rokove implementacije.",
    note: "Slanje i zaprimanje e-računa još nije dostupno.",
  },

  // ========== NOT YET ==========
  {
    id: "e-invoices-full",
    name: "E-računi: slanje i zaprimanje",
    status: "not_yet",
    audience: ["doo"],
    description:
      "End-to-end e-fakturiranje kroz FiskAI. Čekamo finalizaciju hrvatskih propisa za potpunu implementaciju.",
    note: "Ne prodajemo ovo kao gotovo. Obavijestit ćemo vas kada bude spremno.",
  },
  {
    id: "fiskalizacija-full",
    name: "Fiskalizacija 2.0: puna integracija",
    status: "not_yet",
    audience: ["all"],
    description:
      "Direktna integracija s Poreznom upravom za Fiskalizaciju 2.0. Ovisno o službenim specifikacijama.",
    note: "Trenutno nudimo pripremu i edukaciju, ne punu integraciju.",
  },
]

// ============================================================================
// Last Updated & Changelog
// ============================================================================

export const lastUpdated = "2026-01-11"

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-01-11",
    description: "Inicijalna verzija stranice spremnosti. Dokumentirano trenutno stanje svih funkcionalnosti.",
  },
  {
    date: "2026-01-10",
    description: "Dodani kalkulatori (doprinosi, porez, PDV prag) i kalendar rokova.",
  },
  {
    date: "2026-01-08",
    description: "Poboljšan OCR za skeniranje računa. Dodan audit trail za višekorisničke račune.",
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getItemsByStatus(status: ReadinessStatus): ReadinessItem[] {
  return readinessItems.filter((item) => item.status === status)
}

export function getReadyItems(): ReadinessItem[] {
  return getItemsByStatus("ready")
}

export function getBuildingItems(): ReadinessItem[] {
  return getItemsByStatus("building")
}

export function getNotYetItems(): ReadinessItem[] {
  return getItemsByStatus("not_yet")
}

export function getItemById(id: string): ReadinessItem | undefined {
  return readinessItems.find((item) => item.id === id)
}

export function isFeatureReady(id: string): boolean {
  const item = getItemById(id)
  return item?.status === "ready"
}
