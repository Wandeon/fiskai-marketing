# FiskAI Marketing Static Site

Static marketing website for [FiskAI](https://fiskai.hr) - Croatian accounting software for small businesses.

## Overview

This repository contains the statically-generated marketing site for FiskAI. It's completely separated from the main application (`app.fiskai.hr`) and runs as pure static HTML.

### Key Features

- **100% Static** - No server-side rendering, no database, no authentication
- **Fast Performance** - Pre-rendered HTML served from CDN
- **High Availability** - Survives backend outages
- **WordPress Integration** - Fetches news content from WordPress with JSON fallback

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── login/              # Static redirect to app.fiskai.hr
│   ├── register/           # Static redirect to app.fiskai.hr
│   ├── vodic/[slug]/       # Knowledge hub guides
│   ├── vijesti/            # News section
│   └── ...
├── components/
│   ├── marketing/          # Marketing-specific components
│   └── shared/             # Shared UI components
├── lib/
│   ├── wordpress/          # WordPress client with fallback
│   ├── content/            # Content loaders (MDX)
│   └── knowledge-hub/      # Knowledge hub utilities
└── content/                # MDX content files
    ├── vodici/             # Guides
    ├── usporedbe/          # Comparisons
    ├── rjecnik/            # Glossary
    └── news.json           # Fallback news data
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build static export
npm run build

# Output is in ./out directory
```

## Auth Redirects

The following pages redirect to `app.fiskai.hr`:

| Marketing URL | Redirects To |
|---------------|--------------|
| `/login` | `app.fiskai.hr/login` |
| `/register` | `app.fiskai.hr/register` |
| `/select-role` | `app.fiskai.hr/select-role` |
| `/check-email` | `app.fiskai.hr/check-email` |
| `/verify-email` | `app.fiskai.hr/verify-email` |

## CI/CD

- **On PR/Push**: Lint → TypeScript check → Forbidden import checks → Build
- **Daily at 05:00 UTC**: Scheduled rebuild to refresh news content

## Boundary Rules

This site must NOT use:
- Database (`@/lib/db`, Prisma)
- Authentication (`@/lib/auth`)
- Server actions (`"use server"`)
- Force-dynamic routes

See `docs/marketing/BOUNDARY_CONTRACT.md` for full details.
