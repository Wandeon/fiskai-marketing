# Trust Ledger (Stanje Spremnosti)

## Overview

The Truth Ledger is a public transparency page at `/spremnost` that clearly states what FiskAI can and cannot do. This prevents overselling and builds trust through honest communication.

## Files

| File | Purpose |
|------|---------|
| `src/content/readiness.ts` | Single source of truth for feature status |
| `src/app/spremnost/page.tsx` | Public-facing transparency page |

## Status Categories

1. **Ready (`ready`)** - Features available today that users can rely on
2. **Building (`building`)** - Features we're actively working on with partial availability
3. **Not Yet (`not_yet`)** - Planned features we do NOT currently offer

## How to Update

### When a feature ships
1. Open `src/content/readiness.ts`
2. Change the item's `status` from `"building"` to `"ready"`
3. Update `lastUpdated` to today's date
4. Add a changelog entry
5. Remove any `note` that's no longer relevant

### When starting new work
1. Add item to the list with `status: "building"`
2. Include a clear `note` about what's available now vs. what's coming
3. Update changelog

### Key Rules
- **Never claim "ready" if something isn't fully working**
- **Always include a note for "building" items explaining current state**
- **Update the changelog for every status change**

## Audiences

Each item targets one or more audiences:
- `pausalni` - Paušalni obrt (lump-sum trades)
- `doo` - D.O.O. / J.D.O.O. companies
- `accountant` - Accountants and bookkeepers
- `all` - Everyone

## Integration Points

### Footer
Link added to footer under "Transparentnost" section: `Stanje spremnosti → /spremnost`

### Feature Claims
Any page making capability claims should link to `/spremnost` if the feature is not fully ready:
```tsx
<Link href="/spremnost" className="text-accent-light hover:underline">
  u pripremi →
</Link>
```

### Wizard Results
The Fiskalizacija2Wizard shows "integracija u izradi" for e-invoice features rather than claiming they work.

## Claims Fixed in This PR

1. **`/fiskalizacija` page** - Changed from "FiskAI automatski generira e-račune..." to honest messaging about preparation status
2. **Fiskalizacija2Wizard** - Changed claims about automatic e-invoice sending to "integracija u izradi"
3. **Footer** - Added "Stanje spremnosti" link

## Changelog Location

The changelog is maintained in `src/content/readiness.ts`:
```typescript
export const changelog: ChangelogEntry[] = [
  {
    date: "2026-01-11",
    description: "Inicijalna verzija stranice spremnosti...",
  },
]
```

## Our Standard

The page includes a "Naš standard" block that commits to:
- Not selling unfinished features as ready
- Not using regulatory fear for sales
- Not promising features we can't deliver

This standard is linked to:
- `/urednicka-politika` - Editorial policy
- `/privacy` - Privacy policy
- `/izvori` - Sources and methodology
