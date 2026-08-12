# Backend integration

The frontend is complete and frozen. This is everything you need to put a real
backend behind it without touching a component.

Nothing here is a suggestion about *how* to build the backend — that's yours.
It's a description of the contracts the frontend already expects.

---

## 1. The short version

There are **four seams**. Everything else is presentation.

| File | What it is | What you do |
|---|---|---|
| `src/lib/data/repository.ts` | `Repository` interface + a local implementation | Implement the interface, rebind the exported `repository` |
| `src/lib/data/storage.ts` | A `StateStorage` adapter used by all three client stores | Swap it and all persisted state moves server-side at once |
| `src/app/api/lead/route.ts` | The only real endpoint. Validates and logs | Point it at your inbox / CRM / database |
| `src/lib/analytics.ts` | 23 typed events into a no-op sink | Call `setAnalyticsSink()` once with your provider |

Two routes additionally need server data rather than a swap:
`/w/[slug]` (published couple sites) and anything you decide to gate behind auth.

---

## 2. Your schema is already written

`src/types/index.ts` is the domain model. Sixteen entities, all exported, all
already used by the UI. The demo data in `src/content/*` conforms to them
exactly, so if your API returns these shapes nothing downstream changes.

**Content entities** — currently static files, read at build time:

| Type | File | Notes |
|---|---|---|
| `WeddingStory` | `content/weddings.ts` | Nested `StoryChapter[]`, `runningOrder`, `credits` |
| `Inspiration` | `content/inspiration.ts` | Drives the gallery's facets — see §5 |
| `Venue` | `content/venues.ts` | Has `faqs`, `coordinates`, `availability` |
| `Vendor` | `content/vendors.ts` | Carries a `demo: true` flag the UI renders honestly |
| `Service` | `content/services.ts` | Fees are indicative bands |
| `WeddingStyle` | `content/styles.ts` | The spine — quiz weights and all tagging reference these ten ids |
| `FAQ` | `content/faq.ts` | Grouped |
| `Photograph` | `content/media.ts` | See §6 |

**User entities** — currently in the browser:

| Type | Store | localStorage key |
|---|---|---|
| `Task`, `BudgetItem`, `Guest`, wedding details | `lib/store/planning.ts` | `marram:planning` |
| `SavedItem` | `lib/store/saves.ts` | `marram:saves` |
| `WeddingSite` | `lib/store/site.ts` | `marram:wedding-site` |
| `Lead`, `Inquiry` | `lib/data/repository.ts` | `marram:leads`, `marram:inquiries` |

Every key is prefixed `marram:` — see `PREFIX` in `storage.ts`.

---

## 3. Seam one — `Repository`

```ts
export interface Repository {
  createLead(input: Omit<Lead, "id" | "createdAt">): Promise<Lead>;
  createInquiry(input: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry>;
  listLeads(): Promise<Lead[]>;
}
```

Implement it, then change the single binding at the bottom of the file:

```ts
export const repository: Repository = localRepository; // <- yours here
```

**Every form on the site calls this.** `Lead.source` is a union
(`hero | quiz | budget | guide | contact | venue | vendor | service |
newsletter | footer`) so you can route by origin, and `Lead.context` is an
open record carrying whatever the surface knew — the full quiz answers, the
budget model, the venue slug being enquired about.

Callers: `components/forms/LeadForm.tsx`, `components/chrome/NewsletterForm.tsx`.

---

## 4. Seam two — persistence

All three stores are Zustand with `persist`, and all three take their storage
from one place:

```ts
// lib/data/storage.ts
export const storage: StateStorage =
  typeof window === "undefined" ? noopStorage : browserStorage;
```

`StateStorage` is three methods: `getItem`, `setItem`, `removeItem`, each
taking a string key and returning/accepting a JSON string (sync or promised).
Replace it with a server-backed implementation and tasks, budget, guests,
saves and the wedding site all persist against an account with no component
changes.

Two things to know:

- **Hydration is already handled.** Every store exposes a `hydrated` flag and
  every component that reads persisted state waits for it. Server-rendered
  markup never disagrees with the client. Keep that contract if you go async.
- `clearAllStoredData()` in the same file wipes every `marram:` key — wired to
  the reset control in dashboard settings.

---

## 5. What the UI derives, and what it needs

The gallery and directories build their filter facets **from the data**, not
from a hard-coded list:

```ts
// content/inspiration.ts
export const inspirationFacets = {
  styles:     [...new Set(inspiration.flatMap((i) => i.styleIds))].sort(),
  seasons:    ["spring", "summer", "autumn", "winter"],
  locations:  [...new Set(inspiration.map((i) => i.location))].sort(),
  venueTypes: [...new Set(inspiration.map((i) => i.venueType))].sort(),
  moods:      [...new Set(inspiration.flatMap((i) => i.mood))].sort(),
};
```

