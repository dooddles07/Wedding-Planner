# Marram

A wedding studio site: a public marketing/directory experience, a free
planning dashboard for engaged couples, and per-couple publishable wedding
sites — built on Next.js 16, Neon Postgres, and NextAuth. See
[`docs/PRD.md`](docs/PRD.md) for what it does and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
for how it's built.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Drizzle ORM + Neon Postgres · NextAuth v5 (Google OAuth + Resend
magic-link) · Upstash Redis (rate limiting) · Resend (email) · Zustand ·
Zod · `react-hook-form`.

## Prerequisites
- Node.js
- A [Neon](https://neon.tech) Postgres database
- An [Upstash](https://upstash.com) Redis database
- A [Resend](https://resend.com) API key
- Google OAuth credentials (client id + secret)

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run db:push              # push src/lib/db/schema.ts to DATABASE_URL
npm run dev
```

`.env.local` needs: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`,
`DATABASE_URL`, the Upstash `KV_*`/`REDIS_URL` set, `RESEND_API_KEY`, and
`NEXT_PUBLIC_SITE_URL`. Never commit `.env.local`.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |
| `npm run db:push` | Push the Drizzle schema to `DATABASE_URL` |

## Docs

| Doc | Covers |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product surfaces, audience, current scope |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Stack, route map, data flow, client/server state sync |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Schema, tables, why each design choice was made |
| [`docs/API.md`](docs/API.md) | Every route: auth, rate limits, request/response shapes |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Color/type tokens, brand content, photography, accessibility |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Auth, rate limiting, ownership, XSS/injection fixes, audit trail |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Milestone-level project history |
| [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md) | Instructions for AI coding agents working in this repo |
| [`audit/`](audit) | The original 15-finding security/data-integrity audit |

## License
MIT — see [`LICENSE`](LICENSE).
