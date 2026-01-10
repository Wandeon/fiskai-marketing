# Lead Capture System

This document describes the lead capture system used on the FiskAI marketing site.

## Overview

The lead capture module (`src/lib/leads.ts`) handles collecting and storing lead data from the marketing site. It's designed to work with static exports (no server-side routes required).

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_LEADS_ENDPOINT` | No | URL to POST lead data to. If not set, data is stored locally only. |

### Setting Up the Endpoint

Add to your `.env.local` or hosting environment:

```bash
NEXT_PUBLIC_LEADS_ENDPOINT=https://your-api.example.com/leads
```

The endpoint should:
- Accept POST requests with JSON body
- Return 2xx status on success
- Handle the payload format described below

## Payload Format

```typescript
interface LeadPayload {
  // Required
  email: string              // User's email (normalized to lowercase)
  source: LeadSource         // "contact" | "register" | "newsletter" | "tool"
  consent: boolean           // User accepted privacy policy

  // Optional context
  name?: string              // User's name
  persona?: PersonaType      // "pausalni" | "doo" | "accountant" | "freelancer" | "unknown"
  invoiceVolume?: string     // Expected invoice count (e.g., "1-10", "51-200")
  message?: string           // Free-form message (contact form)

  // UTM tracking (auto-extracted from URL)
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string

  // Session context (auto-populated)
  referrer?: string          // document.referrer
  landingPath?: string       // Current path (window.location.pathname)
  timestamp: string          // ISO 8601 timestamp
}
```

### Example Payload

```json
{
  "email": "user@example.com",
  "source": "register",
  "consent": true,
  "persona": "pausalni",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "pausalni-2024",
  "referrer": "https://www.google.com/",
  "landingPath": "/register",
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

## What Happens Without an Endpoint

If `NEXT_PUBLIC_LEADS_ENDPOINT` is not set:

1. **Local Storage**: Lead data is stored in `localStorage` under the key `fiskai_lead_last`
2. **Success UI**: User sees a success message
3. **Copy Details**: User can copy their submission as JSON
4. **Mailto Fallback**: A "send email manually" link is shown as last resort

This allows the marketing site to function without a backend while still providing a better user experience than the previous mailto-based form.

## Spam Protection

The forms include a honeypot field (`company_website`) that is:
- Hidden from regular users via CSS
- Visible to bots that fill all fields
- If filled, submission is silently "accepted" but not actually sent

## Usage

### Contact Form

The contact form (`/contact`) collects:
- Name (required)
- Email (required)
- Business type (mapped to persona)
- Invoice count
- Message (optional)
- Consent checkbox

### Register Pre-Capture

The register page (`/register`) collects:
- Email (required)
- Persona selector (required)
- Consent checkbox

After submission, users are redirected to `app.fiskai.hr/register` with UTM parameters preserved.

### Skip Behavior

Users can skip the registration form. This:
- Records a `fiskai_register_skip` event in localStorage
- Includes UTM parameters and timestamp
- Redirects immediately to app

## Local Storage Keys

| Key | Description |
|-----|-------------|
| `fiskai_lead_last` | Last submitted lead payload (JSON) |
| `fiskai_register_skip` | Timestamp and UTMs when user skipped registration form |

## API Integration Examples

### Simple Webhook (e.g., Zapier)

Set `NEXT_PUBLIC_LEADS_ENDPOINT` to your Zapier webhook URL. The payload will be sent as-is.

### Custom Backend

```typescript
// Example Express.js handler
app.post('/leads', (req, res) => {
  const lead = req.body;

  // Validate
  if (!lead.email || !lead.consent) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // Store in database
  await db.leads.create(lead);

  // Optional: Send to CRM, email list, etc.
  await sendToMailchimp(lead.email, lead.persona);

  res.json({ success: true });
});
```

### Serverless Function (Vercel/Netlify)

```typescript
// api/leads.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const lead = req.body;

  // Store in your preferred service
  await fetch('https://api.airtable.com/v0/...', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_KEY}` },
    body: JSON.stringify({ fields: lead })
  });

  res.json({ success: true });
}
```

## Testing

Run the type test to verify payload structure:

```bash
npx tsc src/lib/leads.test.ts --noEmit
```

## Troubleshooting

### Submissions Not Appearing

1. Check browser console for network errors
2. Verify `NEXT_PUBLIC_LEADS_ENDPOINT` is set correctly
3. Check localStorage for `fiskai_lead_last` to see if data was captured

### UTM Parameters Not Preserved

1. Ensure URL has UTM parameters (e.g., `?utm_source=google`)
2. Check that redirect URL includes parameters (visible in Network tab)

### CORS Errors

Your endpoint must accept requests from your domain:

```typescript
// Example CORS headers
res.setHeader('Access-Control-Allow-Origin', 'https://www.fiskai.hr');
res.setHeader('Access-Control-Allow-Methods', 'POST');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```
