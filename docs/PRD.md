# Product overview

> Reconstructed from the codebase (`src/content/brand.ts`, route structure,
> component tree) rather than a standalone product spec — treat it as a
> description of what's built, not a source of new requirements.

## What Marram is
Marram is a wedding studio's site: a public marketing and directory
experience for a (fictional, demo) full-service wedding planning studio in
Aldeburgh, Suffolk, paired with a free planning toolset for engaged couples
and a way for those couples to publish their own wedding website.

> "We plan weddings in Britain and Europe. Around forty a year, which is
> fewer than we could take and about right." — `src/content/brand.ts`

## Audience
Engaged couples planning a wedding in Britain or Europe, at any stage from
"just engaged, no plan yet" (served by the quiz and guide) through active
planning (dashboard tools) to the final weeks (RSVP collection, published
site).

## Surfaces

### 1. Public marketing + directory site
Real-weddings gallery, inspiration gallery (filterable by style/season/
location/venue type/mood), venue directory, vendor directory, service
listings, a styles quiz that recommends a "wedding style" and routes into
relevant content, an editorial guide, FAQ, about/contact. Every directory
page ends in a lead-capture form (`POST /api/lead` or `/api/inquiry`)
tagged with its originating surface (`Lead.source` union: `hero`, `quiz`,
`budget`, `guide`, `contact`, `venue`, `vendor`, `service`, `newsletter`,
`footer`).

Deliberately open: nobody hits a sign-in wall before they've seen content —
public browsing works with no account, which is the conversion design for
a studio site (visit, get value, then enquire or sign up).

### 2. Planning dashboard (`/dashboard/*`, auth required)
Budget planner, guest list, task checklist, timeline, saved inspiration/
venues/vendors, RSVP inbox, site builder, settings. State is Zustand-backed
and synced to the couple's account server-side (`docs/ARCHITECTURE.md`
"Client state and the server sync") — it also works signed-out, backed by
`localStorage`, and migrates up on first sign-in.

### 3. Couple's published wedding site (`/w/[slug]`, public)
Built in the dashboard's site builder, published via `POST /api/publish-site`
to a slug derived from the couple's names and frozen on first publish. Three
templates (`first-light`, `long-table`, `last-dance`). Sections: hero/story,
schedule, travel, accommodation, dress code, registry, gallery, and an
optional RSVP form (`POST /api/rsvp`) that a couple can enable/disable per
site. Not indexed by search engines by design (`src/app/robots.ts`).

## Explicitly out of scope / demo status
- **All directory content is invented.** Weddings, venues, vendors, and
  couples shown across the site are demo data, disclosed in-UI via
  `demoNotice` (`src/content/brand.ts:103`) on the footer and elsewhere.
- **No payments.** There's no billing, deposit, or payments integration
  anywhere in the app — enquiries route to email, not checkout.
- **No search-engine indexing for private or per-couple content** —
  `/dashboard/*`, `/w/*`, and `/api/*` are disallowed in `robots.ts`.
