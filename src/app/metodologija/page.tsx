import { Metadata } from "next"
import { MetodologijaPageClient } from "./MetodologijaPageClient"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"

export const metadata: Metadata = {
  title: "Metodologija",
  description:
    "Kako FiskAI izračunava poreze, doprinose i druge pokazatelje. Transparentne formule i pretpostavke.",
  alternates: {
    canonical: `${BASE_URL}/metodologija`,
  },
}

export default function MetodologijaPage() {
  return <MetodologijaPageClient />
}
