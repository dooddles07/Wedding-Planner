# Backend Design — Marram Wedding Studio

**Date:** 2026-08-13  
**Status:** Approved  
**Stack:** Supabase · Vercel · Resend  
**Constraint:** Zero cost (free tiers only)

---

## 1. Goal

Turn the complete, frozen frontend into a fully working production website:

- Contact and enquiry forms land in the studio's inbox and a database
- Couples create accounts; their planning data (tasks, budget, guests, wedding site) syncs across every device
- Published wedding site links (`/w/[slug]`) work from any browser on any device
- RSVP on couple sites sends a real email to the couple
- All 23 analytics events report to Vercel Analytics
- Guest (unauthenticated) mode still works — data lives in localStorage until sign-in

Nothing in `src/components/` changes except `CoupleSite.tsx` (RSVP) and `PublishedSite.tsx` (publish trigger). All four seams documented in `docs/backend-integration.md` are wired.

---

## 2. Stack

| Layer | Service | Free tier ceiling |
|---|---|---|
| Hosting + API routes | Vercel | 100 GB bandwidth, 100k serverless invocations/month |
| Database + Auth + Storage | Supabase | 500 MB Postgres, 50k MAU, 5 GB bandwidth, 500k edge calls |
| Transactional email | Resend | 100 emails/day, 3,000/month |
| Analytics | Vercel Analytics | Page views + custom events included |

A real wedding studio will not approach any of these limits.

---

## 3. Database schema

All tables in the `public` schema. UUID primary keys. `gen_random_uuid()` default. Row Level Security enabled on every table.

### 3.1 `user_state`

Replaces localStorage for authenticated users. Keyed by `(user_id, key)` where `key` matches the existing `marram:*` localStorage keys (without the prefix — the prefix is stripped at the adapter layer).

```sql
CREATE TABLE user_state (
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  key        TEXT    NOT NULL,
  value      TEXT    NOT NULL,   -- serialised JSON string
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);

ALTER TABLE user_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_state_self" ON user_state
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 3.2 `leads`

Every submission from `LeadForm` and `NewsletterForm`.

```sql
CREATE TABLE leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT,
  email        TEXT NOT NULL,
  wedding_date TEXT,
  location     TEXT,
  guest_count  INT,
  message      TEXT,
  source       TEXT NOT NULL,
  context      JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anonymous users may insert; nobody may read via client (service role only)
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);
```

### 3.3 `inquiries`

Venue and vendor enquiry forms.

```sql
CREATE TABLE inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_slug  TEXT NOT NULL,
  target_type  TEXT NOT NULL CHECK (target_type IN ('venue', 'vendor')),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  wedding_date TEXT,
  message      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inquiries_insert" ON inquiries FOR INSERT WITH CHECK (true);
```

### 3.4 `wedding_sites`

Published couple sites. Slug is derived from names and frozen on first publish (already enforced by `lib/store/site.ts`).

```sql
CREATE TABLE wedding_sites (
  slug         TEXT PRIMARY KEY,
  user_id      UUID REFERENCES auth.users ON DELETE SET NULL,
  data         JSONB    NOT NULL,   -- full WeddingSite object
  published    BOOLEAN  NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE wedding_sites ENABLE ROW LEVEL SECURITY;

-- Authenticated user writes their own slug
CREATE POLICY "sites_write_own" ON wedding_sites
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- World reads published sites
CREATE POLICY "sites_read_published" ON wedding_sites
  FOR SELECT USING (published = true);
```

### 3.5 `rsvps`

```sql
CREATE TABLE rsvps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_slug  TEXT REFERENCES wedding_sites(slug) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT,
  attending  BOOLEAN NOT NULL,
  guests     INT NOT NULL DEFAULT 1,
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Anonymous users may submit
CREATE POLICY "rsvps_insert" ON rsvps FOR INSERT WITH CHECK (true);

-- Site owner reads their RSVPs
CREATE POLICY "rsvps_read_own" ON rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wedding_sites ws
      WHERE ws.slug = rsvps.site_slug AND ws.user_id = auth.uid()
    )
  );
