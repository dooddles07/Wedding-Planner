<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Marram

Wedding studio site: public marketing and directory, an authenticated
planning dashboard for engaged couples, and per-couple publishable wedding
sites (`/w/[slug]`). Deployed on Vercel (Hobby plan, zero cost).

Full docs in `docs/` — read the relevant one before touching that area:

- `docs/ARCHITECTURE.md` — stack, route map, data flow, client/server state sync
- `docs/DATABASE.md` — Drizzle schema, why each table is shaped the way it is
- `docs/API.md` — every route's auth requirement, rate limit, and schema
- `docs/SECURITY.md` — auth, rate limiting, ownership checks, injection fixes
- `docs/DESIGN.md` — color/type tokens, brand content, accessibility commitments
- `docs/PRD.md` — product surfaces and current scope
- `docs/CHANGELOG.md` — milestone history

## Conventions
- Every mutating API route rate-limits first, validates with Zod
  (`src/lib/validation.ts`) second, touches the database third — match this
  order in new routes. See `docs/API.md` for the existing pattern.
- Read `src/lib/validation.ts` and `src/lib/db/schema.ts` before changing an
  API route's request shape — several fields carry an audit-fix comment
  (`audit P0-*`/`P1-*`/`P2-*`) explaining a non-obvious constraint (size caps,
  key allowlists, ownership checks). Don't loosen one without reading why it's
  there — check `docs/SECURITY.md` first.
- Brand strings, nav, and voice copy live only in `src/content/brand.ts` —
  don't hardcode brand text elsewhere.
- Date strings in YYYY-MM-DD format must be parsed with `parseLocalDate()`
  from `src/lib/utils.ts`, never `new Date()` — the latter treats them as
  UTC midnight, causing off-by-one display in western timezones.
- Before considering a change done: `npm run lint && npm run typecheck && npm run test`.
