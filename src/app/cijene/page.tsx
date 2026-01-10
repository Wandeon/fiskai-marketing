import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cijene | FiskAI",
  robots: "noindex, nofollow",
}

export default function CijeneRedirectPage() {
  return (
    <>
      {/* Meta refresh - works on all browsers/hosts */}
      <meta httpEquiv="refresh" content="0;url=/pricing" />

      {/* JavaScript redirect - immediate fallback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("/pricing");`,
        }}
      />

      {/* Visible fallback with link */}
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="mb-4">Preusmjeravanje na cijene...</p>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Pogledajte cijene
          </a>
        </div>
      </div>
    </>
  )
}