```

---

## 4. Authentication

### Providers

- **Magic link (email OTP)** — enabled in Supabase Auth dashboard, no config beyond SMTP (Supabase provides built-in SMTP on free tier)
- **Google OAuth** — enabled in Supabase Auth dashboard after creating a Google Cloud OAuth client (free)

### Session management

Use `@supabase/ssr` for cookie-based sessions compatible with Next.js App Router. Two Supabase clients:

- `src/lib/supabase/client.ts` — browser client (`createBrowserClient`)
- `src/lib/supabase/server.ts` — server client (`createServerClient` with `cookies()`)

### Middleware (`src/middleware.ts`)

Runs on every request. Two responsibilities:

1. **Session refresh** — calls `supabase.auth.getUser()` which transparently refreshes the session cookie if it has expired. Required by `@supabase/ssr` to prevent session drift.
2. **Route guard** — redirects unauthenticated requests to `/dashboard/*` to `/login?next={path}`

```ts
export const config = {
  matcher: ["/dashboard/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### Login page (`/login`)

Single-page component with:
- Email field → `supabase.auth.signInWithOtp({ email })` → "Check your inbox" confirmation
- "Continue with Google" button → `supabase.auth.signInWithOAuth({ provider: "google" })`
- After sign-in, redirect to `?next` param or `/dashboard`

### Guest mode and migration

Unauthenticated users can use all planning tools — localStorage is unchanged. On first sign-in:

1. Read all `marram:*` keys from localStorage
2. Upsert each into `user_state` (skip if server already has a newer value)
3. Clear localStorage copies

This runs once in the auth callback handler (`/auth/callback/route.ts`).

---

## 5. Storage seam

`src/lib/data/storage.ts` exports `storage: StateStorage`. Currently always `browserStorage`. New behaviour:

```
authenticated user  → supabaseStorage   (hits user_state table)
guest               → browserStorage    (unchanged, localStorage)
```

`supabaseStorage` (`src/lib/data/supabase-storage.ts`) implements `StateStorage`. Zustand's `persist` middleware runs in the browser, so this uses `createBrowserClient` — the browser Supabase client carries the session token automatically via the cookie set by `@supabase/ssr`.

```ts
import { createBrowserClient } from "@supabase/ssr";

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const supabaseStorage: StateStorage = {
  async getItem(key) {
    const { data } = await getClient()
      .from("user_state")
      .select("value")
      .eq("key", key)
      .single();
    return data?.value ?? null;
  },
  async setItem(key, value) {
    await getClient()
      .from("user_state")
      .upsert({ key, value, updated_at: new Date().toISOString() });
  },
  async removeItem(key) {
    await getClient().from("user_state").delete().eq("key", key);
  },
};
```

RLS on `user_state` uses `auth.uid()` which Supabase resolves from the JWT in the session cookie — no explicit `user_id` parameter needed in queries.

The three Zustand stores (`planning`, `saves`, `site`) pick this up automatically — no store changes. Hydration is already handled by the `hydrated` flag in each store.

`clearAllStoredData()` in `storage.ts` already routes through the storage binding (fixed in tier-2 audit) so it clears server state correctly.

---

## 6. Repository seam

`src/lib/data/supabase-repository.ts` implements `Repository`:

```ts
export const supabaseRepository: Repository = {
  async createLead(input) {
    const lead = { ...input, id: uuid(), createdAt: new Date().toISOString() };
    await supabase.from("leads").insert(lead);
    await sendEmail("lead", lead);          // Resend
    return lead;
  },
  async createInquiry(input) {
    const inquiry = { ...input, id: uuid(), createdAt: new Date().toISOString() };
    await supabase.from("inquiries").insert(inquiry);
    await sendEmail("inquiry", inquiry);    // Resend
    return inquiry;
  },
  async listLeads() {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    return data ?? [];
  },
};
```

The single binding at the bottom of `repository.ts` changes from `localRepository` to `supabaseRepository`. One line change.

The existing `fetch("/api/lead", ...)` fire-and-forget call in `localRepository` is removed — the server insert is now the source of truth. The `/api/lead` route becomes a thin wrapper used only for server-side validation (optional, can be retired).

---

## 7. Published wedding sites

### Publish flow

`lib/store/site.ts` `publish()` already sets `slug`, `published: true`, and calls `track()`. After those, add:

```ts
void fetch("/api/publish-site", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(get()),   // full WeddingSite state
}).catch(() => undefined);
```

`src/app/api/publish-site/route.ts`:
- Validates session (returns 401 if unauthenticated)
- Upserts row into `wedding_sites` with `user_id` from session

### `/w/[slug]` page

`src/app/w/[slug]/page.tsx` becomes a server component:

```ts
export default async function WeddingPage({ params }) {
  const supabase = createServerClient(/* cookies */);
  const { data: site } = await supabase
    .from("wedding_sites")
    .select("data")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!site) notFound();
  return <CoupleSite site={site.data} />;
}
```

`CoupleSite.tsx` is unchanged — pure presentation.

### Unpublish

`unpublish()` in `site.ts` fires `POST /api/publish-site` with `{ published: false }` — sets the flag in the DB. The page returns 404.

---

## 8. RSVP

`CoupleSite.tsx` currently renders:

```tsx
<button type="button" disabled className="...">RSVP</button>
<p>Demo build — the RSVP form is not wired to a mailbox.</p>
```

Replace with a real inline form:
- Fields: name (required), email (optional), attending (yes/no toggle), guest count, short message
- POST to `/api/rsvp`
- On success: confirmation message replaces the form

`src/app/api/rsvp/route.ts`:
- Validates fields
- Inserts into `rsvps`
- Fetches the site owner's email from `auth.users` via service role
- Sends RSVP notification email via Resend

New dashboard page `src/app/(app)/dashboard/rsvps/page.tsx`:
- Server component, authenticated
- Lists RSVPs for the user's published site(s)
- Simple table: name, attending, guests, message, date

---

## 9. Analytics

In `src/app/layout.tsx`, after imports:

```ts
import { track as vaTrack } from "@vercel/analytics";
import { setAnalyticsSink } from "@/lib/analytics";

