<h1 align="center">Marram</h1>

<p align="center">
  <strong>A full-stack wedding studio platform — plan, build, and publish your perfect wedding.</strong>
</p>

<p align="center">
  <a href="https://wedding-planner-jet-seven.vercel.app">Live Demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="docs/PRD.md">Product Spec</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="docs/ARCHITECTURE.md">Architecture</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="docs/CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-Neon_Postgres-4caf50?logo=postgresql&logoColor=white" alt="Drizzle + Neon" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License" />
</p>

---

## What is Marram?

Marram is a wedding studio platform with three surfaces:

| Surface | Description |
|---------|-------------|
| **Public site** | Marketing pages, real-wedding stories, a curated venue and vendor directory, an inspiration gallery, and planning tools (budget calculator, timeline, quiz) |
| **Dashboard** | Authenticated planning hub — task checklist, guest list, budget tracker, saved items, vendor management, RSVP inbox |
| **Couple sites** | Each couple gets a publishable wedding page at `/w/their-names` with RSVP form, schedule, travel info, and photo gallery |

> **Sample content.** Weddings, venues, vendors, and couples on this site are invented for demonstration.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI** | React 19 · Tailwind CSS v4 · Framer Motion |
| **Language** | TypeScript 5 (strict) |
| **Database** | Neon Postgres · Drizzle ORM |
| **Auth** | NextAuth v5 (Google OAuth + Resend magic link) |
| **Rate Limiting** | Upstash Redis |
| **Email** | Resend |
| **State** | Zustand (persisted, auth-aware — localStorage for guests, server-backed for signed-in users) |
| **Validation** | Zod (every mutating API route) |
| **Hosting** | Vercel (Hobby tier, zero cost) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database (free tier)
- An [Upstash](https://upstash.com) Redis database (free tier)
- A [Resend](https://resend.com) API key (free tier)
- Google OAuth credentials (client ID + secret)

### Setup

```bash
git clone https://github.com/dooddles07/Wedding-Planner.git
cd Wedding-Planner
npm install
cp .env.example .env.local   # fill in the values
npm run db:push              # push schema to your Neon database
npm run dev                  # http://localhost:3000
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | NextAuth session encryption key |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `RESEND_API_KEY` | Resend email API key |
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for OG/meta tags |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run test` | Vitest (32 tests) |
| `npm run db:push` | Push the Drizzle schema to your database |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # Server endpoints (lead, inquiry, rsvp, publish-site, user-state)
│   ├── dashboard/          # Authenticated planning hub (10 sub-pages)
│   ├── w/[slug]/           # Published couple wedding sites
│   └── ...                 # Public marketing pages
├── components/
│   ├── chrome/             # Header, footer, navigation
│   ├── dashboard/          # Dashboard-specific components
│   ├── editorial/          # Photo, layout components
│   ├── forms/              # Form primitives
│   ├── site-builder/       # Wedding site builder + live preview
│   └── ui/                 # Buttons, chips, modals
├── content/                # Brand strings, venues, vendors, weddings (static data)
├── lib/
│   ├── auth/               # NextAuth config + local-data migration
│   ├── data/               # Auth-aware storage layer (localStorage ↔ server)
│   ├── db/                 # Drizzle schema + client
│   ├── email/              # Resend email templates
│   ├── store/              # Zustand stores (planning, saves, site)
│   └── ...                 # Utils, validation, rate limiting, SEO, analytics
└── types/                  # Shared TypeScript types
```

---

## Security

This project has gone through two full security audits with 30+ fixes applied:

- Rate limiting on all mutating routes (Upstash Redis)
- Zod validation on every write endpoint
- Ownership checks on all user-scoped data
- XSS prevention (CSP headers, HTML-escaped email bodies, `safeExternalUrl`)
- Auth-aware storage with migration safeguards against data loss
- RSVP abuse prevention (requires published + explicitly enabled)

See [`docs/SECURITY.md`](docs/SECURITY.md) for the full breakdown.

---

## Documentation

| Document | Contents |
|----------|----------|
| [`docs/PRD.md`](docs/PRD.md) | Product surfaces, audience, scope |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Stack, route map, data flow, state sync |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Drizzle schema, table design rationale |
| [`docs/API.md`](docs/API.md) | Every route: auth, rate limits, request/response |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Color/type tokens, brand, accessibility |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Auth, rate limiting, ownership, audit trail |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Milestone-level project history |

---

## Deployment

Deployed on [Vercel](https://vercel.com) (Hobby tier — zero cost):

```bash
vercel            # preview deploy
vercel --prod     # production deploy
```

All infrastructure services (Neon, Upstash, Resend) run on their free tiers.

---

## License

MIT — see [`LICENSE`](LICENSE).

---

<p align="center">
  Built by <a href="https://github.com/dooddles07">Brix</a>
</p>
