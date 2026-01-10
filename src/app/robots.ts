import type { MetadataRoute } from "next"

// Required for static export
export const dynamic = "force-static"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.fiskai.hr"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/app/",
          "/staff/",
          "/admin/",
          "/_next/",
          "/login",
          "/register",
          "/select-role",
          "/forgot-password",
          "/reset-password",
          "/check-email",
          "/verify-email",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/llms.txt"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/llms.txt"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/llms.txt"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/llms.txt"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
