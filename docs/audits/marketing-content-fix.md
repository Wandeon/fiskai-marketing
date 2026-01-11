# Marketing Content Audit & Fixes

**Date:** 2026-01-11
**Branch:** fix/marketing-content-audit

## Audit Summary

### Pages Audited

| Page Group | Pages | Status |
|------------|-------|--------|
| Conversion | /, /pricing, /for/pausalni-obrt, /for/dooo, /for/accountants, /contact, /register, /login | All 200 OK |
| Trust/Legal | /security, /privacy, /terms, /dpa, /metodologija, /izvori, /urednicka-politika | All 200 OK |
| Education Hub | /baza-znanja, /vodic/pausalni-obrt, /kako-da/*, /rjecnik/fiskalizacija, /usporedba/* | All 200 OK |

### Issues Found

#### Critical: Contact Form Fake Success (FIXED)

**Symptom:** Contact form showed "Zahtjev je spremljen!" (Request saved!) and "Kontaktirat ćemo vas unutar 24h" even when:
- No API endpoint was configured (`NEXT_PUBLIC_LEADS_ENDPOINT` not set)
- API endpoint failed

**Root Cause:** `submitLead()` in `src/lib/leads.ts` always returns `success: true` and stores to localStorage as fallback, but the UI didn't differentiate between API success and local-only storage.

**Fix:** Updated `src/app/contact/ContactForm.tsx` to:
1. Track submission method (`api` vs `local`)
2. Show different UI based on method:
   - **API success:** Green success message with "Zahtjev je poslan!" and promise of 24h response
   - **Local-only:** Yellow/warning message with "Još jedan korak" and prominent mailto button

This is honest UX - users know they need to send the email manually if the API isn't available.

#### Already Fixed (Previous Sessions)

1. **E-invoicing claims consistency** - All pages now correctly say "u pripremi" (in preparation):
   - Homepage: "E-računi u pripremi"
   - Pricing: "E-računi (u pripremi)"
   - Features: Links to /spremnost for status

2. **DPA draft status** - Page already has disclaimer: "Ova stranica sadrži početni nacrt... Prije komercijalnog korištenja, ovaj dokument treba uskladiti s pravnim savjetnikom"

3. **Register redirect UX** - NOT a jarring instant redirect. Has:
   - Pre-capture form (email + persona selection)
   - Consent checkbox
   - "Skip" option for impatient users
   - Proper redirecting state with fallback link

4. **Login redirect** - Shows spinner and fallback link, not a jarring blink

5. **Navigation links** - All header/footer links return 200

6. **Content rendering** - MDX setup uses proper prose classes, typography is correct

### Not Issues

- Article typography uses `prose prose-invert prose-lg` classes
- MDX components are properly configured
- Table of contents extracts headings correctly
- Structured data (JSON-LD) is present

## Files Changed

- `src/app/contact/ContactForm.tsx` - Honest submission feedback based on method

## Manual QA Script

1. **Contact Form (local-only mode):**
   - Go to https://www.fiskai.hr/contact/
   - Fill form and submit
   - Verify: Yellow "Još jedan korak" message appears (not green "Zahtjev je poslan!")
   - Verify: Prominent "Pošalji email" button opens mailto client

2. **Navigation:**
   - Click each header nav link: Značajke, Cijene, Vodiči, O nama, Kontakt
   - Verify: All pages load without 404

3. **E-invoicing consistency:**
   - Check homepage hero → "E-računi u pripremi" with Clock icon
   - Check /pricing → "E-računi (u pripremi)" in feature list
   - Check /features → "E-računi i fiskalizacija 2.0" has "Dolazi uskoro" badge

4. **Register flow:**
   - Go to /register
   - Verify: Form appears (not instant redirect)
   - Verify: Has email, persona, consent fields
   - Verify: "Skip" option exists

5. **Long-form content:**
   - Go to /vodic/pausalni-obrt
   - Verify: Headings render with proper hierarchy
   - Verify: Lists are styled
   - Verify: TOC sidebar is visible on desktop