`venueFacets` and `vendorFacets` do the same. If you serve this from a
database, either keep computing facets from the result set or return them
alongside it — the components only need the arrays.

**Gallery filter state lives in the URL** (`/inspiration?style=garden&season=autumn`),
so a filtered view is shareable. If you move filtering server-side, keep the
query-parameter names: `style`, `season`, `location`, `venue`, `mood`, `q`.

---

## 6. Photography

`content/media.ts` is a keyed register. Components reference a **role key**
(`first-light`, `venue-elmhurst`), never a URL, and the register maps that to
a photograph with alt text, a dominant `tone` and an aspect.

- 71 keys resolve to 62 unique photographs. Remaining reuse is same-subject
  pairs (a dress is a dress). Two are weak stand-ins and want real photography:
  `vendor-transport` and `vendor-beauty`.
- `photoUrl()` builds the CDN URL; `tonePlaceholder()` builds the blur. Swap
  both for your storage and every image on the site follows.
- `Photograph` already has `credit` and `creditUrl` fields, currently pointing
  at Unsplash. Backfill per photograph if you license real work.
- Alt text is written once, in the register, and inherited everywhere. Keep it
  there rather than at call sites.

---

## 7. Routes

84 routes. Everything public is static or SSG; the only dynamic ones are
`/api/lead` and `/w/[slug]`.

**Already `noindex` and disallowed in `robots.ts`:** all ten `/dashboard/*`
routes, `/w/*`, `/api/*`. Nothing about a couple's planning reaches a search
index.

**`/w/[slug]` — published couple sites.** Currently client-rendered from the
couple's own browser, which means a published site only opens on the device
that made it. `components/site-builder/PublishedSite.tsx` is the piece to
replace with a server fetch by slug. `CoupleSite.tsx` underneath it is pure
presentation and does not change.

The slug is derived from the couple's names and **frozen on first publish** —
see the comment in `lib/store/site.ts`. A published URL that changes is a
broken one.

**No auth exists.** `/dashboard` is open to anyone with the URL. Public
browsing is deliberately open too — nobody hits a sign-in wall before they've
seen anything, which is the conversion design. Gate the dashboard, saves and
the site builder; leave the marketing pages alone.

---

## 8. Deliberately stubbed

Each of these is a decision, not an oversight:

- **RSVP** on the published couple site is a disabled button with a visible
  note. It needs a mailbox behind it.
- **`/api/lead`** validates that `email` is present and logs a structured
  record. Response is `{ ok: true }`.
- **Analytics** fires 23 typed events at real call sites into a no-op sink.
  `setAnalyticsSink(fn)` is the only wiring needed. Names are fixed in the
  union so they can't drift.
- **All demo content is labelled as such in the UI** — the footer, testimonials,
  vendor profiles, venue pages and `/terms` all say the weddings and suppliers
  are invented. If you replace the data, remove those notices; `demoNotice` in
  `content/brand.ts` is the string.

---

## 9. Brand and environment

- **Every brand string is in `content/brand.ts`** — name, wordmark, address,
  email, phone, social, and the `voice` object. Renaming the studio is one file.
- **`NEXT_PUBLIC_SITE_URL`** is the only env var the frontend reads. It sets
  canonicals, Open Graph URLs, the sitemap and JSON-LD `@id`s. Defaults to
  `https://marram.studio`. Set it before deploying or your canonicals lie.
- **Design tokens are CSS variables** in `app/globals.css` under `@theme`.
  Nothing hardcodes a colour except the focus ring, which is deliberate and
  commented.

---

## 10. Measured state at handoff

Production build, 4× CPU throttle, cold cache, 10 Mbps:

| Page | LCP | CLS | JS transferred |
|---|---|---|---|
| `/` | 1612ms | 0 | 352KB |
| `/weddings/[slug]` | 840ms | 0 | 355KB |
| `/inspiration` | 400ms | 0 | 355KB |
| `/venues` | 592ms | 0 | 355KB |
| `/planning/budget` | 1016ms | 0 | 369KB |

CLS is zero on every page measured — images reserve their aspect box and paint
a dominant-tone placeholder before they load. Keep that if you change the
image pipeline.

Cross-origin image bytes are not counted in the JS/total figures above
(`transferSize` is 0 without `Timing-Allow-Origin`), so real transfer is
higher than the table suggests.

Accessibility: every text colour pair clears WCAG 2.2 AA, all focusable
elements take a visible ember focus ring immediately, and `prefers-reduced-motion`
disables every animation including smooth scroll.
