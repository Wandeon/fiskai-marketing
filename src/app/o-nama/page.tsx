import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "O nama | FiskAI",
  robots: "noindex, nofollow",
}

export default function ONamaRedirectPage() {
  return (
    <>
      {/* Meta refresh - works on all browsers/hosts */}
      <meta httpEquiv="refresh" content="0;url=/about" />

      {/* JavaScript redirect - immediate fallback */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("/about");`,
        }}
      />

      {/* Visible fallback with link */}
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="mb-4">Preusmjeravanje na stranicu o nama...</p>
          <a
            href="/about"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Saznajte više o nama
          </a>
        </div>
      </div>
    </>
  )
}
