# Database

Neon (serverless Postgres) accessed through Drizzle ORM. Schema source of
truth is `src/lib/db/schema.ts` — there are no tracked SQL migration files;
`npm run db:push` (`drizzle-kit push`) diffs the schema straight onto the
database. `drizzle.config.ts` points it at `DATABASE_URL`. The client lives
at `src/lib/db/client.ts`.

## Auth.js adapter tables

These four tables have the exact shape `@auth/drizzle-adapter` requires —
don't restructure them without checking the adapter's expectations.

### `user`
| Column | Type | Notes |
|---|---|---|
| `id` | text, PK | `crypto.randomUUID()` |
| `name` | text | nullable |
| `email` | text | `not null unique` |
| `emailVerified` | timestamp | nullable |
| `image` | text | nullable |

### `account`
Composite PK `(provider, providerAccountId)`. `userId` → `user.id`,
`onDelete: cascade`. Standard OAuth token columns
(`refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`,
`id_token`, `session_state`).

### `session`
| Column | Type | Notes |
|---|---|---|
| `sessionToken` | text, PK | |
| `userId` | text | → `user.id`, `onDelete: cascade` |
| `expires` | timestamp | `not null` |

Session strategy is `database` (`src/lib/auth.ts`), so every authenticated
request resolves through this table, not a signed JWT.

### `verificationToken`
Composite PK `(identifier, token)`. Backs the Resend magic-link flow.

## App tables

### `user_state`
Composite PK `(user_id, key)`. The generic key-value store behind the
client's Zustand stores (see `docs/ARCHITECTURE.md` "Client state").

| Column | Type |
|---|---|
| `user_id` | text → `user.id`, `onDelete: cascade` |
| `key` | text |
| `value` | text (JSON-serialized store state, up to 1MB — `userStatePutSchema`) |
| `updated_at` | timestamp, `defaultNow()` |

`key` is restricted at the API layer to an allowlist (`USER_STATE_KEYS` in
`src/lib/validation.ts`: `planning`, `wedding-site`, `saves`, `leads`,
`inquiries`) so an authenticated user can't PUT arbitrarily many distinct
keys at up to 1MB each and grow the table without bound (audit P2-1). In
practice only `planning`, `wedding-site`, and `saves` are still written —
`leads`/`inquiries` are kept in the allowlist for backward compatibility but
nothing writes them anymore (see `MANAGED_KEYS` in `src/lib/data/storage.ts`).

### `leads`
One row per lead-capture form submission (hero, quiz, budget tool, guide,
contact, venue/vendor enquiry, newsletter, footer — see `Lead.source` union
in `src/types`). `context` is an open `jsonb` record carrying whatever the
originating surface knew (full quiz answers, a budget model, the slug being
enquired about). Written by `POST /api/lead`; triggers a Resend notification.

### `inquiries`
One row per venue/vendor-targeted enquiry. `targetSlug` + `targetType`
identify what was asked about. Written by `POST /api/inquiry`; triggers a
Resend notification.

### `wedding_sites`
| Column | Type | Notes |
|---|---|---|
| `slug` | text, **PK** | frozen once the site has ever published — see below |
| `user_id` | text | → `user.id`, `onDelete: set null` |
| `data` | jsonb, `not null` | validated against `weddingSiteDataSchema` before write |
| `published` | boolean, default `true` | |
| `published_at` | timestamp | |
| `updated_at` | timestamp | |

**Why `slug` is the primary key, not a generated id**: published sites are
addressed by slug at `/w/[slug]`, and the slug is derived from the couple's
names and frozen on first publish (`src/lib/store/site.ts`) so a published
URL never changes underneath a shared link.

**Why `user_id` is nullable (`onDelete: set null`) instead of cascading**:
deleting an account shouldn't silently delete a page other people may have
bookmarked or RSVP'd to. The tradeoff this creates — an orphaned published
row with `user_id = null` looking "unowned" — is exactly what
`POST /api/publish-site` has to guard against; see `docs/SECURITY.md`
("Ownership / slug takeover") for the guard, rather than duplicating it here.

### `rsvps`
| Column | Type | Notes |
|---|---|---|
| `id` | text, PK | |
| `site_slug` | text | → `wedding_sites.slug`, `onDelete: cascade` |
| `name` | text, `not null` | |
| `email` | text | nullable |
| `attending` | boolean, `not null` | |
| `guests` | integer, default `1` | 1–20, enforced by the route's Zod schema |
| `message` | text | nullable, max 2000 chars |
| `created_at` | timestamp | |

`onDelete: cascade` here (unlike `wedding_sites.user_id`) is deliberate:
RSVPs only make sense attached to a specific published page, so deleting
the page should delete them too.

## Applying schema changes

```bash
npm run db:push   # drizzle-kit push — diffs schema.ts onto DATABASE_URL
```

There's no migration history to replay; the schema file is authoritative.
If you need reversible, reviewable migrations (e.g. multiple environments
that must stay in lockstep), switch to `drizzle-kit generate` + a migration
runner — that's a deliberate scope decision this project hasn't made yet,
not an oversight.
