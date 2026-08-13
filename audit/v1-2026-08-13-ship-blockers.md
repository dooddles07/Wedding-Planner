# Ship-blockers

Fix before any real traffic or backend work. These are data-corrupting or structurally broken behaviors.

---

## 01 — `read()` silently corrupts lead history under async storage

**File:** `src/lib/data/repository.ts:24`

### Failure scenario

A backend integrator follows `docs/backend-integration.md §4` and swaps `storage.ts` with a server-backed async implementation. `storage.getItem()` now returns `Promise<string|null>`.

`raw` at line 24 is a truthy Promise object, so `!raw` does not short-circuit. `JSON.parse(raw as string)` coerces the Promise via `Object.prototype.toString()` to `'[object Promise]'`, which is invalid JSON — the `SyntaxError` is silently caught and `read()` returns `[]`.

In `createLead()` at line 42, `existing = read<Lead>('leads')` is always `[]`, so `write('leads', [lead, ...existing])` overwrites the entire lead history with only the newest submission on every form submit. Every prior lead record is permanently lost with no visible error.

---

## 02 — `clearAllStoredData()` bypasses the swappable storage binding

**File:** `src/lib/data/storage.ts:54`

### Failure scenario

Integrator replaces the storage export at line 47 with a server-backed `StateStorage`. All three planning stores now read/write the server. But `clearAllStoredData()` at lines 51–61 calls `window.localStorage` directly — it never goes through the storage binding — and `StateStorage`'s 3-method contract (`getItem/setItem/removeItem`) has no key-enumeration method, so this function structurally cannot route through the seam.

A couple who clicks 'Start again' gets the success toast while their server-side tasks, budget, guests, saves, and wedding site are completely untouched.

---

## 03 — `rebuildBudget()` discards manual allocation overrides

**File:** `src/lib/store/planning.ts:127`

### Failure scenario

A couple opens `/planning/budget`, manually adjusts catering from £10,350 to £8,000 via `setAllocated` (line 141), then moves the guest-count slider to add 10 more guests. `setWedding()` at line 108 calls `rebuildBudget()`, which at lines 122–131 rebuilds every allocated value from scratch and only restores `spent` values via `spendByCategory`. The manual catering allocation is silently reset to the model's value.

The comment at line 99 — "keeping whatever the couple has already overridden" — applies only to `spent`, not `allocated`. The claim is false for manual allocation overrides.

---

## 04 — `SiteBuilder` has no hydration guard, causing structural DOM mismatch

**File:** `src/components/site-builder/SiteBuilder.tsx:36`

### Failure scenario

A returning couple who previously added 2 extra schedule rows (6 total vs the default 4) opens `/dashboard/site`. The server renders the store's default initial state (4 schedule rows). The first client paint, after localStorage is loaded into the store, has 6 rows — a different node count than SSR. React's hydration reconciliation cannot match the 6-row client tree to the 4-row server markup, producing a hydration error and potentially broken interactivity.

`PublishedSite.tsx` in the same directory correctly gates on `hydrated` (lines 17–19). `SiteBuilder.tsx` has zero references to `hydrated` across its 463 lines.

---

## 05 — Wedding date one day early for visitors in negative-UTC-offset timezones

**File:** `src/components/site-builder/CoupleSite.tsx:28`

**Also affects:** `src/lib/utils.ts:39`, `src/app/(site)/weddings/[slug]/page.tsx:~63`

### Failure scenario

A couple sets their wedding date to 20 September 2026. `new Date('2026-09-20')` parses as `2026-09-20T00:00:00Z` (UTC midnight). `toLocaleDateString('en-GB', ...)` with no `timeZone` option reads that instant in the viewer's local timezone.

A guest opening the page from New York (UTC-5) — where UTC midnight for Sept 20 is still Sept 19 locally — sees the hero date read 'Saturday, 19 September 2026'. The same bug affects `daysUntil()` in `utils.ts:39` (dashboard countdown off by one) and the `weddings/[slug]` detail page.
