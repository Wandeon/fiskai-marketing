import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { SectionBackground } from "@/components/shared/ui/patterns/SectionBackground"
import { RegisterForm } from "./RegisterForm"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"

export const metadata: Metadata = {
  title: "Registracija - Započni besplatno",
  description:
    "Registrirajte se za FiskAI i započnite 14-dnevni besplatni probni period. Bez kreditne kartice.",
  alternates: {
    canonical: `${BASE_URL}/register`,
  },
}

const benefits = [
  "14 dana besplatno - bez obaveza",
  "Nije potrebna kreditna kartica",
  "Brza i jednostavna registracija",
  "Automatsko OCR skeniranje računa",
  "Izvoz za knjigovođu jednim klikom",
]

export default function RegisterPage() {
  return (
    <SectionBackground variant="dark">
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          {/* Left side - Benefits */}
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-accent-light font-medium mb-2">
                  Besplatni probni period
                </p>
                <h2 className="text-2xl font-semibold mb-4">
                  Zašto FiskAI?
                </h2>
              </div>

              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <blockquote className="border-l-2 border-accent/30 pl-4 text-sm text-white/60 italic">
                  &ldquo;Dok drugi kompliciraju, mi pojednostavljujemo.&rdquo;
                </blockquote>
              </div>

              <div className="pt-4">
                <p className="text-sm text-white/60">
                  Imate pitanja prije registracije?{" "}
                  <Link
                    href="/contact"
                    className="text-accent-light hover:underline"
                  >
                    Kontaktirajte nas
                  </Link>{" "}
                  ili pogledajte{" "}
                  <Link
                    href="/pricing"
                    className="text-accent-light hover:underline"
                  >
                    cijene i planove
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="order-1 md:order-2">
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </SectionBackground>
  )
}
