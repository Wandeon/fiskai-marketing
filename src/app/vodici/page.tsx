import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vodiči | FiskAI",
  robots: "noindex, nofollow",
}

export default function VodiciRedirectPage() {
  return (
    <>
      {/* Meta refresh - works on all browsers/hosts */}
      <meta httpEquiv="refresh" content="0;url=/vodic" />

      {/* JavaScript redirect - immediate fallback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("/vodic");`,
        }}
      />

      {/* Visible fallback with link */}
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="mb-4">Preusmjeravanje na vodiče...</p>
          <a
            href="/vodic"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Otvorite vodiče
          </a>
        </div>
      </div>
    </>
  )
}
