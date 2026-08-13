# Wedding Planner — Code Audit v1

**Date:** 13 August 2026  
**Findings:** 15 across 3 tiers

---

## Summary

| Tier | Count | When to fix |
|------|-------|-------------|
| [Ship-blockers](./01-ship-blockers.md) | 5 | Before any real traffic or backend work |
| [Integration blockers](./02-integration-blockers.md) | 5 | Before backend work begins |
| [Cleanup](./03-cleanup.md) | 5 | Before first public release |

---

## Quick index

### Ship-blockers

| # | File | Issue |
|---|------|-------|
| 01 | `src/lib/data/repository.ts:24` | `read()` silently returns `[]` and corrupts lead history under async storage |
| 02 | `src/lib/data/storage.ts:54` | `clearAllStoredData()` bypasses swappable storage binding |
| 03 | `src/lib/store/planning.ts:127` | `rebuildBudget()` discards manual allocation overrides |
| 04 | `src/components/site-builder/SiteBuilder.tsx:36` | No hydration guard — structural DOM mismatch for returning users |
| 05 | `src/components/site-builder/CoupleSite.tsx:28` | Wedding date one day early in negative-UTC-offset timezones |

### Integration blockers

| # | File | Issue |
|---|------|-------|
| 06 | `src/lib/data/repository.ts:56` | `createInquiry()` is dead code — venue/vendor forms use `createLead()` |
| 07 | `src/lib/store/site.ts:104` | Slug collision — same-name couples overwrite each other's page |
| 08 | `src/components/chrome/NewsletterForm.tsx:40` | No error handling — submit button stuck on real backend rejection |
| 09 | `src/lib/analytics.ts:10` | 8 of 23 `AnalyticsEvent` members have zero call sites |
| 10 | `src/content/brand.ts:103` | `demoNotice` only controls Footer; 9+ other surfaces hardcode their own |

### Cleanup

| # | File | Issue |
|---|------|-------|
| 11 | `src/components/site-builder/SiteBuilder.tsx:243` | `key={index}` on schedule rows — delete corrupts focused input |
| 12 | `src/components/tools/Checklist.tsx:64` | Hydration guard inconsistent — returning users see flash of seed tasks |
| 13 | `src/lib/utils.ts:39` | `daysUntil()` off by one in non-UK timezones |
| 14 | `src/content/vendors.ts:357` | Vendor categories facet missing `.sort()` |
| 15 | `src/components/gallery/InspirationGallery.tsx:44` | Search query state desyncs from URL on back/forward navigation |
