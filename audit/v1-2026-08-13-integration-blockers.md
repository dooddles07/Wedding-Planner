# Integration blockers

Fix before backend work begins. These are mismatches between the documented integration contract and actual behavior.

---

## 06 — `createInquiry()` is dead code

**File:** `src/lib/data/repository.ts:56`

### Failure scenario

`docs/backend-integration.md §3` documents `createInquiry` and the `marram:inquiries` localStorage key as a live, parallel path to leads. An integrator builds a backend pipeline for `Inquiry` — a distinct CRM table with `targetSlug/targetType` fields from `src/types/index.ts:433–443`.

After deployment, the Inquiry table receives zero submissions. Every venue enquiry ('Ask about this venue') and vendor enquiry goes through `<LeadForm source='venue'|'vendor'>`, which calls `repository.createLead()`. `createInquiry()` has zero call sites in `src/`. The integrator's pipeline is permanently silent.

---

## 07 — Slug collision: same-name couples overwrite each other's page

**File:** `src/lib/store/site.ts:104`

### Failure scenario

Slug is computed deterministically by `slugify(partnerOne + '-and-' + partnerTwo)`. Two couples named 'Alex and Jordan' both compute `slug: 'alex-and-jordan'`. Neither `publish()` at lines 102–110 nor `update()` at lines 87–100 checks for collision. `SiteBuilder.tsx`'s publish button has no error state for a conflict response.

The second couple to publish silently overwrites the first couple's live page, or hits a database unique-constraint error with no user-visible feedback. `WeddingSite` has no `id` or `ownerId` field — slug is the sole identity.

---

## 08 — `NewsletterForm` submit button stuck permanently on backend rejection

**File:** `src/components/chrome/NewsletterForm.tsx:40`

### Failure scenario

Integrator replaces repository with a real backend. A user submits the newsletter form while offline or when the backend returns a 5xx. `repository.createLead()` rejects. The rejection is unhandled — `onSubmit` has no `try/catch` — so state stays `'sending'` and the submit button (`disabled={state === 'sending'}`) is permanently disabled for the rest of the session with no error shown.

Contrast: `LeadForm.tsx:84–100` correctly wraps the identical call in `try/catch` with a `setState('failed')` fallback.

---

## 09 — 8 of 23 `AnalyticsEvent` members have zero call sites

**File:** `src/lib/analytics.ts:10`

### Failure scenario

An analytics integrator calls `setAnalyticsSink()` expecting all 23 documented event types. These 8 events never fire:

- `page_view`
- `venue_viewed`
- `vendor_viewed`
- `wedding_story_viewed`
- `checklist_started`
- `timeline_saved`
- `account_created`
- `guide_downloaded`

The `/venues/[slug]`, `/vendors/[slug]`, and `/weddings/[slug]` detail pages import no analytics module at all. Any funnel or attribution built around these 8 types shows zero events permanently — not a data delay, but missing instrumentation the spec claimed was already in place.

---

## 10 — `demoNotice` only controls the Footer

**File:** `src/content/brand.ts:103`

### Failure scenario

`docs/backend-integration.md §8` instructs: "If you replace the data, remove those notices; `demoNotice` in `content/brand.ts` is the string." An integrator empties `demoNotice` and ships.

The footer no longer shows the notice. But these surfaces are unaffected:

| File | Hardcoded string |
|------|-----------------|
| `src/app/(site)/vendors/[slug]/page.tsx:157` | "Sample profile, invented for this build. We take no commission." |
| `src/app/(site)/venues/[slug]/page.tsx:265` | "Sample venue, invented for this build. Prices are indicative bands." |
| `src/app/(site)/terms/page.tsx:16–18` | "This is a demonstration build." |
| `src/components/home/Voices.tsx:77` | "Sample quotes." |

The production site with real data still carries demo disclaimers on every vendor profile, venue page, and the terms page.
