import type { NextConfig } from "next"

/**
 * FiskAI Marketing Static Site Configuration
 *
 * This site is ALWAYS built as a static export.
 * No server-side features. No database. No authentication.
 * All dynamic behavior happens client-side or redirects to app.fiskai.hr
 */
const nextConfig: NextConfig = {
  // Always static export - this is a static-only site
  output: "export",

  // Images must be unoptimized for static export (no image server)
  images: {
    unoptimized: true,
  },

  // Trailing slash for clean static URLs
  trailingSlash: true,

  // Skip type checking during build (handled by CI lint step)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build (handled by CI lint step)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
