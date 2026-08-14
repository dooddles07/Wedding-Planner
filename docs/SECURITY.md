# Security

This documents the controls actually in the codebase, organized by concern.
Most trace back to two hardening passes on 2026-08-14 — a 15-finding audit
(`audit/v1-2026-08-13-*.md`, three tiers: ship-blockers, integration-blockers,
cleanup) and a follow-up full-project audit (commit `ddee9e5`, 20 further
findings across P0–P3). Findings are cited by their audit tag where the
source comments carry one.

## Authentication
NextAuth v5, database session strategy (`src/lib/auth.ts`) — sessions are
rows in Postgres (`docs/DATABASE.md`), not self-contained JWTs, so a session
can be revoked by deleting a row. Two providers: Google OAuth and Resend
magic-link email. `src/proxy.ts` gates every `/dashboard/*` request through
`auth()` and redirects unauthenticated requests to `/login`.

**Open-redirect guard**: the post-login `next` destination is restricted to
same-site relative paths — must start with `/` and not `//` or `/\` —
before being handed to `signIn()` (`src/app/login/actions.ts:5-11`,
commit `0667daa`). Without this, `next` could be crafted to bounce a
successful login to an attacker-controlled host.

## Rate limiting
Two-tier Upstash Redis sliding window (`src/lib/rate-limit.ts`):
anonymous/IP-based (5 req/60s) for public routes, per-user (60 req/10s) for
authenticated write routes. The IP tier trusts `x-vercel-forwarded-for` (set
by Vercel's edge from the real connecting client, not overridable by the
request itself) or `x-real-ip` ahead of the client-suppliable
`x-forwarded-for`, closing a bucket-rotation bypass where a client could set
a fresh XFF value per request to dodge the limit (audit P1-1). See
`docs/API.md` for which scope guards which route.

## Ownership and slug takeover
`src/lib/ownership.ts` (`canClaimSlug`) treats a slug as claimable if it's
unowned (`null`/`undefined` owner) or already owned by the requester. Alone,
that's not sufficient: `wedding_sites.user_id` is `onDelete: set null`
(`docs/DATABASE.md`), so a **published** site whose owner account was later
deleted would read as unowned by `canClaimSlug` alone — letting anyone seize
a live page. `POST /api/publish-site` adds an explicit separate condition:
a row with `published: true` is never claimable regardless of `user_id`,
full stop (`publish-site/route.ts:52-65`, audit P0-3).

## Abuse guards
- **RSVP spam / harassment**: `POST /api/rsvp` requires the target site to
  be `published` and not have `rsvpEnabled: false` before inserting or
  emailing the owner — otherwise a slug leak alone would let anyone keep
  emailing a couple who'd unpublished or turned RSVPs off (audit P1-6,
  `rsvp/route.ts:32-48`).
- **Unbounded `user_state` growth**: PUT keys are restricted to an
  allowlist (`USER_STATE_KEYS` in `src/lib/validation.ts`) instead of
  accepting any string — without it, an authenticated user could PUT
  arbitrarily many distinct keys at up to 1MB each (audit P2-1).
- **Oversized payloads**: `POST /api/publish-site` rejects bodies whose
  serialized size exceeds 200,000 characters before validating them.

## Stored XSS / injection (commit `0667daa`)
- **Outbound email HTML**: user-supplied text (names, messages, locations,
  etc.) is escaped before interpolation into HTML email bodies —
  `escapeHtml()` in `src/lib/email/escape.ts`, used throughout
  `src/lib/email/templates.ts`.
- **`javascript:` URLs**: the registry-link field is validated as an
  `http(s)`-only URL (`safeUrl` in `src/lib/validation.ts`), rejecting
  `javascript:`/other schemes before it can be rendered as a link on a
  published site.
- **Header injection**: outbound email subject lines strip CR/LF from
  user-supplied inputs (`src/lib/email/templates.ts`), closing an
  email-header-injection path.
- **JSON-LD injection**: `<` is escaped defensively inside the JSON-LD
  embedded in `<script>` tags (`src/components/seo/JsonLd.tsx`, commit
  `ddee9e5`, P3) so a value containing `</script>` can't break out of it.
- **Raw-body storage**: `POST /api/publish-site` validates the request body
  against `weddingSiteDataSchema` and stores the *parsed* result, not the
  raw JSON body — closing a path where an unvalidated field could sit in
  `wedding_sites.data` and be rendered later on the published site.
- **CSP and related headers**: `next.config.ts` sets a Content-Security-Policy
  (`default-src 'self'`, image sources restricted to `self` + the Unsplash
  CDN, `frame-ancestors 'none'`, `form-action 'self'`, etc.) plus
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy`
  disabling camera/microphone/geolocation, and HSTS.

## Input validation
Every mutating route validates its body with Zod (`src/lib/validation.ts`,
or an inline schema for `/api/rsvp`) before touching the database — field-
level max lengths throughout (e.g. `message` capped at 2000–5000 chars
depending on route, `story` at 10,000, `slug` restricted to
`^[a-z0-9-]+$`). See `docs/API.md` for the schema attached to each route.

## Data-loss guards
Two P0 fixes in the client storage layer (`src/lib/data/storage.ts`,
commit `ddee9e5`) exist specifically so a transient server error can never
be mistaken for "no data yet" and silently overwrite a couple's real saved
state:
- A failed `user-state` read **throws** instead of resolving `null`.
- Anonymous→account data migration is **awaited** before the first
  server-backed read.

The `user-state` PUT route itself returns `500` (not `400`) on a DB failure
past validation, so the client — which now throws on any non-`ok` response —
surfaces the failure instead of assuming the save landed (audit P2-3).

## Secrets and environment
See `.env.example` for the full inventory: Google OAuth client id/secret,
`AUTH_SECRET`, `DATABASE_URL` (Neon), the Upstash `KV_*`/`REDIS_URL` set,
`RESEND_API_KEY`, and the public `NEXT_PUBLIC_SITE_URL`. `.env.local` is
gitignored and must never be committed; `.env.example` holds only empty
placeholders.

## Audit trail
- `audit/v1-2026-08-13-*.md` — the original 15-finding, three-tier audit
  (ship-blockers, integration-blockers, cleanup) run right after the backend
  was wired up.
- Commit `ddee9e5` — a full-project follow-up audit, 20 further zero-cost
  fixes across P0 (data-loss/account-takeover) through P3 (cleanup); the
  commit message itself is a de facto findings list.
- Commit `0667daa` — the stored-XSS/email-injection/CSP pass described above.
