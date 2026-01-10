import type { Metadata } from "next"

const APP_URL = "https://app.fiskai.hr"

export const metadata: Metadata = {
  title: "Potvrda emaila - FiskAI",
  description: "Preusmjeravanje na potvrdu emaila...",
  robots: { index: false, follow: false },
}

/**
 * Static redirect stub for /verify-email
 * The actual verify-email functionality lives at app.fiskai.hr/verify-email
 * This page exists only to preserve the URL and redirect users.
 */
export default function VerifyEmailRedirect() {
  const redirectUrl = `${APP_URL}/verify-email`

  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${redirectUrl}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("${redirectUrl}");`,
        }}
      />
      <div className="min-h-screen flex items-center justify-center bg-base text-inverse">
        <div className="text-center space-y-4">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-lg">Preusmjeravanje na aplikaciju...</p>
          <div className="space-y-2 pt-2">
            <a
              href={redirectUrl}
              className="block text-sm text-link underline hover:text-accent-light"
            >
              Kliknite ovdje ako se stranica ne učita automatski
            </a>
            <a href="/" className="block text-xs text-inverse/60 hover:text-inverse">
              ← Povratak na početnu
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
