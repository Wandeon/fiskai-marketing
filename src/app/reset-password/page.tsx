import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nova lozinka",
  robots: "noindex, nofollow", // Don't index redirect pages
}

export default function ResetPasswordRedirectPage() {
  return (
    <>
      {/* Meta refresh - works on all browsers/hosts */}
      <meta httpEquiv="refresh" content="0;url=https://app.fiskai.hr/reset-password" />

      {/* JavaScript redirect - immediate fallback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("https://app.fiskai.hr/reset-password");`,
        }}
      />

      {/* Visible fallback with link */}
      <div className="flex min-h-screen items-center justify-center bg-base text-inverse">
        <div className="text-center space-y-4">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-lg">Preusmjeravanje...</p>
          <div className="space-y-2 pt-2">
            <a
              href="https://app.fiskai.hr/reset-password"
              className="block text-sm text-link underline hover:text-accent-light"
            >
              Kliknite ovdje ako niste automatski preusmjereni
            </a>
            <Link href="/" className="block text-xs text-inverse/60 hover:text-inverse">
              ← Povratak na početnu
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
