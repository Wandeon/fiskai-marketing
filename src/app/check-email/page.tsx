import type { Metadata } from "next"

const APP_URL = "https://app.fiskai.hr"

export const metadata: Metadata = {
  title: "Provjerite email - FiskAI",
  description: "Preusmjeravanje na provjeru emaila...",
  robots: { index: false, follow: false },
}

/**
 * Static redirect stub for /check-email
 * The actual check-email functionality lives at app.fiskai.hr/check-email
 * This page exists only to preserve the URL and redirect users.
 */
export default function CheckEmailRedirect() {
  const redirectUrl = `${APP_URL}/check-email`

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
