# API

All routes live under `src/app/api/`. Every mutating route: rate-limits
first, validates with Zod second, touches the database third. On an
unexpected exception, routes fall back to a generic `400` (or `500` where
noted) rather than leaking internals.

## Rate limiting

Two Upstash Redis sliding-window tiers (`src/lib/rate-limit.ts`):

| Tier | Function | Limit | Key |
|---|---|---|---|
| Anonymous, per-IP | `checkRateLimit(request, scope)` | 5 requests / 60s | `` `${scope}:${ip}` `` |
| Authenticated, per-user | `checkUserRateLimit(userId, scope)` | 60 requests / 10s | `` `${scope}:${userId}` `` |

The IP-based tier resolves the client IP from `x-vercel-forwarded-for` first,
falling back to `x-real-ip`, then a best-effort parse of the (spoofable)
`x-forwarded-for`. Plain client-supplied XFF is trusted only as a last
resort, since a client can set any value it wants for that header on a
request it sends directly (audit P1-1). Every route below returns
`429 { error: "too many requests" }` when its limiter rejects.

## `POST /api/lead`
Public. Rate limit scope: `lead`.

Body validated against `leadSchema` (`src/lib/validation.ts`):
`name?`, `email` (required), `weddingDate?`, `location?`, `guestCount?`
(0–100000), `message?`, `source` (required, one of the `Lead.source` union),
`context?` (open record).

Inserts into `leads`, fires an outbound Resend notification (best-effort,
failure is logged not surfaced), returns the created `Lead` as JSON.

| Status | Body |
|---|---|
| 200 | the created `Lead` |
| 400 | `{ ok: false, error: "invalid data" \| "bad request" }` |
| 429 | `{ ok: false, error: "too many requests" }` |

## `POST /api/inquiry`
Public. Rate limit scope: `inquiry`.

Body validated against `inquirySchema`: `targetSlug`, `targetType`, `name`,
`email`, `weddingDate?`, `message?` — all required except the two dates/
message. Inserts into `inquiries`, fires a Resend notification, returns the
created `Inquiry`.

Status codes as `/api/lead`.

## `POST /api/rsvp`
Public. Rate limit scope: `rsvp`.

Body: `{ siteSlug, name, email?, attending, guests (1-20, default 1), message? (max 2000) }`
(inline schema in the route, not shared via `validation.ts`).

Before inserting, the route looks up `wedding_sites` by `siteSlug` and
**requires the site to be `published` and not have `rsvpEnabled: false`** in
its stored `data` — otherwise it returns `404`. This closes an abuse path
where someone who knows a couple's slug could keep POSTing RSVPs (each one
emailing the couple) after they've unpublished the site or turned RSVPs off
(audit P1-6). On success, inserts into `rsvps` and — if the site has an
owner — sends a Resend notification to the owner's email.

| Status | Body |
|---|---|
| 200 | `{ ok: true }` |
| 404 | `{ error: "RSVPs are not open for this site" }` |
| 400 | `{ error: "Invalid data" \| "bad request" }` |
| 429 | `{ error: "too many requests" }` |

## `POST /api/publish-site`
**Auth required.** Rate limit scope: `publish-site` (per-user tier).

1. `401` if unauthenticated.
2. Rejects non-object/array bodies, and anything whose serialized size
   exceeds 200,000 characters (`413`).
3. Validates against `publishSiteSchema` (`weddingSiteDataSchema.partial()`
   plus a required `slug` matching `^[a-z0-9-]+$`).
4. **`published: false`** → updates the row to unpublished (only if the
   caller owns the slug) and returns early.
5. Otherwise, looks up the existing row for that slug and enforces:
   a published site is never claimable by another user, and an unpublished/
   nonexistent slug is claimable only if unowned or already owned by the
   caller (`canClaimSlug`, `src/lib/ownership.ts`) — see `docs/SECURITY.md`
   for why the "already published" check exists as a separate condition,
   not just `canClaimSlug` alone.
6. Upserts (`onConflictDoUpdate`) the row with the caller as owner.

| Status | Body |
|---|---|
| 200 | `{ ok: true }` |
| 401 | `{ error: "Unauthorized" }` |
| 400 | `{ error: "Invalid data" \| "bad request" }` |
| 409 | `{ error: "slug already taken" }` |
| 413 | `{ error: "payload too large" }` |
| 429 | `{ error: "too many requests" }` |

## `/api/user-state`
**Auth required on every method.** Backs the server-side half of the client
storage adapter — see `docs/ARCHITECTURE.md` "Client state and the server sync".

### `GET /api/user-state?key=<key>`
Returns `{ value: string | null }` for `(session.user.id, key)`. `400` if
`key` is missing.

### `PUT /api/user-state`
Rate limit scope: `user-state-put` (per-user tier). Body validated against
`userStatePutSchema`: `key` must be one of the allowlisted
`USER_STATE_KEYS` (`planning`, `wedding-site`, `saves`, `leads`,
`inquiries`), `value` a string up to 1,000,000 characters. Upserts
`(userId, key) → value`.

On a DB failure past validation, returns **`500`**, not `400` — the client's
`setItem` now throws on any non-`ok` response, so a `500` here is what lets
the UI tell the couple their save didn't land instead of assuming it did
(audit P2-3).

### `DELETE /api/user-state?key=<key>`
Rate limit scope: `user-state-delete` (per-user tier). Deletes the
`(userId, key)` row. `400` if `key` is missing, `500` on DB failure.

| Status | Body |
|---|---|
| 200 | `{ value }` (GET) or `{ ok: true }` (PUT/DELETE) |
| 400 | `{ error: "key required" \| "invalid data" }` |
| 401 | `{ error: "Unauthorized" }` |
| 429 | `{ error: "too many requests" }` |
| 500 | `{ error: "could not save" \| "could not delete" }` |

## `/api/auth/[...nextauth]`
NextAuth v5 catch-all — sign-in/callback/session/CSRF endpoints for the
Google OAuth and Resend magic-link providers configured in
`src/lib/auth.ts`. Not hand-rolled; behavior is the NextAuth default for a
database-session setup.