// Called once at module level (client only)
if (typeof window !== "undefined") {
  setAnalyticsSink((event) => {
    const { name, ...props } = event;
    vaTrack(name, props);
  });
}
```

Add `<Analytics />` from `@vercel/analytics/next` to the layout JSX. Enable Vercel Analytics in the Vercel dashboard (one checkbox). All 23 typed events report immediately.

---

## 10. Email templates (Resend)

`src/lib/email/send.ts` — thin wrapper around Resend SDK:

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(type: "lead" | "inquiry" | "rsvp", payload: unknown) {
  await resend.emails.send({ from, to, subject, html } = buildTemplate(type, payload));
}
```

`src/lib/email/templates.ts` — four plain-HTML templates:

| Type | From | To | Subject |
|---|---|---|---|
| lead | `noreply@marram.studio` | `hello@marram.studio` | `New enquiry — {source}` |
| inquiry | `noreply@marram.studio` | `hello@marram.studio` | `Enquiry about {targetSlug}` |
| rsvp | `noreply@marram.studio` | couple's account email | `RSVP from {name}` |
| magic link | Handled by Supabase natively | — | — |

Resend requires a verified sending domain. `marram.studio` needs a DKIM/SPF DNS record (free, one-time setup in Resend dashboard).

---

## 11. New files

```
src/
  middleware.ts
  auth/
    callback/route.ts           — OAuth callback + local-data migration
  lib/
    supabase/
      client.ts                 — createBrowserClient
      server.ts                 — createServerClient (cookies)
    data/
      supabase-repository.ts
      supabase-storage.ts
    email/
      send.ts
      templates.ts
  app/
    login/
      page.tsx
    api/
      publish-site/route.ts
      rsvp/route.ts
    (app)/dashboard/rsvps/
      page.tsx
```

## 12. Modified files

```
src/lib/data/repository.ts              — swap binding (1 line)
src/lib/data/storage.ts                 — auth-aware adapter export
src/lib/store/site.ts                   — call publish-site API in publish()
src/app/api/lead/route.ts               — retire or thin-wrap (repo handles storage now)
src/app/w/[slug]/page.tsx               — server fetch from wedding_sites
src/components/site-builder/
  PublishedSite.tsx                     — fire publish-site API on publish
  CoupleSite.tsx                        — real RSVP form
src/app/layout.tsx                      — setAnalyticsSink + <Analytics />
src/app/(app)/dashboard/layout.tsx      — auth guard (redirect to /login)
```

---

## 13. Environment variables

```bash
# Supabase (from project dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server only, never NEXT_PUBLIC_

# Resend (from resend.com dashboard)
RESEND_API_KEY=re_...

# Site URL (set before deploying — fixes canonicals and OG)
NEXT_PUBLIC_SITE_URL=https://marram.studio
```

All added in Vercel dashboard → Project → Environment Variables.

---

## 14. Setup order (for implementation)

1. Create Supabase project → copy URL + keys
2. Run schema SQL (§3) in Supabase SQL editor
3. Enable Google OAuth in Supabase Auth dashboard
4. Create Resend account → verify `marram.studio` domain → copy API key
5. Enable Vercel Analytics in Vercel dashboard
6. Add all env vars to Vercel
7. Implement in code (writing-plans will sequence this)
8. Deploy

---

## 15. Out of scope

- Studio admin dashboard (lead management UI) — data is in DB, can be viewed via Supabase Studio for now
- Real-time RSVP updates — polling or manual refresh is fine at this scale
- File uploads (photos) — still served from Unsplash/CDN; Supabase Storage available if needed later
- Push notifications — email is sufficient
