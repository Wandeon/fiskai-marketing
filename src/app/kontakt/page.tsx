import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt | FiskAI",
  robots: "noindex, nofollow",
}

export default function KontaktRedirectPage() {
  return (
    <>
      {/* Meta refresh - works on all browsers/hosts */}
      <meta httpEquiv="refresh" content="0;url=/contact" />

      {/* JavaScript redirect - immediate fallback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("/contact");`,
        }}
      />

      {/* Visible fallback with link */}
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="mb-4">Preusmjeravanje na kontakt...</p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Otvorite kontakt stranicu
          </a>
        </div>
      </div>
    </>
  )
}
