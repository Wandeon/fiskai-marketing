# SiteGround Static Deployment Runbook

> **Target:** www.fiskai.hr served from SiteGround static hosting
> **Source:** `out/` directory from fiskai-marketing static build
> **Last Updated:** 2026-01-09

## Overview

The FiskAI marketing site is a static Next.js export deployed to SiteGround shared hosting. This runbook covers manual and automated deployment procedures.

## Prerequisites

- SiteGround hosting account with SSH access enabled
- SSH key configured for passwordless auth (or SFTP credentials in secrets)
- GitHub Actions secrets configured (for automated deploys)

## Folder Structure

```
SiteGround Web Root (public_html/)
├── index.html          # Homepage
├── login/
│   └── index.html      # Redirect to app.fiskai.hr/login
├── register/
│   └── index.html      # Redirect to app.fiskai.hr/register
├── vijesti/
│   ├── index.html      # News listing
│   └── [slug]/
│       └── index.html  # Individual news articles
├── contact/
│   └── index.html      # Contact page
├── _next/              # Next.js static assets
│   └── static/
├── images/             # Static images
└── ...                 # Other static pages
```

## Manual Deployment

### Option 1: SiteGround File Manager

1. Build locally:
   ```bash
   cd fiskai-marketing
   npm ci
   npm run build
   ```

2. Compress output:
   ```bash
   cd out
   zip -r ../marketing-site.zip .
   ```

3. Upload via SiteGround Site Tools:
   - Log into SiteGround → Site Tools → File Manager
   - Navigate to `public_html`
   - Upload `marketing-site.zip`
   - Extract in place
   - Delete the zip file

### Option 2: SFTP Upload

1. Build locally (same as above)

2. Upload via SFTP:
   ```bash
   # Using lftp (recommended for batch uploads)
   lftp -u USERNAME,PASSWORD sftp://HOSTNAME << EOF
   mirror -R --delete out/ public_html/
   quit
   EOF
   ```

   Or using rsync over SSH:
   ```bash
   rsync -avz --delete out/ USERNAME@HOSTNAME:~/public_html/
   ```

### Option 3: SSH + Git Pull (if repo cloned on server)

```bash
ssh USERNAME@HOSTNAME << 'EOF'
cd ~/fiskai-marketing
git pull origin main
npm ci
npm run build
rsync -av --delete out/ ~/public_html/
EOF
```

## Automated Deployment (GitHub Actions)

Add to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to SiteGround

on:
  workflow_run:
    workflows: ["Scheduled Rebuild"]
    types: [completed]
  workflow_dispatch:

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to SiteGround
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.SITEGROUND_HOST }}
          username: ${{ secrets.SITEGROUND_USER }}
          password: ${{ secrets.SITEGROUND_PASSWORD }}
          local-dir: ./out/
          server-dir: ./public_html/
          dangerous-clean-slate: true
```

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `SITEGROUND_HOST` | SiteGround SFTP hostname (e.g., `fiskai.hr`) |
| `SITEGROUND_USER` | SFTP username |
| `SITEGROUND_PASSWORD` | SFTP password |

## Caching Configuration

### SiteGround SuperCacher

Enable in SiteGround Site Tools:
- **Static Cache:** ON (caches HTML, CSS, JS)
- **Dynamic Cache:** OFF (not needed for static site)
- **Memcached:** OFF (not needed)

### Cache Headers

Add `.htaccess` to `public/` for custom cache headers:

```apache
# Cache static assets for 1 year
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Cache HTML for 1 hour (allows daily updates)
<IfModule mod_expires.c>
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
```

## Verifying Deployment

### Critical Pages Checklist

After deployment, verify these pages load correctly:

| Page | URL | Expected |
|------|-----|----------|
| Homepage | `https://www.fiskai.hr/` | Marketing landing |
| Login | `https://www.fiskai.hr/login/` | Redirects to app.fiskai.hr |
| Register | `https://www.fiskai.hr/register/` | Redirects to app.fiskai.hr |
| Contact | `https://www.fiskai.hr/contact/` | Contact form |
| News | `https://www.fiskai.hr/vijesti/` | News listing |
| Pricing | `https://www.fiskai.hr/pricing/` | Pricing page |

### Redirect Verification

Test that auth redirects work:

```bash
# Should return 200 with meta refresh
curl -sI https://www.fiskai.hr/login/ | head -5

# Check meta refresh target in HTML
curl -s https://www.fiskai.hr/login/ | grep -o 'url=https://app.fiskai.hr/[^"]*'
```

### 404 Page

Verify custom 404 works:
```bash
curl -sI https://www.fiskai.hr/nonexistent-page/
# Should return 404 with custom page
```

## Troubleshooting

### Issue: Stale Content After Deploy

1. Purge SiteGround SuperCacher:
   - Site Tools → Speed → Caching → Purge Cache

2. Clear Cloudflare cache (if using):
   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
     -H "Authorization: Bearer API_TOKEN" \
     -d '{"purge_everything":true}'
   ```

### Issue: Missing Files

1. Verify build output locally:
   ```bash
   find out -name "*.html" | wc -l  # Should be 100+ files
   ```

2. Check SFTP upload logs for errors

3. Verify file permissions on server:
   ```bash
   ssh user@host 'ls -la ~/public_html/'
   ```

### Issue: Redirect Loops

If redirect pages cause loops:
1. Check browser dev tools Network tab for redirect chain
2. Verify redirect target is `app.fiskai.hr`, not `www.fiskai.hr`
3. Clear browser cache

### Issue: Assets Not Loading

1. Check `_next/static/` directory exists on server
2. Verify base path in next.config.ts matches deployment
3. Check browser console for 404 errors on assets

## Rollback Procedure

If deployment breaks the site:

1. **Quick rollback:** Download previous artifact from GitHub Actions
   - Go to Actions → Scheduled Rebuild → Previous successful run → Artifacts
   - Download and re-upload via SFTP

2. **Emergency:** Restore from SiteGround backup
   - Site Tools → Security → Backups → Restore files

## Monitoring

### Uptime Monitoring

Set up monitoring for:
- `https://www.fiskai.hr/` (homepage)
- `https://www.fiskai.hr/vijesti/` (news - confirms build ran)

Recommended: UptimeRobot, Pingdom, or similar

### Build Alerts

GitHub Actions sends email on workflow failure. Ensure notifications are enabled for:
- Scheduled Rebuild failures
- Deploy failures

## Daily Rebuild Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    05:00 UTC Daily                          │
│                                                             │
│  1. Scheduled Rebuild runs                                  │
│     └── Fetches latest news from WordPress                  │
│     └── Falls back to news.json if WP down                  │
│     └── Builds static site                                  │
│     └── Uploads artifact                                    │
│                                                             │
│  2. Deploy workflow triggers (on rebuild success)           │
│     └── Downloads build artifact                            │
│     └── Uploads to SiteGround via SFTP                      │
│     └── Purges cache                                        │
│                                                             │
│  3. Site live with fresh content                            │
└─────────────────────────────────────────────────────────────┘
```

## Contacts

- **SiteGround Support:** support@siteground.com or live chat
- **Domain/DNS:** Cloudflare dashboard (fiskai.hr zone)
- **Marketing Repo:** https://github.com/Wandeon/fiskai-marketing
